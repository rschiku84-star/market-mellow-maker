import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Product } from "@/hooks/useProducts";

const CATEGORIES = [
  "Home & Living",
  "Digital Art",
  "Services",
  "Fashion",
  "Jewelry",
  "Food & Drink",
  "Crafts",
  "Other",
];

interface ProductUploadFormProps {
  initialData?: Product;
  onSubmit: (product: Omit<Product, "id" | "createdAt">) => void;
  submitLabel?: string;
}

const ProductUploadForm = ({ initialData, onSubmit, submitLabel = "Save Product" }: ProductUploadFormProps) => {
  const { user } = useAuth();
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [price, setPrice] = useState(initialData?.price?.toString() ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [status, setStatus] = useState<Product["status"]>(initialData?.status ?? "draft");
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.images ?? []);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uploadFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || !user) return;
      const remaining = 4 - imageUrls.length;
      const toUpload = Array.from(files)
        .filter((f) => f.type.startsWith("image/"))
        .slice(0, remaining);

      if (toUpload.length === 0) return;
      setUploading(true);

      const uploaded: string[] = [];
      for (const file of toUpload) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

        const { error } = await supabase.storage
          .from("product-images")
          .upload(path, file, { upsert: false });

        if (error) {
          toast({
            title: "Upload failed",
            description: error.message,
            variant: "destructive",
          });
          continue;
        }

        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(path);

        uploaded.push(urlData.publicUrl);
      }

      setImageUrls((prev) => [...prev, ...uploaded].slice(0, 4));
      setUploading(false);
    },
    [user, imageUrls.length]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      uploadFiles(e.dataTransfer.files);
    },
    [uploadFiles]
  );

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || !category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category,
      status,
      images: imageUrls,
    });
    toast({ title: "Product added!", description: `"${name}" has been saved.` });
    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setStatus("draft");
    setImageUrls([]);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Image Upload */}
      <div>
        <Label className="text-foreground font-semibold mb-2 block">
          Product Images
        </Label>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => uploadFiles(e.target.files)}
          />
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-primary mx-auto mb-3 animate-spin" />
              <p className="text-sm font-medium text-foreground">Uploading…</p>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">
                Drag & drop images here
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                or click to browse • PNG, JPG up to 5MB • Max 4 images
              </p>
            </>
          )}
        </div>

        {imageUrls.length > 0 && (
          <div className="flex gap-3 mt-4 flex-wrap">
            {imageUrls.map((src, i) => (
              <div
                key={i}
                className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group"
              >
                <img
                  src={src}
                  alt={`Preview ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {imageUrls.length < 4 && !uploading && (
              <button
                type="button"
                onClick={() => document.getElementById("file-input")?.click()}
                className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <Label htmlFor="name" className="text-foreground font-semibold">
            Product Name *
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Handcrafted Ceramic Mug"
            className="mt-1.5"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="description" className="text-foreground font-semibold">
            Description
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your product..."
            className="mt-1.5 min-h-[100px]"
          />
        </div>
        <div>
          <Label htmlFor="price" className="text-foreground font-semibold">
            Price (USD) *
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className="mt-1.5"
          />
        </div>
        <div>
          <Label className="text-foreground font-semibold">Category *</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-foreground font-semibold">Status</Label>
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as Product["status"])}
          >
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="px-8" disabled={uploading}>
          Save Product
        </Button>
        <Button type="button" variant="outline">
          Save as Draft
        </Button>
      </div>
    </motion.form>
  );
};

export default ProductUploadForm;
