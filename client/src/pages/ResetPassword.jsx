import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '../lib/axios';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); // Get token from URL
    
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post("/auth/reset-password", {
                token,
                newPassword: password
            });
            alert('Password successfully reset! Please login.');
            navigate('/login');
        } catch (err) {
            alert('Error: ' + (err.response?.data || 'Token invalid or expired'));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-center text-white mb-6">Set New Password</h2>
                <form onSubmit={handleReset} className="space-y-4">
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <input 
                            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="New secure password" required
                        />
                    </div>
                    <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2">
                        <CheckCircle size={18} /> Confirm Change
                    </button>
                </form>
            </motion.div>
        </div>
    );
};
export default ResetPassword;