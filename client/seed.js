
const API_BASE_URL = 'http://localhost:8080/api';

const SELLER_CREDENTIALS = {
    email: 'seller@gmail.com',
    password: 'Panvish@9885'
};

const dummyProducts = [
    {
        name: "Bamboo Toothbrush Family Pack", price: 12.99, category: "Health & Beauty", co2Emission: 0.2, isEcoFriendly: true,
        description: "Pack of 4 biodegradable bamboo toothbrushes with charcoal-infused BPA-free bristles.", brand: "EcoSmile", stockQuantity: 150, material: "Moso Bamboo", certifications: "FSC Certified",
        imageUrls: ["https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=600&q=80"]
    },
    {
        name: "Solar-Powered Portable Charger", price: 45.00, category: "Tech & Gadgets", co2Emission: 2.1, isEcoFriendly: true,
        description: "10,000mAh power bank that recharges via solar energy. Perfect for hiking and reducing grid reliance.", brand: "SunVolt", stockQuantity: 85, material: "Recycled Aluminum & Silicon", certifications: "CE, RoHS",
        imageUrls: ["https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=600&q=80"]
    },
    {
        name: "Organic Cotton Essential Tee", price: 24.50, category: "Fashion", co2Emission: 1.5, isEcoFriendly: true,
        description: "100% GOTS certified organic cotton t-shirt. Ultra-soft, breathable, and dyed with non-toxic colors.", brand: "EarthThreads", stockQuantity: 200, material: "Organic Cotton", certifications: "GOTS Certified",
        imageUrls: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80"]
    },
    {
        name: "Reusable Beeswax Food Wraps", price: 18.00, category: "Home & Kitchen", co2Emission: 0.1, isEcoFriendly: true,
        description: "Say goodbye to plastic wrap. Set of 3 washable, reusable wraps made from organic cotton and beeswax.", brand: "BeeGreen", stockQuantity: 300, material: "Beeswax & Cotton", certifications: "USDA Organic",
        imageUrls: ["https://images.unsplash.com/photo-1610419993549-74d12eb6085a?w=600&q=80"]
    },
    {
        name: "Ocean Plastic Sunglasses", price: 65.00, category: "Fashion", co2Emission: 0.8, isEcoFriendly: true,
        description: "Stylish UV400 sunglasses made entirely from recycled ocean plastics and fishing nets.", brand: "ClearTide", stockQuantity: 40, material: "Recycled Ocean Plastic", certifications: "B-Corp",
        imageUrls: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80"]
    },
    {
        name: "Compostable Phone Case", price: 29.99, category: "Tech & Gadgets", co2Emission: 0.4, isEcoFriendly: true,
        description: "100% compostable phone case that protects your phone from drops and the earth from plastic waste.", brand: "Pela", stockQuantity: 120, material: "Flax Shive & Plant Biopolymer", certifications: "Climate Neutral",
        imageUrls: ["https://images.unsplash.com/photo-1541560052-5e137f229371?w=600&q=80"]
    },
    {
        name: "Stainless Steel Insulated Bottle", price: 32.00, category: "Home & Kitchen", co2Emission: 1.8, isEcoFriendly: true,
        description: "Keeps drinks cold for 24 hours or hot for 12. Replaces thousands of single-use plastic bottles.", brand: "HydroLife", stockQuantity: 250, material: "Pro-Grade Stainless Steel", certifications: "BPA-Free",
        imageUrls: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80"]
    },
    {
        name: "Vegan Cactus Leather Wallet", price: 48.00, category: "Fashion", co2Emission: 1.1, isEcoFriendly: true,
        description: "Minimalist bifold wallet crafted from sustainable Desserto cactus leather. Cruelty-free and durable.", brand: "CactiStyle", stockQuantity: 60, material: "Cactus Leather", certifications: "PETA-Approved Vegan",
        imageUrls: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80"]
    },
    {
        name: "Natural Cork Yoga Mat", price: 55.00, category: "Health & Beauty", co2Emission: 2.5, isEcoFriendly: true,
        description: "Premium non-slip yoga mat made from sustainably harvested Portuguese cork and natural rubber.", brand: "ZenEarth", stockQuantity: 90, material: "Cork & Natural Rubber", certifications: "Eco-Harvest",
        imageUrls: ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80"]
    },
    {
        name: "Fairtrade Organic Coffee Beans", price: 16.50, category: "Groceries", co2Emission: 0.6, isEcoFriendly: true,
        description: "1lb of medium roast whole bean coffee. Shade-grown, organic, and ethically sourced from small farms.", brand: "MorningRoast", stockQuantity: 400, material: "Arabica Beans", certifications: "Fairtrade, USDA Organic",
        imageUrls: ["https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=600&q=80"]
    },
    {
        name: "Zero-Waste Shampoo Bar", price: 14.00, category: "Health & Beauty", co2Emission: 0.1, isEcoFriendly: true,
        description: "Long-lasting solid shampoo bar equivalent to 3 bottles of liquid shampoo. Ships in compostable paper.", brand: "Suds & Co", stockQuantity: 220, material: "Natural Oils", certifications: "Cruelty-Free",
        imageUrls: ["https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80"]
    },
    {
        name: "Energy-Saving Smart LED Bulb", price: 19.99, category: "Tech & Gadgets", co2Emission: 0.9, isEcoFriendly: true,
        description: "Wi-Fi enabled color-changing LED bulb that uses 80% less energy than incandescent bulbs.", brand: "LumiEco", stockQuantity: 180, material: "Glass & Electronics", certifications: "Energy Star",
        imageUrls: ["https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=600&q=80"]
    },
    {
        name: "Reusable Produce Bags (Set of 5)", price: 15.00, category: "Groceries", co2Emission: 0.2, isEcoFriendly: true,
        description: "Durable, washable mesh bags for grocery shopping. Say no to flimsy plastic produce bags.", brand: "MarketMesh", stockQuantity: 350, material: "Organic Cotton Mesh", certifications: "GOTS Certified",
        imageUrls: ["https://images.unsplash.com/photo-1581452912423-f36e4f326164?w=600&q=80"]
    },
    {
        name: "Hemp Canvas Tote Bag", price: 22.00, category: "Fashion", co2Emission: 0.5, isEcoFriendly: true,
        description: "Heavy-duty everyday tote made from hemp, one of the most sustainable fibers on earth.", brand: "HempWear", stockQuantity: 110, material: "100% Hemp Canvas", certifications: "Sustainable Fiber",
        imageUrls: ["https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=600&q=80"]
    },
    {
        name: "Bamboo Fiber Cutlery Travel Set", price: 11.50, category: "Home & Kitchen", co2Emission: 0.3, isEcoFriendly: true,
        description: "Fork, knife, spoon, and chopsticks in a canvas travel pouch. Perfect for lunches and travel.", brand: "EcoUtensil", stockQuantity: 275, material: "Bamboo Fiber", certifications: "BPA-Free",
        imageUrls: ["https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?w=600&q=80"]
    }
];

