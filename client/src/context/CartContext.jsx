import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../lib/axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const formatCartItems = (items) => {
        return items.map(item => ({
            id: item.productId, 
            name: item.productName,
            price: item.price,
            co2Emission: item.co2Emission,
            imageUrl: item.imageUrl,
            imageUrls: [item.imageUrl], 
            isEcoFriendly: item.isEcoFriendly,
            category: item.category
        }));
    };

    useEffect(() => {
        const fetchCart = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axiosInstance.get('/cart');
                    if (res.data && res.data.items) {
                        setCart(formatCartItems(res.data.items));
                    }
                } catch (err) {
                    if (err.response && err.response.status === 403) {
                        console.warn("Token expired or invalid. Clearing local storage.");
                        localStorage.removeItem('token');
                        setCart([]);
                    } else {
                        console.error("Error fetching cart from backend", err);
                    }
                }
            }
        };
        fetchCart();
    }, []);


    const addToCart = async (product) => {
        try {
            const cartItemPayload = {
                productId: product.id,
                productName: product.name,
                price: product.price,
                co2Emission: product.co2Emission,
                imageUrl: product.imageUrls ? product.imageUrls[0] : product.imageUrl,
                isEcoFriendly: product.isEcoFriendly || false,
                category: product.category
            };
            
            const res = await axiosInstance.post('/cart/add', cartItemPayload);
            setCart(formatCartItems(res.data.items));
        } catch (err) {
            console.error("Failed to add to cart", err);
            alert("Please log in to add items to your cart.");
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const res = await axiosInstance.delete(`/cart/remove/${productId}`);
            setCart(formatCartItems(res.data.items));
        } catch (err) {
            console.error("Failed to remove from cart", err);
        }
    };

    const swapCartItem = async (oldProductId, newProduct) => {
        try {
            const newItemPayload = {
                productId: newProduct.id,
                productName: newProduct.name,
                price: newProduct.price,
                co2Emission: newProduct.co2Emission,
                imageUrl: newProduct.imageUrls ? newProduct.imageUrls[0] : newProduct.imageUrl,
                isEcoFriendly: newProduct.isEcoFriendly || false,
                category: newProduct.category
            };
            const res = await axiosInstance.post(`/cart/swap/${oldProductId}`, newItemPayload);
            setCart(formatCartItems(res.data.items));
        } catch (err) {
            console.error("Failed to swap item", err);
        }
    };

    const clearCart = async () => {
        try {
            await axiosInstance.delete('/cart/clear');
            setCart([]);
        } catch (err) {
            console.error("Failed to clear cart", err);
        }
    };

    const calculateTotalImpact = () => {
        return cart.reduce((acc, item) => acc + (item.co2Emission || 0), 0).toFixed(1);
    };

    const calculateTotalPrice = () => {
        return cart.reduce((acc, item) => acc + (item.price || 0), 0).toFixed(2);
    };

    return (
        <CartContext.Provider value={{ 
            cart, addToCart, removeFromCart, swapCartItem, clearCart, calculateTotalImpact, calculateTotalPrice 
        }}>
            {children}
        </CartContext.Provider>
    );
};