import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Lock, Mail, User, ArrowRight, Briefcase, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'ROLE_USER' // Default role
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/;

    const validate = () => {
        let tempErrors = {};
        
        if (!formData.fullName || formData.fullName.length < 3) 
            tempErrors.fullName = "Name must be at least 3 characters.";
            
        if (!emailRegex.test(formData.email)) 
            tempErrors.email = "Invalid email format.";
            
        if (!passwordRegex.test(formData.password)) 
            tempErrors.password = "Password must be 8+ chars, with 1 uppercase, 1 lowercase, 1 number, and 1 special char.";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0; 
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!validate()){ 
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, formData);
            alert('Registration Successful! Please Login.');
            navigate('/login');
        } catch (err) {
            alert('Signup failed: ' + (err.response?.data || err.message));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900">
            {/* Background Effects */}
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-emerald-500/30 rounded-full blur-[128px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-green-500/20 rounded-full blur-[128px]" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-xl"
            >
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-green-500/20 rounded-full">
                        <Leaf className="w-8 h-8 text-green-400" />
                    </div>
                </div>
                
                <h2 className="text-3xl font-bold text-center text-white mb-2">Join EcoBazaar</h2>
                <p className="text-slate-400 text-center mb-8">Start your sustainable journey</p>

                <form onSubmit={handleSignup} className="space-y-5">
                    
                    {/* Full Name */}
                    <div>
                        <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                        <div className="relative mt-1">
                            <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                            <input 
                                type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                placeholder="John Doe" required
                            />
                        </div>
                        {errors.fullName && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.fullName}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                        <div className="relative mt-1">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                            <input 
                                type="email" name="email" value={formData.email} onChange={handleChange}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                placeholder="you@example.com" required
                            />
                        </div>
                        {errors.email && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.email}</p>}
                    </div>

                    {/* Role Selection Dropdown */}
                    <div>
                        <label className="text-sm font-medium text-slate-300 ml-1">I am a...</label>
                        <div className="relative mt-1">
                            <Briefcase className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                            <select 
                                name="role" 
                                value={formData.role} 
                                onChange={handleChange}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer transition-all"
                            >
                                <option value="ROLE_USER">Customer (Shop for Eco-Products)</option>
                                <option value="ROLE_ADMIN">Admin (Manage Inventory)</option>
                            </select>
                            
                            {/* Custom Arrow for Dropdown */}
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                            </div>
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                        <div className="relative mt-1">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                            <input 
                                type="password" name="password" value={formData.password} onChange={handleChange}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                placeholder="••••••••" required
                            />
                        </div>
                        {errors.password && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.password}</p>}
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
                    >
                        Create Account <ArrowRight className="w-5 h-5" />
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-400">
                    Already have an account? 
                    <Link to="/login" className="text-green-400 hover:text-green-300 ml-1 font-medium">Log in</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;