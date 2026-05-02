"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/catalog", label: "Каталог" },
  { href: "/about", label: "О студии" },
  { href: "/delivery", label: "Доставка" },
  { href: "/contacts", label: "Контакты" },
];

export default function Header() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.itemCount);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 w-full bg-white/95 backdrop-blur-md border-b border-border z-50 py-md"
    >
      <div className="container flex justify-between items-center">
        <Link href="/" className="font-serif text-2xl font-medium no-underline text-text-main">
          Pro <i className="accent-italic">Buton</i>
        </Link>

        <nav className="flex items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`bg-transparent border-none font-sans text-sm mx-md cursor-pointer transition-colors duration-200 no-underline ${
                pathname === link.href
                  ? "text-accent"
                  : "text-text-main hover:text-accent"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex gap-sm">
          <Link href="/cart">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-pill font-sans text-xs uppercase tracking-[0.05em] font-semibold cursor-pointer transition-all duration-300 bg-surface text-text-main hover:bg-surface-hover border-none"
            >
              Корзина{mounted ? ` (${itemCount()})` : " (0)"}
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
