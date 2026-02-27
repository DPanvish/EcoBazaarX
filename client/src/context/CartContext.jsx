import { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart([...cart, product]);
    };

    const removeFromCart = (indexToRemove) => {
        setCart(cart.filter((_, index) => index !== indexToRemove));
    };

    const clearCart = () => setCart([]);

    const calculateTotalImpact = () => {
        return cart.reduce((acc, item) => acc + (item.co2Emission || 0), 0).toFixed(1);
    };

    const calculateTotalPrice = () => {
        return cart.reduce((acc, item) => acc + (item.price || 0), 0).toFixed(2);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, calculateTotalImpact, calculateTotalPrice }}>
            {children}
        </CartContext.Provider>
    );
};