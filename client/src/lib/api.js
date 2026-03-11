import axiosInstance from "./axios";
import { jwtDecode } from "jwt-decode";

export const user = {
    getCurrentUser: () => {
        const token = localStorage.getItem("token");
        if (!token) return null;

        try {
            const decoded = jwtDecode(token);
            // JWT now contains: sub (email), id, role, iat, exp
            return {
                email: decoded.sub,
                id: decoded.id,
                role: decoded.role,
            };
        } catch (err) {
            console.error("Could not decode token", err);
            return null;
        }
    }
}

export const productApi = {
    getAll: async () => {
        const { data } = await axiosInstance.get('/products');
        return data;
    },

    add: async (product) => {
        const { data } = await axiosInstance.post('/products/add', product);
        return data;
    },

    update: async ({ id, product }) => {
        const { data } = await axiosInstance.put(`/products/${id}`, product);
        return data;
    },

    getById: async (id) => {
        const { data } = await axiosInstance.get(`/products/${id}`);
        return data;
    },

    delete: async (id) => {
        const { data } = await axiosInstance.delete(`/products/${id}`);
        return data;
    },
}

export const orderApi = {
    create: async (order) => {
        const { data } = await axiosInstance.post('/orders/create', order);
        return data;
    },

    myOrders: async () => {
        const { data } = await axiosInstance.get('/orders/my-orders');
        return data;
    },
}

export const analyticsApi = {
    getProductSales: async () => {
        const { data } = await axiosInstance.get('/analytics/product-sales');
        return data;
    },
}

export const carbonApi = {
    getForUser: async (userId) => {
        const { data } = await axiosInstance.get(`/carbon/user/${userId}`);
        return data;
    },
}

export const achievementApi = {
    getForUser: async (userId) => {
        const { data } = await axiosInstance.get(`/achievements/user/${userId}`);
        return data;
    },
}