import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Leaf, ShoppingCart, Activity, ShieldCheck, Box, Tag, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '../lib/axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../lib/api';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [addedToCart, setAddedToCart] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const queryClient = useQueryClient();

    const { data: product, isLoading: loading } = useQuery({
        queryKey: ['product', id],
        queryFn: () => productApi.getById(id),
    });

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-green-400 font-bold text-xl tracking-widest animate-pulse">LOADING DETAILS...</div>;
    if (!product) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Product Not Found</div>;

    const inStock = product.stockQuantity > 0;

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans py-24 px-6 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[150px] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-green-400 mb-10 transition-colors font-semibold tracking-wide uppercase text-sm">
                    <ArrowLeft size={18} /> Back to Shop
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    
                    {/* LEFT COLUMN: Image Presentation */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
                        
                        {/* Main Large Image */}
                        <div className="relative h-[400px] lg:h-[550px] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group">
                            <img 
                                src={product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[currentImageIndex] : "https://via.placeholder.com/800"} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-opacity duration-500" 
                            />
                            
                            {/* Badges Overlay */}
                            <div className="absolute top-6 left-6 flex flex-col gap-3">
                                {product.isEcoFriendly && (
                                    <div className="bg-green-500/90 backdrop-blur-md text-white px-5 py-2.5 rounded-full flex items-center gap-2 font-bold shadow-lg shadow-green-900/50">
                                        <Leaf size={18} /> Verified Sustainable Choice
                                    </div>
                                )}
                                {!inStock && (
                                    <div className="bg-red-500/90 backdrop-blur-md text-white px-5 py-2.5 rounded-full font-bold shadow-lg w-max">
                                        Out of Stock
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail Row */}
                        {product.imageUrls && product.imageUrls.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                                {product.imageUrls.map((url, index) => (
                                    <button 
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${currentImageIndex === index ? 'border-green-500 scale-105 shadow-lg shadow-green-500/20' : 'border-slate-800 opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={url} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* RIGHT COLUMN: Rich Details */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
                        
                        {/* Brand & Category */}
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-green-400 font-bold uppercase tracking-widest text-xs flex items-center gap-1"><Tag size={14}/> {product.brand || "EcoBazaar"}</span>
                            <span className="text-slate-500 text-sm">•</span>
                            <span className="text-slate-400 uppercase tracking-widest text-xs">{product.category}</span>
                        </div>

                        <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">{product.name}</h1>
                        
                        <div className="flex items-end gap-4 mb-8">
                            <span className="text-5xl font-mono text-white font-medium">${product.price}</span>
                            {inStock && <span className="text-sm text-green-400 font-bold mb-2 bg-green-500/10 px-3 py-1 rounded-md">{product.stockQuantity} in stock</span>}
                        </div>
                        
                        <p className="text-slate-300 text-lg mb-10 leading-relaxed border-l-2 border-green-500/50 pl-6">
                            {product.description || "No detailed description available."}
                        </p>

                        {/* Feature Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
                                <Layers className="text-emerald-400 mt-1" size={20} />
                                <div>
                                    <h4 className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Materials</h4>
                                    <p className="text-sm font-medium text-slate-200">{product.material || "Standard Materials"}</p>
                                </div>
                            </div>
                            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
                                <ShieldCheck className="text-blue-400 mt-1" size={20} />
                                <div>
                                    <h4 className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Certifications</h4>
                                    <p className="text-sm font-medium text-slate-200">{product.certifications || "Pending Review"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Environmental Impact Card */}
                        <div className="bg-linear-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 mb-10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl group-hover:bg-green-500/10 transition-colors" />
                            
                            <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                                <Activity className="text-green-400" /> Lifecycle Footprint
                            </h3>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-slate-400 font-medium">Estimated CO₂ Emissions</span>
                                <span className={`font-mono font-bold text-2xl ${product.isEcoFriendly ? 'text-green-400' : 'text-red-400'}`}>
                                    {product.co2Emission} kg
                                </span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }} animate={{ width: `${Math.min((product.co2Emission / 20) * 100, 100)}%` }} transition={{ duration: 1.5, ease: "easeOut" }}
                                    className={`h-full rounded-full ${product.isEcoFriendly ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-orange-500'}`} 
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                                {product.isEcoFriendly 
                                    ? "This product has a significantly lower carbon footprint compared to standard industry alternatives. Thank you for shopping green." 
                                    : "This product carries a standard carbon footprint. Consider looking for items with the 'Sustainable Choice' badge."}
                            </p>
                        </div>

                        {/* Checkout Actions */}
                        <div className="flex gap-4">
                            <button 
                                disabled={!inStock}
                                onClick={() => {
                                    addToCart(product);
                                    setAddedToCart(true);
                                    setTimeout(() => setAddedToCart(false), 2000); 
                                }}
                                className={`flex-grow font-bold py-5 rounded-2xl shadow-lg flex justify-center items-center gap-3 transition-all transform ${inStock ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-green-900/50 hover:scale-[1.02]' : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}`}
                            >
                                <ShoppingCart size={22} /> 
                                {!inStock ? "Currently Unavailable" : addedToCart ? "Added to Cart!" : "Add to Impact Cart"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;