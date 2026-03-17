import React, { useState, useEffect } from 'react';
import { Trash, Leaf, Package, Activity, AlertCircle, BarChart3, Users, DollarSign, ShoppingBag, Clock, ShieldCheck, XCircle, CheckCircle, Download, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axiosInstance from '../lib/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../lib/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    // Tabs: inventory, verifications, users, analytics
    const [activeTab, setActiveTab] = useState('inventory'); 
    const [analyticsData, setAnalyticsData] = useState([]);
    const [summaryData, setSummaryData] = useState(null); 
    const [loadingAnalytics, setLoadingAnalytics] = useState(false);
    const [usersList, setUsersList] = useState([]);

    // Fetch Analytics Data
    useEffect(() => {
        if (activeTab === 'analytics' && analyticsData.length === 0) {
            setLoadingAnalytics(true);
            Promise.all([
                axiosInstance.get('/analytics/admin/top-products'),
                axiosInstance.get('/analytics/admin/summary')
            ])
            .then(([productsRes, summaryRes]) => {
                setAnalyticsData(productsRes.data);
                setSummaryData(summaryRes.data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoadingAnalytics(false));
        }
    }, [activeTab]);

    // Fetch Users Data
    useEffect(() => {
        if (activeTab === 'users') {
            axiosInstance.get('/admin/users').then(res => setUsersList(res.data)).catch(console.error);
        }
    }, [activeTab]);

    // Fetch All Platform Products
    const {data: products = [], isLoading: loading} = useQuery({
        queryKey: ['products'],
        queryFn: productApi.getAll
    });

    const deleteProductMutation = useMutation({
        mutationFn: async (id) => {
            const { data } = await axiosInstance.delete(`/products/${id}`);
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries(['products'])
    });

    const handleDelete = async (id) => {
        if(window.confirm("Delete this product from the platform? This cannot be undone.")) {
            deleteProductMutation.mutate(id);
        }
    };

    const handleVerifyProduct = async (id, status) => {
        try {
            await axiosInstance.put(`/products/${id}/verify`, { status });
            queryClient.invalidateQueries(['products']);
        } catch (err) {
            console.error("Verification failed", err);
        }
    };

    const handleDownloadPlatformReport = async () => {
        try {
            const res = await axiosInstance.get('/analytics/admin/report/download', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'EcoBazaar_Platform_Report.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            alert("Failed to generate report.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Filter products requiring verification
    const pendingProducts = products.filter(p => p.isEcoFriendly && (!p.verificationStatus || p.verificationStatus === 'PENDING'));

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 relative overflow-hidden font-sans pb-12">
            <div className="fixed top-[-10%] left-[-5%] w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
            
            <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-8 py-4 flex flex-col md:flex-row justify-between items-center shadow-lg gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg shadow-purple-500/20">
                        <ShieldCheck className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Admin Command Center
                    </h1>
                </div>

                <div className="flex flex-wrap bg-slate-800/50 p-1 rounded-xl border border-white/5">
                    <button onClick={() => setActiveTab('inventory')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'inventory' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>
                        <Package size={16} /> All Inventory
                    </button>
                    <button onClick={() => setActiveTab('verifications')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'verifications' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>
                        <ShieldCheck size={16} /> Verifications
                        {pendingProducts.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingProducts.length}</span>}
                    </button>
                    <button onClick={() => setActiveTab('users')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>
                        <Users size={16} /> Users
                    </button>
                    <button onClick={() => setActiveTab('analytics')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'analytics' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>
                        <BarChart3 size={16} /> Analytics
                    </button>
                </div>

                <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 font-bold transition-all">
                    <LogOut size={18} /> Logout
                </button>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-10">
                
                {/* --- TAB 1: FULL PLATFORM INVENTORY --- */}
                {activeTab === 'inventory' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">Global Inventory</h2>
                                <p className="text-slate-400 text-sm">View and manage all products submitted by sellers.</p>
                            </div>
                        </div>

                        {loading ? <div className="text-purple-400 animate-pulse font-bold">Loading Platform Data...</div> : products.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-800 rounded-2xl py-20">
                                <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
                                <p>No products exist on the platform yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                <AnimatePresence>
                                    {products.map((product) => (
                                        <motion.div key={product.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden shadow-lg relative flex flex-col">
                                            <div className="h-48 overflow-hidden relative bg-slate-800">
                                                <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                                                <button onClick={() => handleDelete(product.id)} className="absolute top-3 right-3 p-2 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-all"><Trash size={16} /></button>
                                                
                                                {/* Verification Status Badge */}
                                                {product.isEcoFriendly && product.verificationStatus === 'APPROVED' && (
                                                    <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><CheckCircle size={12} /> Verified</div>
                                                )}
                                                {product.isEcoFriendly && (!product.verificationStatus || product.verificationStatus === 'PENDING') && (
                                                    <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><AlertCircle size={12} /> Pending</div>
                                                )}
                                            </div>
                                            <div className="p-4 flex flex-col justify-between grow">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-lg text-white truncate">{product.name}</h3>
                                                    <span className="font-mono font-semibold text-emerald-400">${product.price}</span>
                                                </div>
                                                <div className="mt-2 text-xs text-slate-400 flex justify-between">
                                                    <span className="font-mono">{product.co2Emission} kg CO₂</span>
                                                    <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">Seller: {product.sellerEmail || 'Unknown'}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* --- TAB 2: VERIFICATIONS VIEW (WORKFLOW) --- */}
                {activeTab === 'verifications' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                            <h2 className="text-2xl font-bold text-white mb-2">Green Certification Workflow</h2>
                            <p className="text-slate-400 mb-8">Review seller submissions claiming eco-friendly status.</p>

                            {pendingProducts.length === 0 ? (
                                <div className="text-center py-12 border border-dashed border-slate-700 rounded-2xl text-slate-500">
                                    <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No pending products to verify. You're all caught up!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {pendingProducts.map(product => (
                                        <div key={product.id} className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col h-full">
                                            <div className="flex gap-4 mb-4">
                                                <img src={product.imageUrls[0]} alt={product.name} className="w-16 h-16 rounded-xl object-cover" />
                                                <div>
                                                    <h3 className="font-bold text-white leading-tight">{product.name}</h3>
                                                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{product.sellerEmail}</p>
                                                </div>
                                            </div>
                                            <div className="bg-slate-950 p-3 rounded-xl mb-4 space-y-2 text-sm grow">
                                                <div className="flex justify-between"><span className="text-slate-500">Claimed CO₂:</span> <span className="text-emerald-400 font-mono">{product.co2Emission} kg</span></div>
                                                <div className="flex justify-between"><span className="text-slate-500">Material:</span> <span className="text-slate-300">{product.material || 'N/A'}</span></div>
                                                <div className="flex justify-between"><span className="text-slate-500">Certs:</span> <span className="text-slate-300">{product.certifications || 'None provided'}</span></div>
                                            </div>
                                            <div className="flex gap-3 mt-auto">
                                                <button onClick={() => handleVerifyProduct(product.id, 'APPROVED')} className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-400 py-2 rounded-xl text-sm font-bold flex justify-center items-center gap-1 transition-colors">
                                                    <CheckCircle size={16}/> Approve
                                                </button>
                                                <button onClick={() => handleVerifyProduct(product.id, 'REJECTED')} className="flex-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 py-2 rounded-xl text-sm font-bold flex justify-center items-center gap-1 transition-colors">
                                                    <XCircle size={16}/> Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* --- TAB 3: USERS DIRECTORY --- */}
                {activeTab === 'users' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                            <h2 className="text-2xl font-bold text-white mb-2">User & Seller Directory</h2>
                            <p className="text-slate-400 mb-8">Manage platform access and roles.</p>
                            
                            <div className="overflow-x-auto rounded-xl border border-slate-800">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-950 text-slate-400 text-sm">
                                        <tr>
                                            <th className="p-4 font-medium">ID</th>
                                            <th className="p-4 font-medium">Full Name</th>
                                            <th className="p-4 font-medium">Email</th>
                                            <th className="p-4 font-medium">Role</th>
                                            <th className="p-4 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {usersList.map(user => (
                                            <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                                                <td className="p-4 text-slate-500 text-sm">{user.id}</td>
                                                <td className="p-4 text-white font-medium">{user.fullName}</td>
                                                <td className="p-4 text-slate-300 text-sm">{user.email}</td>
                                                <td className="p-4">
                                                    <span className={`text-xs px-2 py-1 rounded-md font-bold ${
                                                        user.role === 'ROLE_ADMIN' ? 'bg-purple-500/20 text-purple-400' : 
                                                        user.role === 'ROLE_SELLER' ? 'bg-blue-500/20 text-blue-400' : 
                                                        'bg-emerald-500/20 text-emerald-400'
                                                    }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => {
                                                        if(window.confirm(`Delete user ${user.email}?`)) {
                                                            axiosInstance.delete(`/admin/users/${user.id}`).then(() => setUsersList(usersList.filter(u => u.id !== user.id)));
                                                        }
                                                    }} className="text-red-400 hover:text-red-300 p-2 bg-red-500/10 rounded-lg">
                                                        <Trash size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* --- TAB 4: ANALYTICS & REPORTS VIEW --- */}
                {activeTab === 'analytics' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        {loadingAnalytics || !summaryData ? (
                            <div className="h-96 flex items-center justify-center text-purple-500 font-bold animate-pulse">Loading Platform Data...</div>
                        ) : (
                            <>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-1">Sustainability Reports</h2>
                                        <p className="text-slate-400 text-sm">System-wide metrics and performance.</p>
                                    </div>
                                    <button onClick={handleDownloadPlatformReport} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-purple-900/50 flex items-center gap-2 transition-all transform hover:scale-105">
                                        <Download size={18} /> Export System PDF
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl flex items-center gap-4">
                                        <div className="p-4 bg-blue-500/20 text-blue-400 rounded-2xl"><DollarSign size={28} /></div>
                                        <div>
                                            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Total Revenue</p>
                                            <h3 className="text-2xl font-black text-white">${summaryData.totalRevenue.toFixed(2)}</h3>
                                        </div>
                                    </div>
                                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl flex items-center gap-4">
                                        <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-2xl"><Leaf size={28} /></div>
                                        <div>
                                            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Platform CO₂ Saved</p>
                                            <h3 className="text-2xl font-black text-white">{summaryData.totalCo2Saved.toFixed(1)} kg</h3>
                                        </div>
                                    </div>
                                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl flex items-center gap-4">
                                        <div className="p-4 bg-indigo-500/20 text-indigo-400 rounded-2xl"><ShoppingBag size={28} /></div>
                                        <div>
                                            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Total Orders</p>
                                            <h3 className="text-2xl font-black text-white">{summaryData.totalOrders}</h3>
                                        </div>
                                    </div>
                                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl flex items-center gap-4">
                                        <div className="p-4 bg-orange-500/20 text-orange-400 rounded-2xl"><Users size={28} /></div>
                                        <div>
                                            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Total Accounts</p>
                                            <h3 className="text-2xl font-black text-white">{summaryData.totalUsers}</h3>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                                        <div className="mb-6">
                                            <h2 className="text-xl font-bold text-white">Top Eco-Products</h2>
                                            <p className="text-sm text-slate-400">Highest carbon savings by volume.</p>
                                        </div>
                                        {analyticsData.length === 0 ? (
                                            <div className="h-64 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-700 rounded-2xl">
                                                <BarChart3 className="w-8 h-8 mb-2 opacity-50" />
                                                <p className="text-sm">No eco-friendly sales yet.</p>
                                            </div>
                                        ) : (
                                            <div className="h-64 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={analyticsData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" />
                                                        <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                                        <YAxis dataKey="productName" type="category" width={100} tick={{ fill: '#f8fafc', fontSize: 12 }} axisLine={false} tickLine={false} />
                                                        <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#10b981', borderRadius: '12px', color: '#fff' }} />
                                                        <Bar dataKey="unitsSold" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                                        <div className="mb-6 flex justify-between items-center">
                                            <div>
                                                <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
                                                <p className="text-sm text-slate-400">Latest platform orders.</p>
                                            </div>
                                            <Clock className="text-slate-500" />
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="text-slate-400 text-sm border-b border-slate-800">
                                                        <th className="pb-3 font-medium">User</th>
                                                        <th className="pb-3 font-medium">Amount</th>
                                                        <th className="pb-3 font-medium">CO₂ Saved</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {summaryData.recentOrders.length === 0 ? (
                                                        <tr><td colSpan="3" className="text-center py-8 text-slate-500 text-sm">No orders found.</td></tr>
                                                    ) : (
                                                        summaryData.recentOrders.map((order, idx) => (
                                                            <tr key={idx} className="border-b border-slate-800/50 last:border-0">
                                                                <td className="py-4 text-sm text-white truncate max-w-[120px]">{order.userEmail}</td>
                                                                <td className="py-4 text-sm font-mono text-emerald-400">${order.totalAmount.toFixed(2)}</td>
                                                                <td className="py-4 text-sm text-slate-300">{order.totalCo2Saved.toFixed(1)} kg</td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}

            </main>
        </div>
    );
};

export default AdminDashboard;