"use client";

import { SectionFade } from "@/components/ui/SectionFade";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CheckoutSuccess() {
  return (
    <SectionFade>
      <div className="container section min-h-[70vh] flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2,
          }}
          className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mb-lg mx-auto"
        >
          <svg
            className="w-12 h-12 text-accent"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
        
        <h2 className="mb-md">
          Заказ <i className="accent-italic">оформлен</i>
        </h2>
        <p className="mb-lg max-w-[500px] mx-auto text-[1.1rem]">
          Спасибо за заказ! Мы уже начали собирать ваш букет. Наш менеджер свяжется с вами в течение 5 минут для подтверждения.
        </p>
        
        <Link href="/" className="no-underline">
          <Button variant="primary">Вернуться на главную</Button>
        </Link>
      </div>
    </SectionFade>
  );
}
