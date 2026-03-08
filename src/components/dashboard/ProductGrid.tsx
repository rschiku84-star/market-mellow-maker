import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MoreVertical, Package, Trash2, Eye, Archive, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Product } from "@/hooks/useProducts";

const statusColors: Record<Product["status"], string> = {
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  draft: "bg-amber-500/10 text-amber-600 border-amber-200",
  archived: "bg-muted text-muted-foreground border-border",
};

interface ProductGridProps {
  products: Product[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Product["status"]) => void;
}

const ProductGrid = ({ products, onDelete, onStatusChange }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-display text-lg font-semibold text-foreground">
          No products yet
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Add your first product to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product, i) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: i * 0.05 }}
          className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Thumbnail */}
          <div className="aspect-square bg-muted flex items-center justify-center relative">
            {product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="w-10 h-10 text-muted-foreground/40" />
            )}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 rounded-full"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onStatusChange(product.id, "active")}>
                    <Eye className="w-4 h-4 mr-2" /> Publish
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(product.id, "archived")}>
                    <Archive className="w-4 h-4 mr-2" /> Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete(product.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display font-semibold text-sm text-foreground line-clamp-1">
                {product.name}
              </h3>
              <Badge
                variant="outline"
                className={`text-[10px] px-1.5 py-0 shrink-0 ${statusColors[product.status]}`}
              >
                {product.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between mt-3">
              <span className="font-display font-bold text-foreground">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {product.category}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;
