// src/components/ProductList/index.tsx
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { selectFilteredProducts } from '../../store/selectors';
import { ProductVariation, Product } from '../../types';
import { removeProduct, updateProduct } from '../../store/productsSlice';
import EditModal from './EditModal';
import toast from 'react-hot-toast';

interface Filters {
  name: string;
  color: string;
  minPrice: string;
  maxPrice: string;
  sortBy: 'name' | 'price' | 'stock' | null;
  sortOrder: 'asc' | 'desc';
}

const PAGE_SIZE = 6;

export default function ProductList() {
  const dispatch = useDispatch();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState<Filters>({
    name: '',
    color: '',
    minPrice: '',
    maxPrice: '',
    sortBy: null,
    sortOrder: 'asc'
  });

  const filteredProducts = useSelector((state: RootState) => 
    selectFilteredProducts(state, {
      name: filters.name,
      color: filters.color,
      minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined
    })
  );

  const handleFilterChange = (key: keyof Filters) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, [key]: e.target.value }));
    setCurrentPage(0); // Reset to first page when filtering
  };

  const handleSort = (field: 'name' | 'price' | 'stock') => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Deseja realmente excluir este produto?')) {
      dispatch(removeProduct(id));
      toast.success('Produto excluído com sucesso!');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSaveEdit = (editedProduct: Product) => {
    dispatch(updateProduct(editedProduct));
    setEditingProduct(null);
    toast.success('Produto atualizado com sucesso!');
  };

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!filters.sortBy) return 0;

    if (filters.sortBy === 'name') {
      return filters.sortOrder === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    
    if (filters.sortBy === 'price') {
      const aPrice = Math.min(...a.variations.map((v: ProductVariation) => v.price));
      const bPrice = Math.min(...b.variations.map((v: ProductVariation) => v.price));
      return filters.sortOrder === 'asc' ? aPrice - bPrice : bPrice - aPrice;
    }
    
    if (filters.sortBy === 'stock') {
      const aStock = Math.min(...a.variations.map((v: ProductVariation) => v.stockQuantity));
      const bStock = Math.min(...b.variations.map((v: ProductVariation) => v.stockQuantity));
      return filters.sortOrder === 'asc' ? aStock - bStock : bStock - aStock;
    }
    
    return 0;
  });

  const paginatedProducts = sortedProducts.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  const totalPages = Math.ceil(sortedProducts.length / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do Produto</label>
            <input
              type="text"
              value={filters.name}
              onChange={handleFilterChange('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Buscar por nome..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cor</label>
            <input
              type="text"
              value={filters.color}
              onChange={handleFilterChange('color')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Filtrar por cor..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Preço Mínimo</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={handleFilterChange('minPrice')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="R$ Min"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Preço Máximo</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={handleFilterChange('maxPrice')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="R$ Max"
            />
          </div>
        </div>
        
        <div className="mt-4 flex gap-4">
          <button
            onClick={() => handleSort('name')}
            className={`px-4 py-2 rounded-md ${
              filters.sortBy === 'name' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Nome {filters.sortBy === 'name' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('price')}
            className={`px-4 py-2 rounded-md ${
              filters.sortBy === 'price' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Preço {filters.sortBy === 'price' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('stock')}
            className={`px-4 py-2 rounded-md ${
              filters.sortBy === 'stock' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Estoque {filters.sortBy === 'stock' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProducts.map((product) => (
          <div key={product.id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">{product.name}</h3>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="px-3 py-1 bg-white text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors duration-200"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-3 py-1 bg-white text-red-600 rounded-md hover:bg-red-50 transition-colors duration-200"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl">Cor</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr">Preço</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {product.variations.map((variation: ProductVariation) => (
                    <tr key={variation.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-3 py-3 text-sm text-gray-900 font-medium">{variation.color}</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStockStatus(variation.stockQuantity)}`}>
                          {variation.stockQuantity} un
                        </span>
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-900 font-medium">
                        {new Intl.NumberFormat('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        }).format(variation.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-white border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Anterior
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`px-4 py-2 rounded-md ${
                currentPage === i 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white border hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 bg-white border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Próxima
          </button>
        </div>
      )}

      {editingProduct && (
        <EditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}

const getStockStatus = (quantity: number) => {
  if (quantity < 5) return 'bg-red-100 text-red-800';
  if (quantity < 10) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
};