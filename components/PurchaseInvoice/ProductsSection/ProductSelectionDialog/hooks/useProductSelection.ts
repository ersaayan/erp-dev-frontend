import { useState, useCallback, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { StockItem } from '../../../types';
import { Current } from '@/components/CurrentList/types';

interface SearchResult {
    id: string;
    productCode: string;
    productName: string;
    unit: string;
    stockCardPriceLists: Array<{
        price: string;
        vatRate: string;
        priceListId: string;
        priceList: {
            currency: string;
            isVatIncluded: boolean;
        };
    }>;
    stockCardWarehouse: Array<{
        quantity: string;
    }>;
}

interface UseProductSelectionProps {
    warehouseId: string;
    current: Current | null;
    existingProducts: StockItem[];
    onProductsSelect: (products: StockItem[]) => void;
}

export const useProductSelection = ({
    warehouseId,
    current,
    existingProducts = [],
    onProductsSelect,
}: UseProductSelectionProps) => {
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { toast } = useToast();
    const initializedRef = useRef(false);

    // Initialize selected products only once when component mounts or existingProducts changes
    useEffect(() => {
        if (!initializedRef.current && Array.isArray(existingProducts)) {
            const existingIds = existingProducts.map(product => product.stockId);
            setSelectedProducts(existingIds);
            initializedRef.current = true;
        }
    }, [existingProducts]);

    const fetchProducts = useCallback(async (pageNumber: number = 1) => {
        if (!warehouseId || !current) return;

        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.BASE_URL}/stockcards/byWarehouse/${warehouseId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
                    },
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }

            const data = await response.json();
            setResults(data.items);
            setTotalPages(data.totalPages);
            setPage(pageNumber);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch products",
            });
        } finally {
            setLoading(false);
        }
    }, [warehouseId, current, toast]);

    const handleProductSelection = useCallback((productId: string) => {
        setSelectedProducts(prev => {
            if (prev.includes(productId)) {
                return prev.filter(id => id !== productId);
            }
            return [...prev, productId];
        });
    }, []);

    const handleAddSelectedProducts = useCallback(() => {
        if (!Array.isArray(existingProducts)) {
            console.error('existingProducts is not an array');
            return;
        }

        const selectedItems = results
            .filter((result) => selectedProducts.includes(result.id))
            .map((result) => {
                const priceListItem = result.stockCardPriceLists.find(
                    (pl) => pl.priceListId === current?.priceList?.id
                );

                if (!priceListItem) {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: `No price found for ${result.productName}`,
                    });
                    return null;
                }

                const unitPrice = parseFloat(priceListItem.price);
                const vatRate = parseFloat(priceListItem.vatRate);

                // Get existing product quantity if it exists
                const existingProduct = existingProducts.find(p => p.stockId === result.id);
                const quantity = existingProduct?.quantity || 1;

                return {
                    id: crypto.randomUUID(),
                    stockId: result.id,
                    stockCode: result.productCode,
                    stockName: result.productName,
                    quantity,
                    unit: result.unit,
                    stockLevel: parseInt(result.stockCardWarehouse[0]?.quantity || "0"),
                    unitPrice,
                    vatRate,
                    vatAmount: (quantity * unitPrice * vatRate) / 100,
                    totalAmount: quantity * unitPrice + (quantity * unitPrice * vatRate) / 100,
                    priceListId: priceListItem.priceListId,
                    currency: priceListItem.priceList.currency,
                    isVatIncluded: priceListItem.priceList.isVatIncluded,
                };
            })
            .filter((item): item is StockItem => item !== null);

        onProductsSelect(selectedItems);
    }, [results, selectedProducts, current, existingProducts, onProductsSelect, toast]);

    // Reset initializedRef when dialog closes
    useEffect(() => {
        return () => {
            initializedRef.current = false;
        };
    }, []);

    return {
        results,
        loading,
        selectedProducts,
        page,
        totalPages,
        fetchProducts,
        handleProductSelection,
        handleAddSelectedProducts,
    };
};
