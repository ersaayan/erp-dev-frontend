import React from "react";
import DataGrid, {
  Column,
  Selection,
  Paging,
  Scrolling,
  LoadPanel,
  SearchPanel,
} from "devextreme-react/data-grid";
import { StockItem } from "../../types";

interface ProductSelectionGridProps {
  products: any[];
  loading: boolean;
  selectedProducts: string[];
  onProductSelect: (productId: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  existingProducts: StockItem[];
}

const ProductSelectionGrid: React.FC<ProductSelectionGridProps> = ({
  products,
  loading,
  onProductSelect,
  page,
  totalPages,
  onPageChange,
  existingProducts,
}) => {
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);

  const handleSelectionChange = (e: any) => {
    const selectedRowKeys = e.selectedRowKeys as string[];
    setSelectedProducts((prev) =>
      Array.from(new Set([...prev, ...selectedRowKeys]))
    );
  };
  return (
    <DataGrid
      dataSource={products}
      showBorders={true}
      height="60vh"
      selectedRowKeys={selectedProducts}
      onSelectionChanged={handleSelectionChange}
    >
      <Selection mode="multiple" showCheckBoxesMode="always" />
      <SearchPanel visible={true} width={240} placeholder="Ara..." />
      <Scrolling mode="virtual" />
      <LoadPanel enabled={loading} />
      <Paging
        enabled={true}
        pageSize={20}
        pageIndex={page - 1}
        onPageIndexChange={(newPage) => onPageChange(newPage + 1)}
      />

      <Column dataField="productCode" caption="Stok Kodu" />
      <Column dataField="productName" caption="Stok Adı" />
      <Column dataField="unit" caption="Birim" />
      <Column
        dataField="stockCardWarehouse[0].quantity"
        caption="Stok Miktarı"
        dataType="number"
      />
      <Column
        caption="Mevcut Miktar"
        calculateCellValue={(rowData: any) => {
          const existingProduct = existingProducts.find(
            (p) => p.stockId === rowData.id
          );
          return existingProduct?.quantity || 0;
        }}
      />
    </DataGrid>
  );
};

export default ProductSelectionGrid;