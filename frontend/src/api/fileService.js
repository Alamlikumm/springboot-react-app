import api from './axios';

const fileService = {
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await api.post('/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};

export default fileService;
