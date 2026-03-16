import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf, ShieldCheck, ArrowRight as ArrowRightRight, CheckCircle, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '../lib/api';
import axiosInstance from '../lib/axios';

// STRIPE IMPORTS
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';


const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY);

// --- THE ACTUAL PAYMENT FORM COMPONENT ---
const StripeCheckoutForm = ({ onSuccess, amount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        setErrorMessage(null);

        // Confirm the payment with Stripe
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: window.location.origin + '/checkout' }, 
            redirect: 'if_required', 
        });

        if (error) {
            setErrorMessage(error.message);
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            onSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl mt-8 shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Lock className="text-green-400 w-5 h-5"/> Secure Payment</h2>
            
            {/* This is the magic Stripe UI component */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
                <PaymentElement options={{ theme: 'night' }} />
            </div>

            {errorMessage && <div className="text-red-400 text-sm mb-4">{errorMessage}</div>}

            <button 
                type="submit" 
                disabled={isProcessing || !stripe}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
            >
                {isProcessing ? "Processing Payment..." : `Pay $${amount}`}
            </button>
        </form>
    );
};


// --- MAIN CHECKOUT PAGE ---
const Checkout = () => {
    const { cart, removeFromCart, calculateTotalImpact, calculateTotalPrice, clearCart, swapCartItem } = useCart();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const createOrderMutation = useMutation({
        mutationFn: (orderPayload) => orderApi.create(orderPayload),
        onSuccess: () => {
            setIsConfirmed(true);
            clearCart();
        },
        onError: (err) => alert("There was an issue saving your order.")
    });

    // When user clicks "Proceed to Payment", get the Secret from Spring Boot
    const handleInitializePayment = async () => {
        setIsCheckingOut(true);
        try {
            const res = await axiosInstance.post('/payment/create-payment-intent', {
                amount: calculateTotalPrice()
            });
            setClientSecret(res.data.clientSecret);
        } catch (error) {
            console.error("Failed to initialize Stripe", error);
            alert("Payment system is currently unavailable.");
            setIsCheckingOut(false);
        }
    };

    // Called ONLY when Stripe says the card was charged successfully
    const handlePaymentSuccess = () => {
        const orderPayload = {
            items: cart,
            totalAmount: calculateTotalPrice(),
            totalCo2: calculateTotalImpact()
        };
        createOrderMutation.mutate(orderPayload);
    };


    if (isConfirmed) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white px-6">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 p-12 rounded-3xl border border-green-500/30 text-center max-w-lg">
                    <CheckCircle className="w-24 h-24 text-green-400 mx-auto mb-6" />
                    <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
                    <p className="text-slate-400 mb-8">Thank you for shopping mindfully. Your order has been placed securely.</p>
                    <button onClick={() => navigate('/shop')} className="bg-green-500 text-white font-bold py-3 px-8 rounded-full hover:bg-green-400">
                        Continue Shopping
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white py-20 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* LEFT COLUMN */}
                <div className="lg:col-span-7">
                    <button onClick={() => navigate('/shop')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                        <ArrowLeft size={18} /> Back to Shop
                    </button>
                    
                    <h1 className="text-3xl font-bold mb-8">Secure Checkout</h1>

                    {/* ONLY SHOW STRIPE FORM IF CLIENT SECRET EXISTS */}
                    {clientSecret ? (
                        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
                            <StripeCheckoutForm onSuccess={handlePaymentSuccess} amount={calculateTotalPrice()} />
                        </Elements>
                    ) : (
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col items-center justify-center text-center">
                            <ShieldCheck className="w-16 h-16 text-blue-400 mb-4" />
                            <h2 className="text-xl font-bold mb-2">Ready to complete your order?</h2>
                            <p className="text-slate-400 mb-6">Review your impact cart on the right, then proceed to secure payment.</p>
                            
                            <button 
                                onClick={handleInitializePayment} 
                                disabled={cart.length === 0 || isCheckingOut}
                                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50"
                            >
                                {isCheckingOut ? "Connecting to secure gateway..." : "Proceed to Payment"}
                            </button>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: Order Summary */}
                <div className="lg:col-span-5">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sticky top-24">
                        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                        
                        <div className="space-y-4 mb-8 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {cart.length === 0 ? <p className="text-slate-500 text-center py-4">Cart is empty</p> : 
                                cart.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <img src={item.imageUrl} className="w-10 h-10 rounded-lg object-cover" />
                                            <div>
                                                <p className="text-sm font-bold text-white">{item.name}</p>
                                                <p className="text-xs text-slate-500">{item.co2Emission} kg CO₂</p>
                                            </div>
                                        </div>
                                        <span className="font-mono font-bold">${item.price}</span>
                                    </div>
                                ))
                            }
                        </div>

                        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl mb-6">
                            <h3 className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-3">Total Impact</h3>
                            <span className={`text-3xl font-bold font-mono ${calculateTotalImpact() > 15 ? 'text-red-400' : 'text-green-400'}`}>
                                {calculateTotalImpact()} <span className="text-lg">kg CO₂</span>
                            </span>
                        </div>

                        <div className="flex justify-between items-center text-2xl font-bold pt-6 border-t border-slate-800">
                            <span>Total</span>
                            <span className="font-mono text-green-400">${calculateTotalPrice()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;