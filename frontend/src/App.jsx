import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import CategoryList from './pages/CategoryList';
import CategoryForm from './pages/CategoryForm';
import UserList from './pages/UserList';
import Profile from './pages/Profile';
import POS from './pages/POS';
import TransactionList from './pages/TransactionList';
import Reports from './pages/Reports';
import './App.css';

function AppContent() {
    const { isAuthenticated, user } = useAuth();

    return (
        <div className="app">
            {isAuthenticated && <Sidebar />}
            <div className={isAuthenticated ? 'main-content' : ''} style={!isAuthenticated ? { width: '100%' } : {}}>
                <div className={isAuthenticated ? 'container' : ''}>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected Routes */}
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
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
                        
                        <Route path="/categories" element={
                            <ProtectedRoute>
                                <CategoryList />
                            </ProtectedRoute>
                        } />
                        <Route path="/categories/create" element={
                            <ProtectedRoute>
                                <CategoryForm />
                            </ProtectedRoute>
                        } />
                        <Route path="/categories/edit/:id" element={
                            <ProtectedRoute>
                                <CategoryForm />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/pos" element={
                            <ProtectedRoute>
                                <POS />
                            </ProtectedRoute>
                        } />
                        <Route path="/transactions" element={
                            <ProtectedRoute>
                                <TransactionList />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/reports" element={
                            <ProtectedRoute>
                                <Reports />
                            </ProtectedRoute>
                        } />

                        {/* Admin Only Routes (Role checks can be added later) */}
                        <Route path="/users" element={
                            <ProtectedRoute>
                                {user?.role === 'ADMIN' ? <UserList /> : <Navigate to="/dashboard" />}
                            </ProtectedRoute>
                        } />
                    </Routes>
                </div>
                {isAuthenticated && (
                    <footer className="footer">
                        <p>© 2026 Product Manager — Spring Boot + React.js + MySQL</p>
                    </footer>
                )}
            </div>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#18181b',
                        color: '#fafafa',
                        borderRadius: '8px',
                        border: '1px solid #27272a',
                        fontSize: '0.85rem',
                    },
                    success: {
                        iconTheme: { primary: '#22c55e', secondary: '#fafafa' },
                    },
                    error: {
                        iconTheme: { primary: '#ef4444', secondary: '#fafafa' },
                    },
                }}
            />
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
