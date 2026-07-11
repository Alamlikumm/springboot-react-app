import api from './axios';

const productService = {
    // Get semua products (paginated)
    getAll: async (page = 0, size = 10, sort = 'id,desc') => {
        const response = await api.get(`/products?page=${page}&size=${size}&sort=${sort}`);
        return response.data;
    },

    // Get product by ID
    getById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    // Create product baru
    create: async (productData) => {
        const response = await api.post('/products', productData);
        return response.data;
    },

    // Update product
    update: async (id, productData) => {
        const response = await api.put(`/products/${id}`, productData);
        return response.data;
    },

    // Delete product
    delete: async (id) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    },

    // Search products (paginated)
    search: async (keyword, page = 0, size = 10, sort = 'id,desc') => {
        const response = await api.get(`/products/search?keyword=${keyword}&page=${page}&size=${size}&sort=${sort}`);
        return response.data;
    },
};

export default productService;
