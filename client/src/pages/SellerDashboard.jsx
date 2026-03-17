import React, { useState } from 'react';
import axios from 'axios';
import { Plus, Trash, Leaf, Package, Activity, AlertCircle, CheckCircle, Store, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../lib/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const SellerDashboard = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [imageFiles, setImageFiles] = useState([]); 
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '', price: '', category: '', co2Emission: '', isEcoFriendly: false, 
        description: '', brand: '', stockQuantity: '', material: '', certifications: ''
    });

    const CATEGORIES = ["Home & Kitchen", "Fashion", "Health & Beauty", "Tech & Gadgets", "Groceries"];

    // Fetch ONLY this seller's products
    const { data: myProducts = [], isLoading } = useQuery({
        queryKey: ['sellerProducts'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/products/seller');
            return data;
        }
    });

    const createProductMutation = useMutation({
        mutationFn: async (payload) => {
            const { data } = await axiosInstance.post('/products/add', payload);
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries(['sellerProducts'])
    });

    const deleteProductMutation = useMutation({
        mutationFn: async (id) => {
            const { data } = await axiosInstance.delete(`/products/${id}`);
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries(['sellerProducts'])
    });

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleFileChange = (e) => setImageFiles(Array.from(e.target.files));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            const uploadedUrls = [];
            if (imageFiles.length > 0) {
                for (const file of imageFiles) {
                    const cloudData = new FormData();
                    cloudData.append("file", file);
                    cloudData.append("upload_preset", `${import.meta.env.VITE_CLOUDINARY_PRESET_NAME}`); 
                    const cloudRes = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, cloudData);
                    uploadedUrls.push(cloudRes.data.secure_url);
                }
            }
            createProductMutation.mutate({ ...formData, imageUrls: uploadedUrls });
            setFormData({ name: '', price: '', category: '', co2Emission: '', isEcoFriendly: false, description: '', brand: '', stockQuantity: '', material: '', certifications: '' });
            setImageFiles([]);
            setUploading(false);
            alert("Product submitted! If marked eco-friendly, it will await admin verification.");
        } catch (err) {
            console.error(err);
            alert('Error publishing product.');
            setUploading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 relative overflow-hidden font-sans pb-12">
            <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-8 py-4 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg shadow-lg">
                        <Store className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Seller Hub</h1>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 font-bold transition-all">
                    <LogOut size={18} /> Logout
                </button>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                {/* LEFT COLUMN: Add Product Form */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4 h-fit">
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-400" />
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Plus className="text-blue-400" /> Add New Product</h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Inputs for Name, Description, Price, Stock, Brand */}
                            <input name="name" placeholder="Product Title" value={formData.name} onChange={handleChange} required className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500" />
                            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 resize-none"></textarea>
                            <div className="grid grid-cols-2 gap-4">
                                <input name="price" type="number" step="0.01" placeholder="Price ($)" value={formData.price} onChange={handleChange} required className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500" />
                                <input name="stockQuantity" type="number" placeholder="Stock" value={formData.stockQuantity} onChange={handleChange} required className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500" />
                            </div>
                            <input name="brand" placeholder="Brand Name" value={formData.brand} onChange={handleChange} required className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500" />
                            
                            <div className="bg-slate-950/30 border border-slate-800/50 p-4 rounded-xl mt-2">
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-3 ml-1">Category</label>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORIES.map(cat => (
                                        <button key={cat} type="button" onClick={() => setFormData({ ...formData, category: cat })} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${formData.category === cat ? 'bg-blue-500 text-white' : 'bg-slate-900 border border-slate-700 text-slate-400'}`}>{cat}</button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <input name="material" placeholder="Material" value={formData.material} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500" />
                                <input name="certifications" placeholder="Certifications" value={formData.certifications} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500" />
                            </div>

                            <div className="relative bg-slate-950/50 border border-slate-800 border-dashed rounded-xl px-4 py-4">
                                <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
                                    <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                                    <span className="text-sm text-slate-400 mb-2">{imageFiles.length > 0 ? `${imageFiles.length} files selected` : "Upload images"}</span>
                                    <div className="bg-slate-800 px-4 py-1.5 rounded-md text-xs font-semibold text-white">Browse</div>
                                </label>
                            </div>

                            <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-xl p-4">
                                <label className="text-xs font-bold text-emerald-400 uppercase mb-2 flex items-center gap-1"><Leaf size={14} /> Environmental Impact</label>
                                <input name="co2Emission" type="number" step="0.1" placeholder="CO2 Emission (kg)" value={formData.co2Emission} onChange={handleChange} required className="w-full bg-slate-950/50 border border-emerald-900/50 rounded-lg px-4 py-2.5 mb-4 focus:border-emerald-500" />
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="relative w-10 h-6">
                                        <input type="checkbox" name="isEcoFriendly" checked={formData.isEcoFriendly} onChange={handleChange} className="sr-only peer" />
                                        <div className="w-full h-full bg-slate-800 rounded-full peer-checked:bg-emerald-500 transition-colors"></div>
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                                    </div>
                                    <span className="text-sm text-slate-300">Submit for Eco-Verification</span>
                                </label>
                            </div>

                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all">
                                {uploading ? "Publishing..." : "Submit Product"}
                            </button>
                        </form>
                    </div>
                </motion.div>

                {/* RIGHT COLUMN: Seller's Inventory Grid */}
                <div className="lg:col-span-8">
                    <h2 className="text-2xl font-bold mb-6">My Inventory</h2>
                    {isLoading ? <div className="text-blue-400 animate-pulse">Loading inventory...</div> : myProducts.length === 0 ? (
                        <div className="text-center text-slate-500 py-20 border border-dashed border-slate-800 rounded-2xl">
                            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>You haven't listed any products yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {myProducts.map((product) => (
                                    <motion.div key={product.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden shadow-lg relative flex flex-col">
                                        <div className="h-48 overflow-hidden relative bg-slate-800">
                                            <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                                            <button onClick={() => { if(window.confirm("Delete product?")) deleteProductMutation.mutate(product.id) }} className="absolute top-3 right-3 p-2 bg-red-500/80 text-white rounded-full hover:bg-red-500"><Trash size={14} /></button>
                                            
                                            {/* Status Indicators */}
                                            {product.isEcoFriendly && product.verificationStatus === 'APPROVED' && (
                                                <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1"><CheckCircle size={12} /> Verified</div>
                                            )}
                                            {product.isEcoFriendly && (!product.verificationStatus || product.verificationStatus === 'PENDING') && (
                                                <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1"><AlertCircle size={12} /> Pending Review</div>
                                            )}
                                            {product.isEcoFriendly && product.verificationStatus === 'REJECTED' && (
                                                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">Rejected</div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between">
                                                <h3 className="font-bold text-white truncate">{product.name}</h3>
                                                <span className="text-blue-400 font-mono">${product.price}</span>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-1">{product.co2Emission} kg CO₂</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SellerDashboard;