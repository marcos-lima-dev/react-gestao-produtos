import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ProductManagement from './pages/ProductManagement';
import ProductViewer from './pages/ProductViewer';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex space-x-8">
                <Link
                  to="/"
                  className="inline-flex items-center px-1 pt-1 text-gray-900"
                >
                  Produtos
                </Link>
                <Link
                  to="/gerenciar"
                  className="inline-flex items-center px-1 pt-1 text-gray-900"
                >
                  Gerenciar
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<ProductViewer />} />
            <Route path="/gerenciar" element={<ProductManagement />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}