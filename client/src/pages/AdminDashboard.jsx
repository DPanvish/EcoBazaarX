import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash, Edit, Leaf } from 'lucide-react';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: '', price: '', category: '', co2Emission: '', isEcoFriendly: false, imageUrl: ''
    });

    // Fetch products on load
    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const res = await axios.get('http://localhost:8080/api/products');
        setProducts(res.data);
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/products/add', formData);
            alert('Product Added!');
            loadProducts(); // Refresh list
            setFormData({ name: '', price: '', category: '', co2Emission: '', isEcoFriendly: false, imageUrl: '' });
        } catch (err) {
            alert('Error adding product');
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Delete this product?")) {
            await axios.delete(`http://localhost:8080/api/products/${id}`);
            loadProducts();
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 p-8 text-white">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <Leaf className="text-green-400" /> Admin Dashboard
            </h1>

            {/* Add Product Form */}
            <div className="bg-slate-800 p-6 rounded-lg mb-8 border border-slate-700">
                <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} className="bg-slate-700 p-3 rounded" required />
                    <input name="price" type="number" placeholder="Price ($)" value={formData.price} onChange={handleChange} className="bg-slate-700 p-3 rounded" required />
                    <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="bg-slate-700 p-3 rounded" required />
                    <input name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} className="bg-slate-700 p-3 rounded" />
                    
                    {/* Eco Fields */}
                    <div className="bg-green-900/20 p-4 rounded border border-green-500/30">
                        <label className="block text-sm text-green-300 mb-1">Carbon Footprint (kg CO2)</label>
                        <input name="co2Emission" type="number" step="0.1" value={formData.co2Emission} onChange={handleChange} className="w-full bg-slate-700 p-2 rounded" required />
                        
                        <div className="flex items-center mt-3 gap-2">
                            <input type="checkbox" name="isEcoFriendly" checked={formData.isEcoFriendly} onChange={handleChange} className="w-5 h-5 accent-green-500" />
                            <span className="text-sm">Is this an Eco-Friendly Product?</span>
                        </div>
                    </div>

                    <button type="submit" className="col-span-2 bg-green-600 hover:bg-green-500 p-3 rounded font-bold flex justify-center items-center gap-2">
                        <Plus size={20} /> Add Product
                    </button>
                </form>
            </div>

            {/* Product List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                    <div key={product.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 relative group">
                        <img src={product.imageUrl || "https://via.placeholder.com/150"} alt={product.name} className="w-full h-40 object-cover rounded mb-3" />
                        <h3 className="font-bold text-lg">{product.name}</h3>
                        <p className="text-slate-400 text-sm">{product.category}</p>
                        <div className="flex justify-between items-center mt-2">
                            <span className="font-mono text-green-400">${product.price}</span>
                            <span className={`text-xs px-2 py-1 rounded ${product.isEcoFriendly ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                {product.co2Emission} kg CO2
                            </span>
                        </div>
                        
                        <button onClick={() => handleDelete(product.id)} className="absolute top-2 right-2 bg-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;