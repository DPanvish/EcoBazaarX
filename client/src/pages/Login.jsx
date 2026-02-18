import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Lock, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from "../lib/axios"

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post("/auth/login", {
                email, password
            });
            alert(`Welcome back, ${res.data.name}!`);
            // Store role/user data here later
            if(res.data.role === 'ROLE_ADMIN') navigate('/admin');
            else navigate('/shop');
        } catch (err) {
            alert('Login failed: ' + (err.response?.data || err.message));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900">
            {/* Background Glow Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-500/30 rounded-full blur-[128px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/20 rounded-full blur-[128px]" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-xl"
            >
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-green-500/20 rounded-full">
                        <Leaf className="w-8 h-8 text-green-400" />
                    </div>
                </div>
                
                <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome Back</h2>
                <p className="text-slate-400 text-center mb-8">Login to continue your eco-journey</p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="login-email" className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                        <div className="relative mt-1">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                            <input 
                                type="email" 
                                id="login-email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                            
                            <Link 
                                to="/forgot-password" 
                                className="text-xs font-medium text-green-400 hover:text-green-300 transition-colors"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                        <div className="relative mt-1">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                            <input 
                                type="password" 
                                value={password}
                                id="login-password"
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
                    >
                        Sign In <ArrowRight className="w-5 h-5" />
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-400">
                    Don't have an account? 
                    <Link to="/signup" className="text-green-400 hover:text-green-300 ml-1 font-medium">Sign up</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;