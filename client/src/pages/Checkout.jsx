import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf, ShieldCheck, ArrowRightIcon as ArrowRightRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../lib/axios';

const Checkout = () => {
    const { cart, removeFromCart, calculateTotalImpact, calculateTotalPrice, clearCart, addToCart } = useCart();
    const navigate = useNavigate();
    
    const [allProducts, setAllProducts] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [isConfirmed, setIsConfirmed] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axiosInstance.get('/products');
                setAllProducts(res.data);
                generateSuggestions(cart, res.data);
            } catch (err) {
                console.error("Failed to fetch products for suggestions", err);
            }
        };
        fetchProducts();
    }, [cart]); 

    const generateSuggestions = (currentCart, inventory) => {
        let newSuggestions = [];
        
        currentCart.forEach((cartItem, cartIndex) => {
            if (!cartItem.isEcoFriendly) {
                const betterAlternative = inventory.find(p => 
                    p.category === cartItem.category && 
                    p.isEcoFriendly && 
                    p.id !== cartItem.id
                );

                if (betterAlternative) {
                    if (!newSuggestions.some(s => s.cartIndex === cartIndex)) {
                        newSuggestions.push({ cartIndex, original: cartItem, alternative: betterAlternative });
                    }
                }
            }
        });
        setSuggestions(newSuggestions);
    };

    const handleSwap = (cartIndex, originalItem, alternativeItem) => {
        removeFromCart(cartIndex);
        addToCart(alternativeItem);
    };

    const handleCheckout = () => {
        // Here we need to send the order to your Spring Boot backend
        setIsConfirmed(true);
        clearCart();
    };

    if (isConfirmed) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white px-6">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 p-12 rounded-3xl border border-green-500/30 text-center max-w-lg shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                    <CheckCircle className="w-24 h-24 text-green-400 mx-auto mb-6" />
                    <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        Thank you for shopping mindfully. Your digital receipt has been sent. 
                    </p>
                    <button onClick={() => navigate('/shop')} className="bg-green-500 text-white font-bold py-3 px-8 rounded-full hover:bg-green-400 transition-colors">
                        Continue Shopping
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white py-20 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* LEFT COLUMN: Checkout Form & Suggestions */}
                <div className="lg:col-span-7">
                    <button onClick={() => navigate('/shop')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                        <ArrowLeft size={18} /> Back to Shop
                    </button>
                    
                    <h1 className="text-3xl font-bold mb-8">Secure Checkout</h1>

                    {/* SUGGESTIONS ENGINE UI */}
                    <AnimatePresence>
                        {suggestions.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="mb-10">
                                <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2">
                                    <Leaf size={18} /> Wait! Greener Alternatives Available
                                </h3>
                                <div className="space-y-4">
                                    {suggestions.map((suggestion, idx) => (
                                        <div key={idx} className="bg-slate-900/80 border border-green-500/30 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-6 shadow-lg">
                                            
                                            {/* Bad Product */}
                                            <div className="flex items-center gap-3 opacity-60 grayscale w-full md:w-1/3">
                                                <img src={suggestion.original.imageUrls?.[0] || suggestion.original.imageUrl} className="w-12 h-12 rounded-lg object-cover" />
                                                <div className="text-sm">
                                                    <p className="line-through">{suggestion.original.name}</p>
                                                    <p className="text-red-400">{suggestion.original.co2Emission} kg CO₂</p>
                                                </div>
                                            </div>

                                            <ArrowRightRight className="text-slate-500 hidden md:block" />

                                            {/* Good Product */}
                                            <div className="flex items-center gap-3 w-full md:w-1/3">
                                                <img src={suggestion.alternative.imageUrls?.[0] || suggestion.alternative.imageUrl} className="w-16 h-16 rounded-lg object-cover border border-green-500" />
                                                <div className="text-sm">
                                                    <p className="font-bold text-green-300">{suggestion.alternative.name}</p>
                                                    <p className="text-green-400">{suggestion.alternative.co2Emission} kg CO₂</p>
                                                </div>
                                            </div>

                                            {/* Action */}
                                            <button 
                                                onClick={() => handleSwap(suggestion.cartIndex, suggestion.original, suggestion.alternative)}
                                                className="w-full md:w-auto px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-xl text-sm font-bold transition-colors ml-auto shadow-md"
                                            >
                                                Swap & Save Planet
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Dummy Payment Form */}
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><ShieldCheck className="text-blue-400"/> Payment Information</h2>
                        <div className="space-y-4">
                            <input type="text" placeholder="Name on Card" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-green-500 outline-none" />
                            <input type="text" placeholder="Card Number" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-green-500 outline-none" />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="MM/YY" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-green-500 outline-none" />
                                <input type="text" placeholder="CVC" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-green-500 outline-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Real-Time Summary */}
                <div className="lg:col-span-5">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sticky top-24">
                        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                        
                        <div className="space-y-4 mb-8 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {cart.length === 0 ? <p className="text-slate-500 text-center py-4">Cart is empty</p> : 
                                cart.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-slate-950/50 p-3 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <img src={item.imageUrls?.[0] || item.imageUrl} className="w-10 h-10 rounded-lg object-cover" />
                                            <div>
                                                <p className="text-sm font-bold text-white">{item.name}</p>
                                                <p className="text-xs text-slate-500">{item.co2Emission} kg CO₂</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end">
                                            <span className="font-mono font-bold">${item.price}</span>
                                            <button onClick={() => removeFromCart(idx)} className="text-[10px] text-red-400 hover:underline mt-1">Remove</button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                        {/* Real-Time Emissions Summary */}
                        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl mb-6">
                            <h3 className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-3">Total Environmental Impact</h3>
                            <div className="flex justify-between items-end mb-2">
                                <span className={`text-3xl font-bold font-mono ${calculateTotalImpact() > 15 ? 'text-red-400' : 'text-green-400'}`}>
                                    {calculateTotalImpact()} <span className="text-lg">kg CO₂</span>
                                </span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div className={`h-full rounded-full ${calculateTotalImpact() > 15 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min((calculateTotalImpact() / 30) * 100, 100)}%` }} />
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-2xl font-bold mb-8 pt-6 border-t border-slate-800">
                            <span>Total</span>
                            <span className="font-mono text-green-400">${calculateTotalPrice()}</span>
                        </div>

                        <button 
                            onClick={handleCheckout} 
                            disabled={cart.length === 0}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${cart.length === 0 ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-lg shadow-green-900/50 hover:scale-[1.02]'}`}
                        >
                            Confirm Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;