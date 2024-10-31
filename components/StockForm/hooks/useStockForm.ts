import { useState } from 'react';

interface StockFormState {
    stockCard: {
        productCode: string;
        productName: string;
        unit: string;
        shortDescription: string;
        description: string;
        productType: string;
        gtip: string;
        pluCode: string;
        desi: number;
        adetBoleni: number;
        siraNo: string;
        raf: string;
        karMarji: number;
        riskQuantities: number;
        stockStatus: boolean;
        hasExpirationDate: boolean;
        allowNegativeStock: boolean;
        maliyetFiyat: number;
        maliyetDoviz: string;
        brandId: string;
    };
    attributes: Array<{ attributeId: string; value: string }>;
    barcodes: Array<{ barcode: string }>;
    categoryItem: Array<{ categoryId: string }>;
    priceListItems: Array<{
        priceListId: string;
        price: number;
        vatRate: number | null;
        priceWithVat: number | null;
        barcode: string;
    }>;
    stockCardWarehouse: Array<{ id: string; quantity: number }>;
    eFatura: Array<{
        productCode: string;
        productName: string;
        stockCardPriceListId: string;
    }>;
    manufacturers: Array<{
        productCode: string;
        productName: string;
        barcode: string;
        brandId: string;
        currentId: string;
    }>;
    marketNames: Array<{ marketName: string }>;
}

const initialState: StockFormState = {
    stockCard: {
        productCode: '',
        productName: '',
        unit: '',
        shortDescription: '',
        description: '',
        productType: 'BasitUrun',
        gtip: '',
        pluCode: '',
        desi: 0,
        adetBoleni: 1,
        siraNo: '',
        raf: '',
        karMarji: 0,
        riskQuantities: 0,
        stockStatus: true,
        hasExpirationDate: false,
        allowNegativeStock: false,
        maliyetFiyat: 0,
        maliyetDoviz: 'USD',
        brandId: '',
    },
    attributes: [],
    barcodes: [],
    categoryItem: [],
    priceListItems: [],
    stockCardWarehouse: [],
    eFatura: [],
    manufacturers: [],
    marketNames: [],
};

export const useStockForm = () => {
    const [formState, setFormState] = useState<StockFormState>(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateStockCard = <K extends keyof StockFormState['stockCard']>(field: K, value: StockFormState['stockCard'][K]) => {
        setFormState(prev => ({
            ...prev,
            stockCard: {
                ...prev.stockCard,
                [field]: value
            }
        }));
    };

    const updateBarcodes = (barcodes: string[]) => {
        setFormState(prev => ({
            ...prev,
            barcodes: barcodes.map(barcode => ({ barcode }))
        }));
    };

    const updateMarketNames = (names: string[]) => {
        setFormState(prev => ({
            ...prev,
            marketNames: names.map(name => ({ marketName: name }))
        }));
    };

    const updateCategories = (categoryIds: string[]) => {
        setFormState(prev => ({
            ...prev,
            categoryItem: categoryIds.map(id => ({ categoryId: id }))
        }));
    };

    const updateAttributes = (attributes: Array<{ attributeId: string; value: string }>) => {
        setFormState(prev => ({
            ...prev,
            attributes
        }));
    };

    const updatePriceListItems = (items: Array<{
        priceListId: string;
        price: number;
        vatRate: number | null;
        priceWithVat: number | null;
        barcode: string;
    }>) => {
        setFormState(prev => ({
            ...prev,
            priceListItems: items
        }));
    };

    const updateWarehouse = (warehouseId: string, quantity: number) => {
        setFormState(prev => ({
            ...prev,
            stockCardWarehouse: [{ id: warehouseId, quantity }]
        }));
    };

    const updateManufacturers = (manufacturers: Array<{
        productCode: string;
        productName: string;
        barcode: string;
        brandId: string;
        currentId: string;
    }>) => {
        setFormState(prev => ({
            ...prev,
            manufacturers
        }));
    };

    const updateEFatura = (productCode: string, productName: string, priceListId: string) => {
        setFormState(prev => ({
            ...prev,
            eFatura: [{
                productCode,
                productName,
                stockCardPriceListId: priceListId
            }]
        }));
    };

    const updateStockUnits = (units: Array<{ unitId: string; price: number; vatRate: number | null; priceWithVat: number | null }>) => {
        setFormState(prev => ({
            ...prev,
            stockUnits: units
        }));
    };

    const saveStockCard = async () => {
        try {
            setLoading(true);
            setError(null);

            // Transform price list items before sending
            const transformedPriceListItems = formState.priceListItems.map(item => ({
                priceListId: item.priceListId,
                price: item.vatRate !== null ? item.priceWithVat : item.price,
                vatRate: item.vatRate,
                barcode: item.barcode
            }));

            const dataToSend = {
                ...formState,
                priceListItems: transformedPriceListItems
            };

            const response = await fetch('http://localhost:1303/stockcards/createStockCardsWithRelations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend)
            });

            if (!response.ok) {
                throw new Error('Failed to save stock card');
            }

            return await response.json();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while saving');
            return Promise.reject(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        formState,
        loading,
        error,
        updateStockCard,
        updateBarcodes,
        updateMarketNames,
        updateCategories,
        updateAttributes,
        updatePriceListItems,
        updateWarehouse,
        updateManufacturers,
        updateEFatura,
        updateStockUnits,
        saveStockCard,
    };
};