async function seedDatabase() {
    console.log("🌱 Starting EcoBazaarX Product Seeder...");

    try {
        // Login as Seller to get the JWT Token
        console.log(`Attempting to log in as ${SELLER_CREDENTIALS.email}...`);
        const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(SELLER_CREDENTIALS)
        });

        if (!loginResponse.ok) {
            throw new Error(`Login failed! Status: ${loginResponse.status}. Did you enter the correct password?`);
        }

        const authData = await loginResponse.json();
        const token = authData.token;
        console.log("✅ Successfully logged in! Received JWT Token.\n");

        // Loop through and add each product
        let successCount = 0;

        for (let i = 0; i < dummyProducts.length; i++) {
            const product = dummyProducts[i];
            console.log(`⏳ Pushing Product ${i + 1}/${dummyProducts.length}: ${product.name}...`);

            const productResponse = await fetch(`${API_BASE_URL}/products/add`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(product)
            });

            if (productResponse.ok) {
                console.log(`   ✔️ Success!`);
                successCount++;
            } else {
                console.error(`   ❌ Failed to add product. Status: ${productResponse.status}`);
            }
        }

        console.log(`\n🎉 Seeding Complete! ${successCount}/${dummyProducts.length} products successfully added to the database.`);
        console.log("⚠️ Remember: Because these are 'Eco-Friendly' products, they are currently PENDING. Log into your Admin account to approve them!");

    } catch (error) {
        console.error("\n💥 SEEDER SCRIPT CRASHED:", error.message);
    }
}

seedDatabase();