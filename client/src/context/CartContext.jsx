import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('ecoCart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('ecoCart', JSON.stringify(cart));
    }, [cart]);

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

    const swapCartItem = (indexToSwap, newItem) => {
        setCart(prevCart => {
            const updatedCart = [...prevCart];
            updatedCart[indexToSwap] = newItem; 
            return updatedCart;
        });
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, calculateTotalImpact, calculateTotalPrice, swapCartItem }}>
            {children}
        </CartContext.Provider>
    );
};