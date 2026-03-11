import React, { useState, useEffect } from 'react';
import { BarChart, Leaf, Award } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import EcoBadges from '../components/EcoBadges';
import axiosInstance from '../lib/axios';
import { useQuery } from '@tanstack/react-query';
import { carbonApi, achievementApi, productApi, user } from '../lib/api';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const UserDashboard = () => {
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = user.getCurrentUser();
        if (currentUser) {
            setUserId(currentUser.id);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const { data: carbonData = [] } = useQuery({
        queryKey: ['carbonFootprint', userId],
        queryFn: () => carbonApi.getForUser(userId),
        enabled: !!userId,
    });

    const { data: achievements = [] } = useQuery({
        queryKey: ['achievements', userId],
        queryFn: () => achievementApi.getForUser(userId),
        enabled: !!userId,
    });

    const { data: products = [] } = useQuery({
        queryKey: ['products'],
        queryFn: productApi.getAll,
    });

    const topEcoProducts = products.filter(p => p.isEcoFriendly).slice(0, 3);

    const handleDownloadReport = () => {
        if (!carbonData || carbonData.length === 0) {
            alert('No carbon data available to generate a report.');
            return;
        }
        const productId = carbonData[0].productId;
        axiosInstance.get(`/carbon/product/${productId}/report`, { responseType: 'blob' })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'eco-report.pdf');
                document.body.appendChild(link);
                link.click();
                link.remove();
            })
            .catch(error => {
                console.error('Error downloading report:', error);
            });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-12">
            {/* Ambient Glowing Backgrounds */}
            <div className="fixed top-[-10%] left-[-5%] w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Header */}
            <header className="sticky top-0 z-50 bg-slate-900/50 backdrop-blur-md border-b border-white/10 px-8 py-4 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-linear-to-br from-emerald-400 to-green-600 rounded-lg shadow-lg shadow-green-500/20">
                        <BarChart className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
                        Your Eco Dashboard
                    </h1>
                </div>
                <Link to="/carbon-dashboard" className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                    Carbon Insights
                </Link>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Carbon Footprint Summary */}
                    <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Leaf className="text-emerald-400" />
                            Monthly Carbon Footprint
                        </h2>
                        <div className="h-64">
                            {carbonData && carbonData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={carbonData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="calculationDate" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                                        <Legend wrapperStyle={{ fontSize: '14px' }} />
                                        <Line type="monotone" dataKey="carbonFootprint" stroke="#10b981" name="Carbon Footprint (kg)" />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-500">
                                    <p>No carbon data yet. Purchase a product to see your footprint.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Achievements */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Award className="text-yellow-400" />
                            Achievements
                        </h2>
                        <EcoBadges achievements={achievements} />
                    </div>
                </div>

                {/* Top Eco-Friendly Products */}
                <div className="mt-8 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                    <h2 className="text-xl font-bold text-white mb-4">Top Eco-Friendly Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {topEcoProducts.map(product => (
                            <div key={product.id} className="bg-slate-800/50 p-4 rounded-lg">
                                <h3 className="font-bold text-lg text-white">{product.name}</h3>
                                <p className="text-sm text-slate-400">{product.category}</p>
                                <p className="text-lg font-semibold text-emerald-400 mt-2">${product.price}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Download Report Button */}
                <div className="mt-8 text-center">
                    <button onClick={handleDownloadReport} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        Download Eco-Report
                    </button>
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;
