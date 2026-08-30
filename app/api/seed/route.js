import connectDB from "@/lib/db";
import Product from "@/models/product";
import { GoogleGenAI } from "@google/genai";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
let seedPromise = null;

async function vectorizeProducts(products) {
    const batchSize = 20;
    const embeddings = [];

    for (let start = 0; start < products.length; start += batchSize) {
        const batch = products.slice(start, start + batchSize);
        const response = await ai.models.embedContent({
            model: "gemini-embedding-001",
            contents: batch.map(
                (product) => `${product.title} ${product.description} ${product.category}`
            ),
        });
        const batchEmbeddings = response.embeddings;

        if (!Array.isArray(batchEmbeddings) || batchEmbeddings.length !== batch.length) {
            throw new Error(
                `Gemini returned ${batchEmbeddings?.length ?? 0} embeddings for batch of ${batch.length} products`
            );
        }

        batchEmbeddings.forEach((embedding, index) => {
            const values = embedding?.values;

            if (!Array.isArray(values) || values.length === 0) {
                throw new Error(`Gemini returned an empty embedding for product ${start + index + 1}`);
            }

            embeddings.push(values);
        });
    }

    return embeddings;
}

async function seedProducts() {
    await connectDB();
    const products = [
        {
            title: "Blue T-shirt",
            description: "Comfortable cotton blue T-shirt for everyday wear.",
            price: 1000,
            category: "Clothing",
            image: "https://picsum.photos/500/300?random=1",
        },
        {
            title: "Nike Running Shoes",
            description: "Lightweight running shoes with breathable mesh.",
            price: 5200,
            category: "Footwear",
            image: "https://picsum.photos/500/300?random=2",
        },
        {
            title: "Adidas Jacket",
            description: "Warm and stylish zip-up jacket for winter.",
            price: 3500,
            category: "Clothing",
            image: "https://picsum.photos/500/300?random=3",
        },
        {
            title: "Wireless Headphones",
            description: "Noise-cancelling Bluetooth headphones with deep bass.",
            price: 7500,
            category: "Electronics",
            image: "https://picsum.photos/500/300?random=4",
        },
        {
            title: "Smart Watch",
            description: "Fitness smartwatch with heart-rate monitoring.",
            price: 8900,
            category: "Electronics",
            image: "https://picsum.photos/500/300?random=5",
        },
        {
            title: "Leather Wallet",
            description: "Premium leather wallet with multiple card slots.",
            price: 1800,
            category: "Accessories",
            image: "https://picsum.photos/500/300?random=6",
        },
        {
            title: "Gaming Mouse",
            description: "RGB gaming mouse with adjustable DPI.",
            price: 2500,
            category: "Electronics",
            image: "https://picsum.photos/500/300?random=7",
        },
        {
            title: "Office Backpack",
            description: "Water-resistant backpack with laptop compartment.",
            price: 3200,
            category: "Bags",
            image: "https://picsum.photos/500/300?random=8",
        },
        {
            title: "Bluetooth Speaker",
            description: "Portable Bluetooth speaker with powerful sound.",
            price: 4100,
            category: "Electronics",
            image: "https://picsum.photos/500/300?random=9",
        },
        {
            title: "Denim Jeans",
            description: "Slim-fit stretch denim jeans.",
            price: 2700,
            category: "Clothing",
            image: "https://picsum.photos/500/300?random=10",
        },
        {
            title: "Polarized Sunglasses",
            description: "Stylish UV-protected sunglasses.",
            price: 1500,
            category: "Accessories",
            image: "https://picsum.photos/500/300?random=11",
        },
        {
            title: "Coffee Mug",
            description: "Ceramic mug with ergonomic handle.",
            price: 600,
            category: "Home",
            image: "https://picsum.photos/500/300?random=12",
        },
        {
            title: "Mechanical Keyboard",
            description: "RGB mechanical keyboard with blue switches.",
            price: 6200,
            category: "Electronics",
            image: "https://picsum.photos/500/300?random=13",
        },
        {
            title: "White Sneakers",
            description: "Classic white sneakers for casual wear.",
            price: 4800,
            category: "Footwear",
            image: "https://picsum.photos/500/300?random=14",
        },
        {
            title: "Travel Water Bottle",
            description: "Insulated stainless steel water bottle.",
            price: 1300,
            category: "Home",
            image: "https://picsum.photos/500/300?random=15",
        },
        {
            title: "Wireless Charger",
            description: "Fast wireless charging pad.",
            price: 2200,
            category: "Electronics",
            image: "https://picsum.photos/500/300?random=16",
        },
        {
            title: "Yoga Mat",
            description: "Non-slip yoga mat for workouts.",
            price: 1900,
            category: "Fitness",
            image: "https://picsum.photos/500/300?random=17",
        },
        {
            title: "Basketball",
            description: "Professional indoor/outdoor basketball.",
            price: 2100,
            category: "Sports",
            image: "https://picsum.photos/500/300?random=18",
        },
        {
            title: "Cricket Bat",
            description: "English willow cricket bat.",
            price: 6400,
            category: "Sports",
            image: "https://picsum.photos/500/300?random=19",
        },
        {
            title: "Football",
            description: "FIFA-size training football.",
            price: 1800,
            category: "Sports",
            image: "https://picsum.photos/500/300?random=20",
        },
        {
            title: "LED Desk Lamp",
            description: "Adjustable LED desk lamp with touch controls.",
            price: 2400,
            category: "Home",
            image: "https://picsum.photos/500/300?random=21",
        },
        {
            title: "Laptop Stand",
            description: "Aluminum ergonomic laptop stand.",
            price: 2800,
            category: "Office",
            image: "https://picsum.photos/500/300?random=22",
        },
        {
            title: "USB-C Hub",
            description: "7-in-1 USB-C hub with HDMI support.",
            price: 3900,
            category: "Electronics",
            image: "https://picsum.photos/500/300?random=23",
        },
        {
            title: "External SSD 512GB",
            description: "High-speed portable SSD storage.",
            price: 9500,
            category: "Electronics",
            image: "https://picsum.photos/500/300?random=24",
        },
        {
            title: "Monitor Arm",
            description: "Adjustable monitor arm for desks.",
            price: 4700,
            category: "Office",
            image: "https://picsum.photos/500/300?random=25",
        },
        {
            title: "Bean Bag",
            description: "Comfortable bean bag chair for relaxing.",
            price: 5600,
            category: "Furniture",
            image: "https://picsum.photos/500/300?random=26",
        },
        {
            title: "Air Fryer",
            description: "Healthy cooking air fryer with digital controls.",
            price: 12900,
            category: "Kitchen",
            image: "https://picsum.photos/500/300?random=27",
        },
        {
            title: "Electric Kettle",
            description: "1.7L stainless steel electric kettle.",
            price: 3300,
            category: "Kitchen",
            image: "https://picsum.photos/500/300?random=28",
        },
        {
            title: "Blender",
            description: "High-power kitchen blender for smoothies.",
            price: 5400,
            category: "Kitchen",
            image: "https://picsum.photos/500/300?random=29",
        },
        {
            title: "Cookware Set",
            description: "Non-stick 7-piece cookware set.",
            price: 7800,
            category: "Kitchen",
            image: "https://picsum.photos/500/300?random=30",
        },
        {
            title: "Perfume",
            description: "Long-lasting premium fragrance for everyday use.",
            price: 4600,
            category: "Beauty",
            image: "https://picsum.photos/500/300?random=31",
        },
        {
            title: "Face Wash",
            description: "Gentle daily face cleanser for fresh skin.",
            price: 850,
            category: "Beauty",
            image: "https://picsum.photos/500/300?random=32",
        },
        {
            title: "Hair Dryer",
            description: "Fast-drying hair dryer with multiple settings.",
            price: 3600,
            category: "Beauty",
            image: "https://picsum.photos/500/300?random=33",
        },
        {
            title: "Electric Toothbrush",
            description: "Rechargeable electric toothbrush with multiple modes.",
            price: 4400,
            category: "Health",
            image: "https://picsum.photos/500/300?random=34",
        },
        {
            title: "Camping Tent",
            description: "4-person waterproof camping tent.",
            price: 11500,
            category: "Outdoor",
            image: "https://picsum.photos/500/300?random=35",
        },
        {
            title: "Sleeping Bag",
            description: "Warm sleeping bag for camping and hiking.",
            price: 3900,
            category: "Outdoor",
            image: "https://picsum.photos/500/300?random=36",
        },
        {
            title: "Mountain Bike Helmet",
            description: "Lightweight protective cycling helmet.",
            price: 3100,
            category: "Sports",
            image: "https://picsum.photos/500/300?random=37",
        },
        {
            title: "Power Bank 20000mAh",
            description: "Fast-charging portable power bank.",
            price: 4900,
            category: "Electronics",
            image: "https://picsum.photos/500/300?random=38",
        },
        {
            title: "Graphic Tablet",
            description: "Digital drawing tablet for designers and artists.",
            price: 9800,
            category: "Electronics",
            image: "https://picsum.photos/500/300?random=39",
        },
        {
            title: "Noise Cancelling Earbuds",
            description: "True wireless earbuds with active noise cancellation.",
            price: 6700,
            category: "Electronics",
            image: "https://picsum.photos/500/300?random=40",
        },

        // 41–80

        {
            title: "Gaming Laptop",
            description: "High-performance laptop designed for gaming and development.",
            price: 185000,
            category: "Electronics",
            image: "https://picsum.photos/500/300?random=41",
        },
        {
            title: "Smartphone",
            description: "Modern smartphone with a bright display and powerful processor.",
            price: 65000,
            category: "Electronics",
            image: "https://picsum.photos/500/300?random=42",
        },
        {
            title: "Tablet Pro",
            description: "Slim touchscreen tablet suitable for study and entertainment.",
            price: 58000,
            category: "Electronics",
            image: "https://picsum.photos/500/300?random=43",
        },
        {
            title: "Webcam HD",
            description: "Full HD webcam for video calls, streaming, and online classes.",
            price: 4500,
            category: "Electronics",
            image: "https://picsum.photos/500/300?random=44",
        },
        {
            title: "Gaming Controller",
            description: "Wireless controller with ergonomic grips and vibration feedback.",
            price: 5600,
            category: "Gaming",
            image: "https://picsum.photos/500/300?random=45",
        },
        {
            title: "RGB Gaming Headset",
            description: "Immersive gaming headset with microphone and RGB lighting.",
            price: 7200,
            category: "Gaming",
            image: "https://picsum.photos/500/300?random=46",
        },
        {
            title: "Gaming Keyboard",
            description: "Fast mechanical gaming keyboard with customizable RGB lighting.",
            price: 6800,
            category: "Gaming",
            image: "https://picsum.photos/500/300?random=47",
        },
        {
            title: "Large Mouse Pad",
            description: "Extended waterproof mouse pad for gaming and office desks.",
            price: 1800,
            category: "Gaming",
            image: "https://picsum.photos/500/300?random=48",
        },
        {
            title: "Running Shorts",
            description: "Lightweight breathable shorts designed for running and workouts.",
            price: 1700,
            category: "Clothing",
            image: "https://picsum.photos/500/300?random=49",
        },
        {
            title: "Hoodie",
            description: "Soft fleece hoodie with a comfortable oversized fit.",
            price: 3200,
            category: "Clothing",
            image: "https://picsum.photos/500/300?random=50",
        },
        {
            title: "Formal Shirt",
            description: "Classic slim-fit formal shirt for office and professional wear.",
            price: 2900,
            category: "Clothing",
            image: "https://picsum.photos/500/300?random=51",
        },
        {
            title: "Canvas Shoes",
            description: "Lightweight casual canvas shoes for daily use.",
            price: 2600,
            category: "Footwear",
            image: "https://picsum.photos/500/300?random=52",
        },
        {
            title: "Leather Boots",
            description: "Durable leather boots with a rugged outdoor design.",
            price: 7200,
            category: "Footwear",
            image: "https://picsum.photos/500/300?random=53",
        },
        {
            title: "Sports Sandals",
            description: "Comfortable lightweight sandals for outdoor activities.",
            price: 2300,
            category: "Footwear",
            image: "https://picsum.photos/500/300?random=54",
        },
        {
            title: "Travel Duffel Bag",
            description: "Spacious duffel bag with multiple compartments for travel.",
            price: 4300,
            category: "Bags",
            image: "https://picsum.photos/500/300?random=55",
        },
        {
            title: "Laptop Messenger Bag",
            description: "Professional messenger bag with a padded laptop sleeve.",
            price: 3800,
            category: "Bags",
            image: "https://picsum.photos/500/300?random=56",
        },
        {
            title: "Crossbody Bag",
            description: "Compact crossbody bag for everyday essentials.",
            price: 2100,
            category: "Bags",
            image: "https://picsum.photos/500/300?random=57",
        },
        {
            title: "Digital Alarm Clock",
            description: "Compact digital clock with alarm and temperature display.",
            price: 1600,
            category: "Home",
            image: "https://picsum.photos/500/300?random=58",
        },
        {
            title: "Table Fan",
            description: "Quiet portable table fan with three speed settings.",
            price: 2800,
            category: "Home",
            image: "https://picsum.photos/500/300?random=59",
        },
        {
            title: "Bedside Lamp",
            description: "Minimalist bedside lamp with warm ambient lighting.",
            price: 2200,
            category: "Home",
            image: "https://picsum.photos/500/300?random=60",
        },
        {
            title: "Wall Clock",
            description: "Modern silent wall clock for home or office interiors.",
            price: 1900,
            category: "Home",
            image: "https://picsum.photos/500/300?random=61",
        },
        {
            title: "Office Chair",
            description: "Ergonomic office chair with adjustable height and lumbar support.",
            price: 18500,
            category: "Furniture",
            image: "https://picsum.photos/500/300?random=62",
        },
        {
            title: "Computer Desk",
            description: "Spacious minimalist desk for computers and study setups.",
            price: 12500,
            category: "Furniture",
            image: "https://picsum.photos/500/300?random=63",
        },
        {
            title: "Bookshelf",
            description: "Five-tier wooden bookshelf for books and home decoration.",
            price: 8500,
            category: "Furniture",
            image: "https://picsum.photos/500/300?random=64",
        },
        {
            title: "Desk Organizer",
            description: "Multi-compartment organizer for stationery and office supplies.",
            price: 1200,
            category: "Office",
            image: "https://picsum.photos/500/300?random=65",
        },
        {
            title: "Notebook Set",
            description: "Set of three premium ruled notebooks for study and work.",
            price: 900,
            category: "Office",
            image: "https://picsum.photos/500/300?random=66",
        },
        {
            title: "Wireless Keyboard",
            description: "Slim wireless keyboard with quiet keys and long battery life.",
            price: 3400,
            category: "Office",
            image: "https://picsum.photos/500/300?random=67",
        },
        {
            title: "Stapler Kit",
            description: "Compact office stapler with staples and remover included.",
            price: 750,
            category: "Office",
            image: "https://picsum.photos/500/300?random=68",
        },
        {
            title: "Rice Cooker",
            description: "Automatic rice cooker with keep-warm function.",
            price: 6200,
            category: "Kitchen",
            image: "https://picsum.photos/500/300?random=69",
        },
        {
            title: "Coffee Maker",
            description: "Compact coffee machine for freshly brewed coffee at home.",
            price: 8900,
            category: "Kitchen",
            image: "https://picsum.photos/500/300?random=70",
        },
        {
            title: "Toaster",
            description: "Two-slice toaster with adjustable browning levels.",
            price: 3100,
            category: "Kitchen",
            image: "https://picsum.photos/500/300?random=71",
        },
        {
            title: "Knife Set",
            description: "Stainless steel kitchen knife set with storage block.",
            price: 4500,
            category: "Kitchen",
            image: "https://picsum.photos/500/300?random=72",
        },
        {
            title: "Moisturizing Cream",
            description: "Lightweight daily moisturizer for smooth and hydrated skin.",
            price: 1450,
            category: "Beauty",
            image: "https://picsum.photos/500/300?random=73",
        },
        {
            title: "Sunscreen SPF 50",
            description: "Lightweight sunscreen with broad-spectrum SPF 50 protection.",
            price: 1800,
            category: "Beauty",
            image: "https://picsum.photos/500/300?random=74",
        },
        {
            title: "Shampoo",
            description: "Gentle everyday shampoo designed for clean and healthy hair.",
            price: 1250,
            category: "Beauty",
            image: "https://picsum.photos/500/300?random=75",
        },
        {
            title: "Resistance Bands",
            description: "Set of resistance bands for strength training and home workouts.",
            price: 2100,
            category: "Fitness",
            image: "https://picsum.photos/500/300?random=76",
        },
        {
            title: "Adjustable Dumbbells",
            description: "Space-saving adjustable dumbbells for home strength training.",
            price: 9500,
            category: "Fitness",
            image: "https://picsum.photos/500/300?random=77",
        },
        {
            title: "Tennis Racket",
            description: "Lightweight graphite racket designed for recreational tennis.",
            price: 6200,
            category: "Sports",
            image: "https://picsum.photos/500/300?random=78",
        },
        {
            title: "Hiking Backpack",
            description: "Durable outdoor backpack with hydration and gear compartments.",
            price: 6800,
            category: "Outdoor",
            image: "https://picsum.photos/500/300?random=79",
        },
        {
            title: "Portable Camping Lantern",
            description: "Rechargeable LED lantern for camping, hiking, and emergencies.",
            price: 2700,
            category: "Outdoor",
            image: "https://picsum.photos/500/300?random=80",
        },
    ];
    const embeddings = await vectorizeProducts(products);
    const productsWithVectors = products.map((product, index) => ({
        ...product,
        embedding: embeddings[index],
    }));

    await Product.deleteMany();
    await Product.insertMany(productsWithVectors);

    return Response.json({
        message: "Seeded successfully",
        insertedCount: productsWithVectors.length,
    });
}

export async function GET() {
    if (seedPromise) {
        return seedPromise;
    }

    seedPromise = seedProducts();

    try {
        return await seedPromise;
    } finally {
        seedPromise = null;
    }
}