import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Leaf, X, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '../lib/axios';
import { Link } from 'react-router-dom'

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const res = await axiosInstance.get('/products');
            setProducts(res.data);
        } catch (err) {
            console.error("Error loading products");
        }
    };

    const handleAddToCart = (product) => {
        setCart([...cart, product]);
    };

    const calculateTotalImpact = () => {
        return cart.reduce((acc, item) => acc + (item.co2Emission || 0), 0).toFixed(1);
    };

    const filteredProducts = products.filter(product => {
        const safeName = product.name || "";
        const safeCategory = product.category || "";
        const search = searchTerm.toLowerCase();
        
        return safeName.toLowerCase().includes(search) || 
               safeCategory.toLowerCase().includes(search);
    });

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="bg-green-500 p-2 rounded-lg"><Leaf className="text-white w-5 h-5" /></div>
                    <span className="text-xl font-bold tracking-tight">EcoBazaar<span className="text-green-400">X</span></span>
                </div>
                
                <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ShoppingCart className="w-6 h-6 text-slate-300" />
                    {cart.length > 0 && (
                        <span className="absolute top-0 right-0 bg-green-500 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                            {cart.length}
                        </span>
                    )}
                </button>
            </nav>

            {/* Hero Section */}
            <div className="pt-32 pb-12 px-6 max-w-7xl mx-auto">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-emerald-400 to-cyan-500"
                >
                    Shop Responsibly.
                </motion.h1>
                <p className="text-slate-400 text-center max-w-2xl mx-auto mb-16">
                    Every product has a hidden cost. We help you see it. Watch your carbon footprint as you shop and make mindful choices.
                </p>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto mb-12 relative group">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-md transition-all group-hover:bg-green-500/30"></div>
                    <div className="relative flex items-center bg-slate-900 border border-slate-700 rounded-full px-4 py-3 shadow-lg">
                        <Search className="w-5 h-5 text-slate-400 mr-3" />
                        <input 
                            type="text" 
                            placeholder="Search products or categories..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-transparent border-none outline-none text-white placeholder-slate-500"
                        />
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.length === 0 ? (
                        <div className="col-span-full text-center text-slate-500 py-10">
                            No products found matching "{searchTerm}"
                        </div>
                    ) : (
                        filteredProducts.map((product) => (
                            <motion.div key={product.id} layout className="group relative bg-slate-900 border border-white/5 rounded-2xl overflow-hidden hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-900/20">
                                <div className="h-48 md:h-64 overflow-hidden relative">
                                    <Link to={`/product/${product.id}`} className="h-48 md:h-64 overflow-hidden relative block">
                                        <img src={product.imageUrl || "https://via.placeholder.com/400"} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        {product.isEcoFriendly && (
                                            <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                                <Leaf size={12} /> Eco Choice
                                            </div>
                                        )}
                                    </Link>
                                </div>
                                
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg truncate pr-2">{product.name}</h3>
                                        <span className="text-green-400 font-mono font-bold">${product.price}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className={`w-2 h-2 rounded-full ${product.isEcoFriendly ? 'bg-green-500' : 'bg-red-500'}`} />
                                        <span className="text-xs text-slate-400">{product.co2Emission} kg CO₂</span>
                                    </div>
                                    <button 
                                        onClick={() => handleAddToCart(product)}
                                        className="w-full bg-slate-800 border border-slate-700 hover:border-green-500 text-white py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 group-hover:bg-green-500 group-hover:text-white"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Simple Cart Drawer */}
            {isCartOpen && (
                <div className="fixed inset-0 z-70 flex justify-end">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
                    <motion.div 
                        initial={{ x: "100%" }} animate={{ x: 0 }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-md bg-slate-900 h-full p-6 border-l border-white/10 shadow-2xl flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <ShoppingCart className="text-green-400"/> Your Cart
                            </h2>
                            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X />
                            </button>
                        </div>
                        
                        <div className="space-y-4 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                            {cart.length === 0 ? (
                                <div className="text-center text-slate-500 mt-10">Your cart is empty.</div>
                            ) : (
                                cart.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-center bg-slate-800/50 border border-white/5 p-3 rounded-xl">
                                        <img src={item.imageUrl || "https://via.placeholder.com/100"} className="w-16 h-16 rounded-lg object-cover" />
                                        <div className="flex-grow">
                                            <h4 className="font-bold text-sm text-white">{item.name}</h4>
                                            <p className="text-xs text-slate-400 font-mono">${item.price}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-xs font-mono font-bold px-2 py-1 rounded ${item.isEcoFriendly ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {item.co2Emission}kg
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Cart Footer (Total Impact) */}
                        <div className="mt-auto pt-6 border-t border-white/10">
                            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-400 text-sm">Total Footprint</span>
                                    <span className={`font-mono font-bold text-lg ${calculateTotalImpact() > 10 ? 'text-red-400' : 'text-green-400'}`}>
                                        {calculateTotalImpact()} kg CO₂
                                    </span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                                    <div 
                                        className={`h-1.5 rounded-full ${calculateTotalImpact() > 10 ? 'bg-red-500' : 'bg-green-500'}`} 
                                        style={{ width: `${Math.min((calculateTotalImpact() / 20) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-2 text-center">Lower is better for the environment.</p>
                            </div>

                            <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-900/50 transition-all transform hover:scale-[1.02]">
                                Proceed to Checkout
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Shop;