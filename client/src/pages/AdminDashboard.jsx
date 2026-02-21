import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash, Edit, Leaf, Package, Activity, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../lib/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../lib/api';

const AdminDashboard = () => {
    // const [products, setProducts] = useState([]);
    const [imageFiles, setImageFiles] = useState([]); 
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '', price: '', category: '', co2Emission: '', isEcoFriendly: false, imageUrl: '',
        description: '', brand: '', stockQuantity: '', material: '', certifications: ''
    });

    const queryClient = useQueryClient();

    const {data: products = [], isLoading: loading} = useQuery({
        queryKey: ['products'],
        queryFn: productApi.getAll,
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
        },
        onError: (error) => {
            console.error('Error fetching products:', error);
        }
    });

    const createProductMutation = useMutation({
        mutationFn: productApi.add,
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
        },
        onError: (error) => {
            console.error('Error creating product:', error);
        }
    });

    const updateProductMutation = useMutation({
        mutationFn: productApi.update,
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
        },
        onError: (error) => {
            console.error('Error updating product:', error);
        }
    });

    const deleteProductMutation = useMutation({
        mutationFn: productApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
        },
        onError: (error) => {
            console.error('Error deleting product:', error);
        }
    })

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleFileChange = (e) => {
        setImageFiles(Array.from(e.target.files));
    };

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

                    const cloudRes = await axios.post(
                        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, 
                        cloudData
                    );
                    uploadedUrls.push(cloudRes.data.secure_url);
                }
            }

            const productPayload = {
                ...formData,
                imageUrls: uploadedUrls 
            };

            createProductMutation.mutate(productPayload);
            setFormData({ name: '', price: '', category: '', co2Emission: '', isEcoFriendly: false, description: '', brand: '', stockQuantity: '', material: '', certifications: '' });
            setImageFiles([]);
            document.getElementById('fileInput').value = "";
            setUploading(false);
            
        } catch (err) {
            console.error(err);
            alert('Error publishing product.');
            setUploading(false);
        }
    };


    const handleDelete = async (id) => {
        if(window.confirm("Delete this product?")) {
            deleteProductMutation.mutate(id);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 relative overflow-hidden font-sans pb-12">
            {/* Ambient Glowing Backgrounds */}
            <div className="fixed top-[-10%] left-[-5%] w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Navbar / Header */}
            <header className="sticky top-0 z-50 bg-slate-900/50 backdrop-blur-md border-b border-white/10 px-8 py-4 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-linear-to-br from-emerald-400 to-green-600 rounded-lg shadow-lg shadow-green-500/20">
                        <Activity className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
                        Command Center
                    </h1>
                </div>
                <div className="flex items-center gap-4 bg-slate-800/50 px-4 py-2 rounded-full border border-white/5">
                    <Package className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium">Total Items: {products.length}</span>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                
                {/* LEFT COLUMN: The Form */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
                    className="lg:col-span-4 h-fit"
                >
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                        {/* Decorative top border */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-emerald-500 to-teal-400" />
                        
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Plus className="text-emerald-400" /> Add to Inventory
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-4">
                                <input name="name" placeholder="Product Title" value={formData.name} onChange={handleChange} required
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                                
                                <textarea name="description" placeholder="Detailed Product Description..." value={formData.description} onChange={handleChange} rows="3" required
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"></textarea>

                                <div className="grid grid-cols-2 gap-4">
                                    <input name="price" type="number" step="0.01" placeholder="Price ($)" value={formData.price} onChange={handleChange} required
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                                    <input name="stockQuantity" type="number" placeholder="Stock Quantity" value={formData.stockQuantity} onChange={handleChange} required
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <input name="brand" placeholder="Brand Name" value={formData.brand} onChange={handleChange} required
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500" />
                                    <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} required
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <input name="material" placeholder="Material (e.g., Bamboo)" value={formData.material} onChange={handleChange}
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500" />
                                    <input name="certifications" placeholder="Certifications (e.g., FairTrade)" value={formData.certifications} onChange={handleChange}
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500" />
                                </div>

                                <div className="col-span-1 md:col-span-2 relative group mt-2">
                                    <div className="absolute inset-0 bg-linear-to-r from-emerald-500/20 to-teal-500/20 rounded-xl blur transition-all group-hover:bg-emerald-500/30"></div>
                                    <div className="relative bg-slate-950/50 border border-slate-800 border-dashed rounded-xl px-4 py-4 transition-all group-hover:border-emerald-500/50">
                                        <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
                                            <span className="text-sm text-slate-400 mb-2 group-hover:text-emerald-400 transition-colors">
                                                {imageFiles ? imageFiles.name : "Click to upload product image"}
                                            </span>
                                            <input 
                                                id="fileInput"
                                                type="file" 
                                                accept="image/*" 
                                                multiple // <-- ADD THIS
                                                onChange={handleFileChange} 
                                                className="hidden" 
                                            />
                                            <span className="text-sm text-slate-400 mb-2 group-hover:text-emerald-400 transition-colors">
                                                {imageFiles.length > 0 ? `${imageFiles.length} files selected` : "Click to upload product images"}
                                            </span>
                                            <div className="bg-slate-800 px-4 py-1.5 rounded-md text-xs font-semibold text-white shadow-sm border border-slate-700 group-hover:bg-emerald-600 group-hover:border-emerald-500 transition-all">
                                                Browse Files
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Eco Section Highlights */}
                            <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-xl p-4 mt-2">
                                <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 block flex items-center gap-1">
                                    <Leaf size={14} /> Environmental Impact
                                </label>
                                <input name="co2Emission" type="number" step="0.1" placeholder="CO2 Emission (kg)" value={formData.co2Emission} onChange={handleChange} required
                                    className="w-full bg-slate-950/50 border border-emerald-900/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all mb-4" />
                                
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input type="checkbox" name="isEcoFriendly" checked={formData.isEcoFriendly} onChange={handleChange} className="sr-only peer" />
                                        <div className="w-10 h-6 bg-slate-800 rounded-full peer peer-checked:bg-emerald-500 transition-colors"></div>
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow-sm"></div>
                                    </div>
                                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Mark as Eco-Friendly Alternative</span>
                                </label>
                            </div>

                            <button type="submit" className="w-full relative group overflow-hidden rounded-xl p-[1px]">
                                <span className="absolute inset-0 bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-500 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></span>
                                <div className="relative bg-slate-950 px-4 py-3 rounded-xl flex items-center justify-center gap-2 group-hover:bg-opacity-0 transition-all duration-300">
                                    <span className="font-bold text-white tracking-wide">Publish Product</span>
                                    <Plus className="w-5 h-5 text-white" />
                                </div>
                            </button>
                        </form>
                    </div>
                </motion.div>

                {/* RIGHT COLUMN: The Grid */}
                <div className="lg:col-span-8">
                    {products.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-800 rounded-2xl py-20">
                            <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
                            <p>Inventory is empty. Add your first product.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {products.map((product, index) => (
                                    <motion.div 
                                        key={product.id}
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: index * 0.05 }}
                                        className="group bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 relative flex flex-col"
                                    >
                                        {/* Image Section */}
                                        <div className="h-48 overflow-hidden relative bg-slate-800">
                                            <img src={product.imageUrls[0] || "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&q=80&w=600"} 
                                                alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                                            
                                            {/* Delete Button (Appears on hover) */}
                                            <button onClick={() => handleDelete(product.id)} 
                                                className="absolute top-3 right-3 p-2 bg-red-500/80 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:scale-110 transition-all duration-200 shadow-lg">
                                                <Trash size={16} />
                                            </button>

                                            {/* Eco Badge */}
                                            {product.isEcoFriendly && (
                                                <div className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                                    <Leaf size={12} /> Eco Choice
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-5 grow flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-lg text-white leading-tight truncate pr-2">{product.name}</h3>
                                                    <span className="font-mono font-semibold text-emerald-400">${product.price}</span>
                                                </div>
                                                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{product.category}</span>
                                            </div>
                                            
                                            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${product.co2Emission > 5 ? "bg-red-500" : "bg-emerald-500 animate-pulse"}`} />
                                                    <span className="text-sm text-slate-300 font-mono">{product.co2Emission} kg CO₂</span>
                                                </div>
                                            </div>
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

export default AdminDashboard;