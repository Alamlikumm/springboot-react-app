import api from './axios';

export const reportService = {
    getSales: async () => {
        const response = await api.get('/reports/sales');
        return response.data;
    }
};
