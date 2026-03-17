import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Leaf, Calendar, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { orderApi } from '../lib/api';

const MyOrders = () => {
    const navigate = useNavigate();

    const { data: orders = [], isLoading } = useQuery({
        queryKey: ['myOrders'],
        queryFn: orderApi.myOrders
    });

    if (isLoading) {
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-green-400 font-bold text-xl animate-pulse">Loading Orders...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white py-20 px-6 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[150px] pointer-events-none" />
            
            <div className="max-w-5xl mx-auto relative z-10">
                <button onClick={() => navigate('/shop')} className="flex items-center gap-2 text-slate-400 hover:text-green-400 mb-8 transition-colors font-semibold tracking-wide uppercase text-sm">
                    <ArrowLeft size={18} /> Back to Shop
                </button>

                <div className="flex items-center gap-3 mb-10">
                    <div className="p-3 bg-green-500/20 rounded-xl">
                        <Package className="text-green-400 w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-bold">My Order History</h1>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center">
                        <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-300 mb-2">No orders yet</h2>
                        <p className="text-slate-500 mb-6">Start shopping to track your environmental impact.</p>
                        <button onClick={() => navigate('/shop')} className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-500 transition-colors">
                            Browse Eco-Products
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <AnimatePresence>
                            {orders.map((order, index) => (
                                <motion.div 
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                                    className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden shadow-xl"
                                >
                                    {/* Order Header */}
                                    <div className="bg-slate-800/50 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800">
                                        <div>
                                            <p className="text-slate-400 text-sm flex items-center gap-2 mb-1">
                                                <Calendar size={14} /> 
                                                {new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                            <p className="text-xs text-slate-500 font-mono">Order ID: #{order.id}</p>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-slate-400 text-sm">Total Amount</p>
                                                <p className="text-xl font-bold text-white font-mono">${order.totalAmount.toFixed(2)}</p>
                                            </div>
                                            <div className="bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-xl text-center">
                                                <p className="text-green-500 text-xs font-bold uppercase tracking-wider mb-1 flex justify-center items-center gap-1"><Leaf size={12}/> CO₂ Saved</p>
                                                <p className="text-green-400 font-bold">{order.totalCo2Saved.toFixed(1)} kg</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                                                    <div>
                                                        <h4 className="font-bold text-slate-200">{item.productName}</h4>
                                                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                            CO₂ Footprint: <span className="text-slate-400 font-mono">{item.co2Emission} kg</span>
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-mono font-bold text-slate-300">${item.price.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="mt-6 flex items-center gap-2 text-emerald-500 font-semibold text-sm bg-emerald-500/10 w-max px-4 py-2 rounded-full">
                                            <CheckCircle size={16} />
                                            {order.status}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;