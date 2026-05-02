"use client";

import { useMemo, useState } from "react";
import { products, Product } from "@/data/products";
import ProductCard from "@/components/ui/ProductCard";
import FilterLabel from "@/components/ui/FilterLabel";
import { SectionFade } from "@/components/ui/SectionFade";

type SortType = "popular" | "new" | "price";

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState<SortType>("popular");
  const [priceRange, setPriceRange] = useState(15000);
  
  // Filters
  const [sizes, setSizes] = useState({ S: false, M: false, L: false, XL: false });
  const [flowerTypes, setFlowerTypes] = useState({
    "Розы": false,
    "Пионы": false,
    "Тюльпаны": false,
    "Гортензии": false,
  });
  const [todayDelivery, setTodayDelivery] = useState(false);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => p.price <= priceRange);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameAccent.toLowerCase().includes(q)
      );
    }

    // Size filter: If any size is selected, filter by it
    const activeSizes = Object.entries(sizes)
      .filter(([_, active]) => active)
      .map(([k]) => k);
    if (activeSizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((s) => activeSizes.includes(s.label))
      );
    }

    // Flower type filter
    const activeFlowers = Object.entries(flowerTypes)
      .filter(([_, active]) => active)
      .map(([k]) => k);
    if (activeFlowers.length > 0) {
      result = result.filter((p) =>
        p.flowerTypes.some((f) => activeFlowers.includes(f))
      );
    }

    // Sorting
    if (sortType === "popular") {
      result.sort((a, b) => b.popularity - a.popularity);
    } else if (sortType === "new") {
      result.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
    } else if (sortType === "price") {
      result.sort((a, b) => a.price - b.price);
    }

    return result;
  }, [searchQuery, sortType, priceRange, sizes, flowerTypes]);

  const toggleSize = (size: keyof typeof sizes) => {
    setSizes((prev) => ({ ...prev, [size]: !prev[size] }));
  };

  const toggleFlower = (flower: keyof typeof flowerTypes) => {
    setFlowerTypes((prev) => ({ ...prev, [flower]: !prev[flower] }));
  };

  return (
    <SectionFade>
      <div className="container section-sm min-h-[70vh]">
        <div className="flex flex-col md:flex-row justify-between items-center mb-lg pb-md border-b border-border gap-md">
          <input
            type="text"
            className="rounded-pill w-full md:max-w-[300px] border border-border"
            placeholder="Поиск букетов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="flex gap-md overflow-x-auto w-full md:w-auto">
            <button
              className={`text-[0.9rem] bg-transparent border-none cursor-pointer pb-2 font-sans ${
                sortType === "popular"
                  ? "text-text-main border-b border-text-main"
                  : "text-text-muted"
              }`}
              onClick={() => setSortType("popular")}
            >
              Популярные
            </button>
            <button
              className={`text-[0.9rem] bg-transparent border-none cursor-pointer pb-2 font-sans ${
                sortType === "new"
                  ? "text-text-main border-b border-text-main"
                  : "text-text-muted"
              }`}
              onClick={() => setSortType("new")}
            >
              Новые
            </button>
            <button
              className={`text-[0.9rem] bg-transparent border-none cursor-pointer pb-2 font-sans ${
                sortType === "price"
                  ? "text-text-main border-b border-text-main"
                  : "text-text-muted"
              }`}
              onClick={() => setSortType("price")}
            >
              По цене
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-xl">
          <aside>
            <h4 className="font-sans text-[0.875rem] uppercase tracking-[0.05em] mb-md font-medium">
              Цена до: {priceRange} ₽
            </h4>
            <input
              type="range"
              min="1000"
              max="15000"
              step="500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full mb-lg accent-accent"
            />

            <h4 className="font-sans text-[0.875rem] uppercase tracking-[0.05em] mb-md mt-lg font-medium">
              Размер
            </h4>
            <ul className="list-none space-y-sm">
              <li>
                <FilterLabel checked={sizes.S} onChange={() => toggleSize("S")}>
                  Маленький (S)
                </FilterLabel>
              </li>
              <li>
                <FilterLabel checked={sizes.M} onChange={() => toggleSize("M")}>
                  Средний (M)
                </FilterLabel>
              </li>
              <li>
                <FilterLabel checked={sizes.L} onChange={() => toggleSize("L")}>
                  Большой (L)
                </FilterLabel>
              </li>
              <li>
                <FilterLabel
                  checked={sizes.XL}
                  onChange={() => toggleSize("XL")}
                >
                  Гигант (XL)
                </FilterLabel>
              </li>
            </ul>

            <h4 className="font-sans text-[0.875rem] uppercase tracking-[0.05em] mb-md mt-lg font-medium">
              Тип цветов
            </h4>
            <ul className="list-none space-y-sm">
              <li>
                <FilterLabel
                  checked={flowerTypes["Розы"]}
                  onChange={() => toggleFlower("Розы")}
                >
                  Розы
                </FilterLabel>
              </li>
              <li>
                <FilterLabel
                  checked={flowerTypes["Пионы"]}
                  onChange={() => toggleFlower("Пионы")}
                >
                  Пионы
                </FilterLabel>
              </li>
              <li>
                <FilterLabel
                  checked={flowerTypes["Тюльпаны"]}
                  onChange={() => toggleFlower("Тюльпаны")}
                >
                  Тюльпаны
                </FilterLabel>
              </li>
              <li>
                <FilterLabel
                  checked={flowerTypes["Гортензии"]}
                  onChange={() => toggleFlower("Гортензии")}
                >
                  Гортензии
                </FilterLabel>
              </li>
            </ul>

            <div className="mt-lg">
              <FilterLabel
                checked={todayDelivery}
                onChange={setTodayDelivery}
                className="bg-surface p-3 rounded-sm leading-none"
              >
                <b className="text-text-main font-medium">Доставка сегодня</b>
              </FilterLabel>
            </div>
          </aside>

          <div>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg items-start">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-xl text-text-muted">
                По вашему запросу ничего не найдено. Попробуйте изменить фильтры.
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionFade>
  );
}
