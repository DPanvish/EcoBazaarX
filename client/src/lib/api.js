import axiosInstance from "./axios";

export const productApi = {
    getAll: async() => {
        const {data} = await axiosInstance.get('/products');
        return data;
    },

    add: async(product) => {
        const {data} = await axiosInstance.post('/products/add', product);
        return data;
    },

    update: async({id, product}) => {
        const {data} = await axiosInstance.put(`/products/${id}`, product);
        return data;
    },

    getById: async(id) => {
        const {data} = await axiosInstance.get(`/products/${id}`);
        return data;
    },

    delete: async(id) => {
        const {data} = await axiosInstance.delete(`/products/${id}`);
        return data;
    },
}

export const orderApi = {
    create: async(order) => {
        const {data} = await axiosInstance.post('/orders/create', order);
        return data;
    },

    myOrders: async() => {
        const {data} = await axiosInstance.get('/orders/my-orders');
        return data;
    },
}