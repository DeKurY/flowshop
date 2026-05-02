"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { products, addons, formatPrice } from "@/data/products";
import { SectionFade } from "@/components/ui/SectionFade";
import Button from "@/components/ui/Button";
import Link from "next/link";
import FilterLabel from "@/components/ui/FilterLabel";
import { useCartStore } from "@/store/cartStore";
import { motion } from "framer-motion";

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);
  
  if (!product) {
    notFound();
  }

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[1]); // Default M
  const [selectedAddons, setSelectedAddons] = useState<typeof addons>([]);
  
  const [date, setDate] = useState("");
  const [time, setTime] = useState("9:00 - 12:00");
  const [cardText, setCardText] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  const addItem = useCartStore((s) => s.addItem);

  const currentPrice = product.price + selectedSize.priceModifier;

  const handleAddonToggle = (addon: typeof addons[0], checked: boolean) => {
    if (checked) {
      setSelectedAddons((prev) => [...prev, addon]);
    } else {
      setSelectedAddons((prev) => prev.filter((a) => a.id !== addon.id));
    }
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: `${product.name} ${product.nameAccent}`,
      image: product.image,
      size: selectedSize.label,
      price: currentPrice,
      quantity: 1,
      addons: selectedAddons,
      cardText,
      anonymous,
    });
    // Optional: add toast notification here
  };

  return (
    <SectionFade>
      <div className="container section-sm">
        <Link href="/catalog" className="no-underline">
          <Button variant="ghost" className="mb-lg">
            ← Назад в каталог
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
          {/* Gallery */}
          <div className="flex flex-col gap-md">
            <div className="w-full aspect-[3/4] rounded-card overflow-hidden bg-surface relative">
              <motion.img
                key={activeImage}
                src={product.images[activeImage]}
                alt={`${product.name} ${product.nameAccent}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }} // Zoom effect
              />
            </div>
            <div className="grid grid-cols-4 gap-md">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="Thumbnail"
                  onClick={() => setActiveImage(idx)}
                  className={`w-full aspect-square rounded-sm object-cover cursor-pointer transition-opacity duration-200 ${
                    activeImage === idx ? "opacity-100" : "opacity-60 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:sticky top-[100px] self-start">
            <h2>
              {product.name} <i className="accent-italic">{product.nameAccent}</i>
            </h2>
            <h3 className="mb-lg text-4xl">{formatPrice(currentPrice)}</h3>

            <p className="mb-md leading-[1.6]">{product.description}</p>

            {/* Size Selector */}
            <div className="mb-lg">
              <div className="text-xs-caps text-text-muted mb-sm">Размер</div>
              <div className="flex gap-sm my-md">
                {product.sizes.map((size) => (
                  <button
                    key={size.label}
                    onClick={() => setSelectedSize(size)}
                    className={`flex-1 py-3 px-1 border rounded-sm text-center cursor-pointer transition-all duration-200 font-sans text-[0.9rem] ${
                      selectedSize.label === size.label
                        ? "border-accent bg-surface"
                        : "border-border bg-bg hover:border-text-muted"
                    }`}
                  >
                    {size.label} ({size.dimensions})
                  </button>
                ))}
              </div>
            </div>

            {/* Addons */}
            <div className="mb-lg border-y border-border py-md">
              <div className="text-xs-caps text-text-muted mb-sm">Дополнения</div>
              {addons.map((addon) => (
                <div
                  key={addon.id}
                  className="flex justify-between items-center py-3 border-b border-border last:border-0"
                >
                  <FilterLabel
                    checked={selectedAddons.some((a) => a.id === addon.id)}
                    onChange={(checked) => handleAddonToggle(addon, checked)}
                  >
                    {addon.name}
                  </FilterLabel>
                  <span className="text-sm">
                    {addon.price === 0 ? "0 ₽" : `+ ${addon.price} ₽`}
                  </span>
                </div>
              ))}
            </div>

            {/* Delivery Date/Time */}
            <div className="grid grid-cols-2 gap-md mb-md">
              <div>
                <div className="text-xs-caps text-text-muted mb-sm">Дата доставки</div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <div className="text-xs-caps text-text-muted mb-sm">Время</div>
                <select value={time} onChange={(e) => setTime(e.target.value)}>
                  <option>9:00 - 12:00</option>
                  <option>12:00 - 15:00</option>
                  <option>15:00 - 18:00</option>
                  <option>18:00 - 21:00</option>
                </select>
              </div>
            </div>

            {/* Card Text & Options */}
            <div className="mb-lg">
              <div className="text-xs-caps text-text-muted mb-sm">
                Текст для открытки
              </div>
              <textarea
                rows={3}
                placeholder="Напишите теплые слова..."
                value={cardText}
                onChange={(e) => setCardText(e.target.value)}
              />
              <FilterLabel
                className="mt-sm"
                checked={anonymous}
                onChange={setAnonymous}
              >
                Анонимная доставка
              </FilterLabel>
            </div>

            <Button
              variant="primary"
              fullWidth
              className="py-5 text-sm"
              onClick={handleAddToCart}
            >
              Добавить в корзину
            </Button>
          </div>
        </div>
      </div>
    </SectionFade>
  );
}
