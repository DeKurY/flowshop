import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import PillCard from "@/components/ui/PillCard";
import ProductCard from "@/components/ui/ProductCard";
import { products } from "@/data/products";
import { SectionFade } from "@/components/ui/SectionFade";

export default function Home() {
  const popularProducts = products.filter((p) => p.popularity >= 8).slice(0, 3);

  return (
    <>
      <SectionFade delay={0.1}>
        <div className="container">
          <div className="min-h-[85vh] flex items-center relative bg-surface rounded-b-[40px] overflow-hidden mb-xl">
            <img
              src="https://images.unsplash.com/photo-1563241598-a2b16008abdc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
              alt="Hero Bouquet"
              className="absolute top-0 left-0 w-full h-full object-cover opacity-80 z-0"
            />
            <div className="relative z-10 max-w-[600px] pl-[4vw]">
              <h1>
                Цветы для ваших <i className="accent-italic">эмоций</i>.
              </h1>
              <p className="text-[1.25rem] text-[#333] mb-lg max-w-[80%]">
                Свежие авторские букеты с доставкой в день заказа. Создаем
                настроение в каждом лепестке.
              </p>
              <div className="flex gap-md">
                <Link href="/catalog" className="no-underline">
                  <Button variant="primary">Каталог букетов</Button>
                </Link>
                <Link href="/catalog" className="no-underline">
                  <Button variant="outline">Собрать букет</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </SectionFade>

      <SectionFade delay={0.2}>
        <div className="container section">
          <div className="flex overflow-x-auto gap-md pb-md scrollbar-hide">
            <PillCard className="text-xs-caps">День рождения</PillCard>
            <PillCard className="text-xs-caps">Признание в любви</PillCard>
            <PillCard className="text-xs-caps">Юбилей</PillCard>
            <PillCard className="text-xs-caps">Извинение</PillCard>
            <PillCard className="text-xs-caps">Свадьба</PillCard>
            <PillCard className="text-xs-caps">Для мамы</PillCard>
            <PillCard className="text-xs-caps">Просто так</PillCard>
          </div>
        </div>
      </SectionFade>

      <SectionFade delay={0.3}>
        <div className="container section-sm">
          <h2 className="text-center">
            Популярные <i className="accent-italic">букеты</i>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </SectionFade>

      <SectionFade delay={0.4}>
        <div className="container section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div className="flex flex-col justify-between">
              <div>
                <h2>
                  Выбор по <i className="accent-italic">бюджету</i>
                </h2>
                <p className="mb-lg">Найдите идеальный вариант под ваш запрос.</p>
              </div>
              <div className="grid grid-cols-2 gap-sm">
                <PillCard className="text-center">До 3000 ₽</PillCard>
                <PillCard className="text-center">3000–5000 ₽</PillCard>
                <PillCard className="text-center">5000–8000 ₽</PillCard>
                <PillCard className="text-center bg-text-main text-white hover:bg-text-main border-none">
                  Премиум
                </PillCard>
              </div>
            </div>
            <div className="bg-surface p-xl rounded-card">
              <h3 className="mb-md">
                Соберите свой <i className="accent-italic">букет</i>
              </h3>
              <div className="flex flex-col gap-md">
                <select>
                  <option>Цветовая гамма</option>
                  <option>Белые</option>
                  <option>Розовые</option>
                </select>
                <select>
                  <option>Размер букета</option>
                  <option>Средний (M)</option>
                  <option>Большой (L)</option>
                </select>
                <select>
                  <option>Бюджет</option>
                  <option>Любой</option>
                </select>
                <Button fullWidth variant="primary">
                  Подобрать варианты
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SectionFade>

      <SectionFade delay={0.5}>
        <div className="container section-sm border-t border-border">
          <div className="grid grid-cols-2 lg:grid-cols-4 text-center gap-md">
            <div>
              <h3 className="font-serif mb-sm">2 ч.</h3>
              <p className="text-sm">Доставка за 2 часа</p>
            </div>
            <div>
              <h3 className="font-serif mb-sm">100%</h3>
              <p className="text-sm">Свежие цветы каждый день</p>
            </div>
            <div>
              <h3 className="font-serif mb-sm">Фото</h3>
              <p className="text-sm">Фото букета перед отправкой</p>
            </div>
            <div>
              <h3 className="font-serif mb-sm">0 ₽</h3>
              <p className="text-sm">Бесплатная открытка</p>
            </div>
          </div>
        </div>
      </SectionFade>
    </>
  );
}
