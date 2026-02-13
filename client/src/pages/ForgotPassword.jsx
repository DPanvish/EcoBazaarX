import React, { useState } from 'react';
import axios from 'axios';
import { Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '../lib/axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleRequest = async (e) => {
        e.preventDefault();
        try {
            axiosInstance.post("/auth/forgot-password", { email });
            setMessage('Reset link generated! Check the Email.');
        } catch (err) {
            alert('Error: ' + (err.response?.data || err.message));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
             {/* Background Effects */}
             <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10 w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-center text-white mb-2">Forgot Password?</h2>
                <p className="text-slate-400 text-center mb-6">Enter your email to receive a reset link.</p>

                {message ? (
                    <div className="p-3 bg-green-500/20 border border-green-500/50 rounded text-green-300 text-center">
                        {message}
                    </div>
                ) : (
                    <form onSubmit={handleRequest} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                            <input 
                                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="you@example.com" required
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all">
                            Send Reset Link
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};
export default ForgotPassword;