import api from './axios';

const transactionService = {
    getAll: async () => {
        const response = await api.get('/transactions');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/transactions/${id}`);
        return response.data;
    },

    create: async (transactionData) => {
        const response = await api.post('/transactions', transactionData);
        return response.data;
    }
};

export default transactionService;
