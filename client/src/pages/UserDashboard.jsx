import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom'; 
import { ArrowLeft, Download } from 'lucide-react';
import axiosInstance from "../lib/axios"

const UserDashboard = () => {
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState({
        monthlyTrend: [],
        lifetimeSavings: 0,
        badges: []
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axiosInstance.get('/analytics/user/dashboard');

                let trend = res.data.monthlyTrend || [];

                if (trend.length === 1) {
                    trend = [
                        { month: 'Start', co2Saved: 0 },
                        ...trend
                    ];
                }

                setDashboardData({
                    ...res.data,
                    monthlyTrend: trend
                });
            } catch (err) {
                console.error("Failed to load analytics", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const handleDownloadReport = async () => {
        try {
            // We MUST specify responseType 'blob' to handle binary file data securely with Axios
            const res = await axiosInstance.get('/analytics/user/report/download', {
                responseType: 'blob' 
            });
            
            // Create a temporary URL to trigger the browser's download behavior
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'My_Eco_Impact_Report.pdf');
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            
        } catch (err) {
            console.error("Failed to download report", err);
            alert("Failed to generate report. Please try again.");
        }
    };

    if (loading) return <div className="text-center mt-20 text-green-600 font-bold">Loading your impact...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8 mt-10">
            <button 
                onClick={() => navigate('/shop')} 
                className="flex items-center gap-2 text-slate-500 hover:text-green-500 font-bold transition-colors mb-4"
            >
                <ArrowLeft size={20} /> Back to Shop
            </button>

            {/* Header Stats */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-700 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Your Environmental Impact</h1>
                    <p className="text-green-100 text-lg">Every eco-swap makes a difference.</p>
                    <div className="mt-6">
                        <span className="text-5xl font-black">{dashboardData.lifetimeSavings.toFixed(2)}</span>
                        <span className="text-2xl ml-2">kg CO₂ Saved</span>
                    </div>
                </div>
                
                <button 
                    onClick={handleDownloadReport}
                    className="bg-white/20 hover:bg-white/30 border border-white/40 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all transform hover:scale-105"
                >
                    <Download size={20} /> Download PDF Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Badges Section */}
                <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Eco Achievements</h3>
                    <div className="flex flex-col space-y-3">
                        {dashboardData.badges.map((badge, index) => (
                            <div key={index} className="bg-green-50 text-green-800 font-semibold p-4 rounded-xl flex items-center shadow-sm">
                                <span className="text-2xl mr-3">{badge.split(' ')[0]}</span>
                                <span>{badge.substring(badge.indexOf(' ') + 1)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chart Section */}
                <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-lg border border-gray-100 h-96">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Monthly Carbon Trend</h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <AreaChart data={dashboardData.monthlyTrend}>
                            <defs>
                                <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis 
                                dataKey="month" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#9ca3af', fontSize: 12 }} 
                                dy={10} 
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#9ca3af', fontSize: 12 }} 
                                dx={-10} 
                            />
                            <Tooltip 
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="co2Saved" 
                                stroke="#10b981" 
                                strokeWidth={4}
                                fillOpacity={1} 
                                fill="url(#colorCo2)"
                                activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} 
                                name="kg CO₂ Saved"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;