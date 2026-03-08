import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  images: string[] | null;
}

const StorefrontPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("id, name, description, price, category, images").eq("status", "active").order("created_at", { ascending: false });
      if (!error && data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const categories = ["all", ...new Set(products.map((p) => p.category))];
  const filteredProducts = selectedCategory === "all" ? products : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"><Sparkles className="w-5 h-5 text-primary-foreground" /></div>
              <span className="font-display text-xl font-bold text-foreground">Creator<span className="text-primary">Hub</span></span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/login"><Button variant="outline" size="sm">Log in</Button></Link>
              <Link to="/signup"><Button size="sm">Start Selling</Button></Link>
            </div>
          </div>
        </div>
      </nav>
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-sm mb-6"><ShoppingBag className="w-4 h-4 text-primary" /><span className="text-foreground">Discover unique products from creators</span></div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">Shop the <span className="text-primary">Storefront</span></h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Browse amazing products from independent creators and small businesses.</p>
          </motion.div>
        </div>
      </section>
      <section className="px-4 pb-8">
        <div className="max-w-7xl mx-auto"><div className="flex flex-wrap gap-2 justify-center">{categories.map((cat) => (<Button key={cat} variant={selectedCategory === cat ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(cat)} className="capitalize">{cat}</Button>))}</div></div>
      </section>
      <section className="px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20"><ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" /><h3 className="text-xl font-semibold text-foreground mb-2">No products yet</h3><p className="text-muted-foreground mb-6">Be the first to list your products on CreatorHub!</p><Link to="/signup"><Button>Start Selling<ArrowRight className="w-4 h-4 ml-2" /></Button></Link></div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      {product.images && product.images[0] ? (<img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />) : (<div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-12 h-12 text-muted-foreground" /></div>)}
                      <Badge className="absolute top-3 left-3 capitalize">{product.category}</Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground truncate mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description || "No description"}</p>
                      <div className="flex items-center justify-between"><span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span><Button size="sm" variant="outline">View Details</Button></div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
      <section className="px-4 py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center"><h2 className="text-3xl font-display font-bold text-foreground mb-4">Want to sell your products?</h2><p className="text-muted-foreground mb-8">Join CreatorHub and start selling to thousands of customers today.</p><Link to="/signup"><Button size="lg">Get Started — It's Free<ArrowRight className="w-5 h-5 ml-2" /></Button></Link></div>
      </section>
    </div>
  );
};

export default StorefrontPage;
