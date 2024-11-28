import ProductForm from '../components/ProductForm/index.tsx';
export default function ProductManagement() {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Gerenciar Produtos</h1>
        <ProductForm />
      </div>
    );
  }