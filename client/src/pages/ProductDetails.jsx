import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Leaf, ShoppingCart, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '../lib/axios';

const ProductDetails = () => {
    const { id } = useParams(); // Gets the ID from the URL
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axiosInstance.get(`/products/${id}`);
                setProduct(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load product");
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-green-400">Loading...</div>;
    }

    if (!product) {
        return <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
            <h2 className="text-2xl mb-4">Product Not Found</h2>
            <Link to="/shop" className="text-green-400 underline">Return to Shop</Link>
        </div>;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans py-20 px-6">
            <div className="max-w-6xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={20} /> Back to Shop
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-12 shadow-2xl">
                    
                    {/* Left: Image */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative rounded-2xl overflow-hidden h-[400px] md:h-[500px]">
                        <img src={product.imageUrl || "https://via.placeholder.com/600"} alt={product.name} className="w-full h-full object-cover" />
                        {product.isEcoFriendly && (
                            <div className="absolute top-4 left-4 bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-2 font-bold shadow-lg">
                                <Leaf size={16} /> Verified Sustainable
                            </div>
                        )}
                    </motion.div>

                    {/* Right: Details */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
                        <div className="mb-2 text-green-400 font-medium uppercase tracking-wider text-sm">{product.category}</div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{product.name}</h1>
                        <div className="text-3xl font-mono text-white mb-8">${product.price}</div>
                        
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            {product.description || "No detailed description available for this product yet. Rest assured, all items on EcoBazaarX are vetted for quality."}
                        </p>

                        {/* Environmental Impact Card */}
                        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 mb-8">
                            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                                <Activity className="text-blue-400" /> Environmental Impact
                            </h3>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-400">Carbon Footprint</span>
                                <span className={`font-mono font-bold ${product.isEcoFriendly ? 'text-green-400' : 'text-red-400'}`}>
                                    {product.co2Emission} kg CO₂
                                </span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div 
                                    className={`h-2 rounded-full ${product.isEcoFriendly ? 'bg-green-500' : 'bg-red-500'}`} 
                                    style={{ width: `${Math.min((product.co2Emission / 20) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-900/50 flex justify-center items-center gap-2 transition-transform hover:scale-[1.02]">
                            <ShoppingCart size={20} /> Add to Impact Cart
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;