"use client";

import { useCartStore } from "@/store/cartStore";
import { SectionFade } from "@/components/ui/SectionFade";
import { formatPrice } from "@/data/products";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Cart() {
  const router = useRouter();
  const { items, removeItem, totalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <SectionFade>
        <div className="container section min-h-[60vh] flex flex-col items-center justify-center text-center">
          <h2 className="mb-md">Корзина <i className="accent-italic">пуста</i></h2>
          <p className="mb-lg">Выберите букет в каталоге, чтобы порадовать близких.</p>
          <Link href="/catalog" className="no-underline">
            <Button variant="primary">Перейти в каталог</Button>
          </Link>
        </div>
      </SectionFade>
    );
  }

  const handleCheckout = () => {
    clearCart();
    router.push("/checkout");
  };

  return (
    <SectionFade>
      <div className="container section-sm">
        <h2 className="mb-lg">
          Оформление <i className="accent-italic">заказа</i>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-xl">
          <div className="flex flex-col gap-lg">
            <div>
              <h3 className="mb-md">Ваш заказ</h3>
              {items.map((item, idx) => (
                <div
                  key={`${item.productId}-${item.size}-${idx}`}
                  className="flex gap-md py-md border-b border-border"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-[80px] h-[100px] rounded-sm object-cover bg-surface"
                  />
                  <div className="flex flex-col justify-between flex-1">
                    <div className="flex justify-between items-start gap-4">
                      <div className="font-medium">
                        {item.name} (Размер {item.size})
                        {item.addons.map((a) => (
                          <div key={a.name} className="text-sm font-normal text-text-muted mt-1">
                            + {a.name}
                          </div>
                        ))}
                      </div>
                      <div className="font-serif whitespace-nowrap">
                        {formatPrice(
                          (item.price +
                            item.addons.reduce((acc, a) => acc + a.price, 0)) *
                            item.quantity
                        )}
                      </div>
                    </div>
                    <button
                      className="text-sm text-text-muted text-left bg-transparent border-none cursor-pointer hover:text-accent p-0 w-fit"
                      onClick={() => removeItem(item.productId, item.size)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="mb-md">Данные получателя</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-md">
                <input type="text" placeholder="Имя получателя" />
                <input type="tel" placeholder="Телефон" />
              </div>
              <input
                type="text"
                placeholder="Адрес доставки (Улица, дом, квартира)"
                className="mb-md"
              />
              <textarea rows={2} placeholder="Комментарий курьеру" />
            </div>
          </div>

          <div>
            <div className="bg-surface p-lg rounded-card lg:sticky top-[100px]">
              <h3 className="mb-md">Итого</h3>
              <div className="flex justify-between mb-sm text-sm">
                <span>Товары ({items.length})</span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
              <div className="flex justify-between mb-md text-sm">
                <span>Доставка</span>
                <span>Бесплатно</span>
              </div>
              <div className="flex justify-between mb-lg text-[1.5rem] border-t border-border pt-md">
                <span className="font-serif">К оплате</span>
                <span className="font-serif">{formatPrice(totalPrice())}</span>
              </div>
              <Button fullWidth onClick={handleCheckout}>
                Оплатить заказ
              </Button>
              <p className="text-xs text-center mt-md text-text-muted normal-case">
                Нажимая кнопку, вы соглашаетесь с условиями обработки данных.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionFade>
  );
}
