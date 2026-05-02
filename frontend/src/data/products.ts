export interface Product {
  id: string;
  name: string;
  nameAccent: string;
  price: number;
  image: string;
  images: string[];
  description: string;
  sizes: { label: string; dimensions: string; priceModifier: number }[];
  category: string;
  flowerTypes: string[];
  occasion: string[];
  isNew?: boolean;
  popularity: number;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
}

export const addons: Addon[] = [
  { id: "card", name: "Бесплатная открытка", price: 0 },
  { id: "chocolate", name: "Шоколад ручной работы", price: 800 },
  { id: "balloon", name: "Воздушный шар", price: 500 },
  { id: "teddy", name: "Мягкая игрушка", price: 1200 },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Нежная",
    nameAccent: "пастель",
    price: 4500,
    image:
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55ef6?ixlib=rb-4.0.3&w=200&q=80",
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?ixlib=rb-4.0.3&w=200&q=80",
    ],
    description:
      "Авторский букет в пастельных тонах. Идеально подходит для романтического свидания или в качестве знака внимания. В составе: французские розы, эустома, эвкалипт, дизайнерская упаковка.",
    sizes: [
      { label: "S", dimensions: "30 см", priceModifier: -500 },
      { label: "M", dimensions: "40 см", priceModifier: 0 },
      { label: "L", dimensions: "50 см", priceModifier: 1000 },
    ],
    category: "Сборные букеты",
    flowerTypes: ["Розы", "Эустома"],
    occasion: ["Признание в любви", "Просто так"],
    popularity: 10,
  },
  {
    id: "2",
    name: "Страсть",
    nameAccent: "рубина",
    price: 6200,
    image:
      "https://images.unsplash.com/photo-1561181286-d3fee7d55ef6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1561181286-d3fee7d55ef6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?ixlib=rb-4.0.3&w=200&q=80",
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?ixlib=rb-4.0.3&w=200&q=80",
    ],
    description:
      "Роскошный букет из красных роз премиум-класса. Классика, которая никогда не выходит из моды. Идеален для признания в любви или юбилея.",
    sizes: [
      { label: "S", dimensions: "30 см", priceModifier: -700 },
      { label: "M", dimensions: "40 см", priceModifier: 0 },
      { label: "L", dimensions: "50 см", priceModifier: 1200 },
    ],
    category: "Монобукеты",
    flowerTypes: ["Розы"],
    occasion: ["Признание в любви", "Юбилей"],
    isNew: true,
    popularity: 9,
  },
  {
    id: "3",
    name: "Весеннее",
    nameAccent: "утро",
    price: 3800,
    image:
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?ixlib=rb-4.0.3&w=200&q=80",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55ef6?ixlib=rb-4.0.3&w=200&q=80",
    ],
    description:
      "Легкий и воздушный букет из тюльпанов и нарциссов. Несет весеннее настроение, свежесть и радость. Подойдет для дня рождения, 8 Марта или просто для хорошего настроения.",
    sizes: [
      { label: "S", dimensions: "25 см", priceModifier: -400 },
      { label: "M", dimensions: "35 см", priceModifier: 0 },
      { label: "L", dimensions: "45 см", priceModifier: 800 },
    ],
    category: "Сборные букеты",
    flowerTypes: ["Тюльпаны"],
    occasion: ["День рождения", "Для мамы", "Просто так"],
    popularity: 8,
  },
  {
    id: "4",
    name: "Полевой",
    nameAccent: "шик",
    price: 5100,
    image:
      "https://images.unsplash.com/photo-1508611105073-4564c74f5195?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1508611105073-4564c74f5195?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?ixlib=rb-4.0.3&w=200&q=80",
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?ixlib=rb-4.0.3&w=200&q=80",
    ],
    description:
      "Элегантный букет, сочетающий полевые цветы с садовыми. Утонченный выбор для ценителей природной красоты.",
    sizes: [
      { label: "S", dimensions: "30 см", priceModifier: -600 },
      { label: "M", dimensions: "40 см", priceModifier: 0 },
      { label: "L", dimensions: "50 см", priceModifier: 900 },
    ],
    category: "Сборные букеты",
    flowerTypes: ["Гортензии"],
    occasion: ["Просто так", "День рождения"],
    isNew: true,
    popularity: 7,
  },
  {
    id: "5",
    name: "Белое",
    nameAccent: "облако",
    price: 7500,
    image:
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?ixlib=rb-4.0.3&w=200&q=80",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55ef6?ixlib=rb-4.0.3&w=200&q=80",
    ],
    description:
      "Роскошный белоснежный букет из гортензий и пионов. Символ чистоты и элегантности. Идеален для свадьбы или торжественного события.",
    sizes: [
      { label: "S", dimensions: "35 см", priceModifier: -800 },
      { label: "M", dimensions: "45 см", priceModifier: 0 },
      { label: "L", dimensions: "55 см", priceModifier: 1500 },
    ],
    category: "Монобукеты",
    flowerTypes: ["Гортензии", "Пионы"],
    occasion: ["Свадьба", "Юбилей"],
    popularity: 6,
  },
  {
    id: "6",
    name: "Розовый",
    nameAccent: "закат",
    price: 5800,
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?ixlib=rb-4.0.3&w=200&q=80",
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?ixlib=rb-4.0.3&w=200&q=80",
    ],
    description:
      "Нежнейший букет в оттенках розового. Пионы, розовые розы и эустома создают ощущение романтики и уюта.",
    sizes: [
      { label: "S", dimensions: "30 см", priceModifier: -500 },
      { label: "M", dimensions: "40 см", priceModifier: 0 },
      { label: "L", dimensions: "50 см", priceModifier: 1000 },
    ],
    category: "Сборные букеты",
    flowerTypes: ["Пионы", "Розы"],
    occasion: ["Признание в любви", "Для мамы"],
    popularity: 5,
  },
  {
    id: "7",
    name: "Солнечный",
    nameAccent: "бриз",
    price: 4200,
    image:
      "https://images.unsplash.com/photo-1444021465936-c6ca81d39b84?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1444021465936-c6ca81d39b84?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55ef6?ixlib=rb-4.0.3&w=200&q=80",
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?ixlib=rb-4.0.3&w=200&q=80",
    ],
    description:
      "Яркий и жизнерадостный букет с подсолнухами и полевыми цветами. Наполнит солнечным настроением любой день.",
    sizes: [
      { label: "S", dimensions: "30 см", priceModifier: -400 },
      { label: "M", dimensions: "40 см", priceModifier: 0 },
      { label: "L", dimensions: "50 см", priceModifier: 700 },
    ],
    category: "Сборные букеты",
    flowerTypes: ["Тюльпаны"],
    occasion: ["День рождения", "Просто так"],
    popularity: 4,
  },
  {
    id: "8",
    name: "Королевский",
    nameAccent: "пурпур",
    price: 9800,
    image:
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?ixlib=rb-4.0.3&w=200&q=80",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55ef6?ixlib=rb-4.0.3&w=200&q=80",
    ],
    description:
      "Премиальная композиция из редких сортов роз и орхидей. Воплощение роскоши и утонченности. Для тех, кто ценит исключительное.",
    sizes: [
      { label: "S", dimensions: "35 см", priceModifier: -1000 },
      { label: "M", dimensions: "45 см", priceModifier: 0 },
      { label: "L", dimensions: "60 см", priceModifier: 2000 },
    ],
    category: "Монобукеты",
    flowerTypes: ["Розы"],
    occasion: ["Юбилей", "Свадьба"],
    popularity: 3,
  },
];

export function formatPrice(price: number): string {
  return price.toLocaleString("ru-RU") + " ₽";
}
