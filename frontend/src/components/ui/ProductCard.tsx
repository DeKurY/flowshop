"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { formatPrice, Product } from "@/data/products";
import Button from "./Button";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: `${product.name} ${product.nameAccent}`,
      image: product.image,
      size: product.sizes[1].label, // Default to M
      price: product.price,
      quantity: 1,
      addons: [],
    });
  };

  return (
    <Link href={`/product/${product.id}`} className="no-underline text-text-main block h-full">
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-bg rounded-card overflow-hidden flex flex-col group transition-shadow duration-400 hover:shadow-[0_12px_32px_rgba(0,0,0,0.04)] h-full cursor-pointer"
      >
        <div className="w-full aspect-[3/4] overflow-hidden rounded-card bg-surface relative">
          <motion.img
            src={product.image}
            alt={`${product.name} ${product.nameAccent}`}
            className="w-full h-full object-cover"
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.03 }}
          />
        </div>
        <div className="py-md flex flex-col flex-1">
          <div className="text-base font-medium mb-1">
            {product.name} {product.nameAccent}
          </div>
          <div className="font-serif text-xl text-text-main mb-md">
            {formatPrice(product.price)}
          </div>
          <div className="mt-auto w-full">
            <Button
              variant="ghost"
              fullWidth
              onClick={handleAddToCart}
            >
              В корзину
            </Button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
