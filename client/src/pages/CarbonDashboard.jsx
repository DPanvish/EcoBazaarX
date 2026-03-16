import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { carbonApi, user } from '../lib/api';
import { Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CarbonDashboard = () => {
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

    const { data: carbonData = [], isLoading } = useQuery({
        queryKey: ['carbonFootprint', userId],
        queryFn: () => carbonApi.getForUser(userId),
        enabled: !!userId, // only run query if userId is available
    });

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-12">
            <div className="fixed top-[-10%] left-[-5%] w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

            <header className="sticky top-0 z-50 bg-slate-900/50 backdrop-blur-md border-b border-white/10 px-8 py-4 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-linear-to-br from-emerald-400 to-green-600 rounded-lg shadow-lg shadow-green-500/20">
                        <Leaf className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
                        Your Carbon History
                    </h1>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-10">
                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                    {isLoading ? (
                        <p>Loading your carbon history...</p>
                    ) : carbonData && carbonData.length > 0 ? (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    <th className="p-4">Product ID</th>
                                    <th className="p-4">Carbon Footprint (kg)</th>
                                    <th className="p-4">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {carbonData.map(item => (
                                    <tr key={item.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                                        <td className="p-4">{item.productId}</td>
                                        <td className="p-4">{item.carbonFootprint}</td>
                                        <td className="p-4">{new Date(item.calculationDate).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-500">
                            <p>No carbon history yet. Your carbon footprint from purchases will appear here.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CarbonDashboard;
