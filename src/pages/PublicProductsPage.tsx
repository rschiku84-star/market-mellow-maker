import { useState } from "react";
import { Search, ShoppingCart, Tag, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const SAMPLE_PRODUCTS = [
  { id: "1", name: "Premium T-Shirt", price: 29.99, category: "Fashion", description: "High-quality cotton t-shirt with modern fit.", images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"] },
  { id: "2", name: "Wireless Headphones", price: 89.99, category: "Electronics", description: "Noise-cancelling Bluetooth headphones.", images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"] },
  { id: "3", name: "Smart Watch", price: 199.99, category: "Gadgets", description: "Fitness tracker with heart rate monitor and GPS.", images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"] },
  { id: "4", name: "Artisan Leather Wallet", price: 59.99, category: "Fashion", description: "Premium handcrafted leather wallet with RFID blocking.", images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=500"] },
  { id: "5", name: "Portable Speaker", price: 49.99, category: "Electronics", description: "Waterproof Bluetooth speaker with deep bass.", images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500"] },
  { id: "6", name: "Running Shoes", price: 119.99, category: "Fashion", description: "Lightweight running shoes with responsive cushioning.", images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"] },
];

const PublicProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = SAMPLE_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto mb-10 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Our Store</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">Discover amazing products from our marketplace</p>
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-shadow"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display text-2xl font-semibold text-foreground mb-2">No products found</h2>
            <p className="text-muted-foreground">Try a different search term</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-border"
              >
                <div className="w-full h-48 bg-muted overflow-hidden">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1.5 mb-2 text-xs font-medium text-primary bg-primary/10 w-fit px-2 py-1 rounded-full">
                    <Tag size={12} /> {product.category}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1 min-h-[2.5rem]">{product.description}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">${product.price.toFixed(2)}</p>
                  <button className="w-full mt-4 bg-primary text-primary-foreground py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors font-medium">
                    <ShoppingCart size={18} /> Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PublicProductsPage;
