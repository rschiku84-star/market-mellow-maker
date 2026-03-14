import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Package, Phone, X, Upload, Loader2 } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useProductsContext } from "@/contexts/ProductsContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const ShopCatalogPage = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProductsContext();
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    offerAmount: "",
    description: "",
    whatsappNumber: "",
    images: [] as string[],
  });

  const resetForm = () => {
    setForm({ name: "", price: "", offerAmount: "", description: "", whatsappNumber: "", images: [] });
    setEditingId(null);
  };

  const openNew = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (p: typeof products[0]) => {
    setForm({
      name: p.name,
      price: p.price.toString(),
      offerAmount: p.offerAmount?.toString() ?? "",
      description: p.description,
      whatsappNumber: (p as any).whatsappNumber ?? "",
      images: p.images,
    });
    setEditingId(p.id);
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;
    setUploading(true);
    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from("product-images").getPublicUrl(path);
        newUrls.push(data.publicUrl);
      }
    }
    setForm((f) => ({ ...f, images: [...f.images, ...newUrls] }));
    setUploading(false);
  };

  const removeImage = (idx: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ title: "Product name is required", variant: "destructive" });
      return;
    }
    if (!form.price || isNaN(Number(form.price))) {
      toast({ title: "Valid price is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload: any = {
      name: form.name.trim(),
      price: Number(form.price),
      offerAmount: form.offerAmount ? Number(form.offerAmount) : null,
      description: form.description.trim(),
      category: "Shop",
      status: "active" as const,
      images: form.images,
    };

    if (editingId) {
      // Also update whatsapp via raw supabase call
      await supabase.from("products").update({ whatsapp_number: form.whatsappNumber.trim() }).eq("id", editingId);
      await updateProduct(editingId, payload);
      toast({ title: "Product updated!" });
    } else {
      const result = await addProduct(payload);
      if (result) {
        await supabase.from("products").update({ whatsapp_number: form.whatsappNumber.trim() }).eq("id", (result as any).id);
      }
      toast({ title: "Product added!" });
    }
    setSaving(false);
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    toast({ title: "Product deleted" });
  };

  return (
    <>
      <DashboardHeader title="Shop Catalog" subtitle="Manage your shop products" />
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex justify-end">
          <Button onClick={openNew} className="gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-lg font-semibold text-foreground">No products yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Add your first product to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-muted flex items-center justify-center">
                  {product.images.length > 0 ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-10 h-10 text-muted-foreground/40" />
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-display font-semibold text-sm text-foreground line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-foreground">₹{product.price}</span>
                      {product.offerAmount && (
                        <Badge variant="secondary" className="text-[10px]">Offer: ₹{product.offerAmount}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => openEdit(product)}>
                      <Pencil className="w-3 h-3" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive gap-1" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Product" : "Add Product"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Product Name *</label>
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Wireless Earbuds" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground">Price (₹) *</label>
                  <Input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="499" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Offer Price (₹)</label>
                  <Input type="number" value={form.offerAmount} onChange={(e) => setForm((f) => ({ ...f, offerAmount: e.target.value }))} placeholder="399" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Product description..." rows={3} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> WhatsApp Number
                </label>
                <Input value={form.whatsappNumber} onChange={(e) => setForm((f) => ({ ...f, whatsappNumber: e.target.value }))} placeholder="+91 9876543210" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Product Images</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.images.map((url, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => removeImage(idx)} className="absolute top-0.5 right-0.5 bg-background/80 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                    {uploading ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : <Upload className="w-5 h-5 text-muted-foreground" />}
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default ShopCatalogPage;
