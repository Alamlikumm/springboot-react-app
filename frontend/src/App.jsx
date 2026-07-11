import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import './App.css';
import Navbar from './components/Navbar';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="app">
                    <Navbar />
                    <main className="container">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Protected Routes */}
                            <Route path="/" element={<Navigate to="/products" />} />
                            <Route path="/products" element={
                                <ProtectedRoute>
                                    <ProductList />
                                </ProtectedRoute>
                            } />
                            <Route path="/products/create" element={
                                <ProtectedRoute>
                                    <ProductForm />
                                </ProtectedRoute>
                            } />
                            <Route path="/products/edit/:id" element={
                                <ProtectedRoute>
                                    <ProductForm />
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </main>
                    <footer className="footer">
                        <p>© 2026 Product Manager — Spring Boot + React.js + MySQL</p>
                    </footer>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: '#1e293b',
                                color: '#f1f5f9',
                                borderRadius: '12px',
                                border: '1px solid rgba(99, 102, 241, 0.3)',
                            },
                            success: {
                                iconTheme: { primary: '#10b981', secondary: '#f1f5f9' },
                            },
                            error: {
                                iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' },
                            },
                        }}
                    />
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
