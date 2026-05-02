import { PrismaClient, VariantSize, FlowerType, Occasion } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Запуск Seed-скрипта...');

  // ─── Очистка старых данных (если нужно) ───
  await prisma.cartItemAddOn.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItemAddOn.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.deliverySlot.deleteMany();
  await prisma.addOn.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // ─── Категории ───
  const roses = await prisma.category.create({ data: { name: 'Розы', slug: 'roses', description: 'Классические букеты из роз', sortOrder: 1 } });
  const tulips = await prisma.category.create({ data: { name: 'Тюльпаны', slug: 'tulips', description: 'Весенние букеты из тюльпанов', sortOrder: 2 } });
  const peonies = await prisma.category.create({ data: { name: 'Пионы', slug: 'peonies', description: 'Нежные и пышные пионы', sortOrder: 3 } });
  const mixed = await prisma.category.create({ data: { name: 'Авторские букеты', slug: 'mixed-bouquets', description: 'Уникальные авторские композиции', sortOrder: 4 } });
  const mono = await prisma.category.create({ data: { name: 'Монобукеты', slug: 'mono-bouquets', description: 'Стильные букеты из одного вида цветов', sortOrder: 5 } });

  // ─── Массив из 30 букетов ───
  const products = [
    // РОЗЫ (6 шт)
    {
      name: '101 красная роза', slug: '101-red-roses', description: 'Роскошный букет из 101 красной розы', flowerType: FlowerType.ROSES, occasion: [Occasion.VALENTINES, Occasion.ANNIVERSARY], categoryId: roses.id, featured: true,
      variants: [{ size: VariantSize.L, price: 35000, stock: 5, isDefault: true }]
    },
    {
      name: '51 белая роза', slug: '51-white-roses', description: 'Нежный букет из 51 белой розы', flowerType: FlowerType.ROSES, occasion: [Occasion.WEDDING, Occasion.ANNIVERSARY], categoryId: roses.id,
      variants: [{ size: VariantSize.M, price: 18000, stock: 10, isDefault: true }]
    },
    {
      name: '25 розовых роз', slug: '25-pink-roses', description: 'Классический букет из 25 розовых роз', flowerType: FlowerType.ROSES, occasion: [Occasion.BIRTHDAY], categoryId: roses.id,
      variants: [{ size: VariantSize.S, price: 9000, stock: 15, isDefault: true }]
    },
    {
      name: 'Малиновое вино', slug: 'crimson-wine-roses', description: '15 темно-бордовых роз в стильной упаковке', flowerType: FlowerType.ROSES, occasion: [Occasion.VALENTINES], categoryId: roses.id,
      variants: [{ size: VariantSize.S, price: 6000, stock: 20, isDefault: true }]
    },
    {
      name: 'Персиковый рассвет', slug: 'peach-dawn-roses', description: 'Кустовые персиковые розы (9 веток)', flowerType: FlowerType.ROSES, occasion: [Occasion.JUST_BECAUSE], categoryId: roses.id,
      variants: [{ size: VariantSize.M, price: 4500, stock: 15, isDefault: true }]
    },
    {
      name: 'Королевский бархат', slug: 'royal-velvet-roses', description: 'Букет из 15 кустовых бордовых роз', flowerType: FlowerType.ROSES, occasion: [Occasion.ANNIVERSARY], categoryId: roses.id,
      variants: [{ size: VariantSize.S, price: 7500, stock: 10, isDefault: true }]
    },

    // ТЮЛЬПАНЫ (6 шт)
    {
      name: 'Весенний микс', slug: 'spring-tulip-mix', description: 'Микс из 25 разноцветных тюльпанов', flowerType: FlowerType.TULIPS, occasion: [Occasion.BIRTHDAY], categoryId: tulips.id, featured: true,
      variants: [{ size: VariantSize.M, price: 7000, stock: 25, isDefault: true }, { size: VariantSize.L, price: 12000, stock: 10, isDefault: false }]
    },
    {
      name: 'Белоснежность', slug: 'white-tulips-15', description: '15 белых тюльпанов', flowerType: FlowerType.TULIPS, occasion: [Occasion.JUST_BECAUSE], categoryId: tulips.id,
      variants: [{ size: VariantSize.S, price: 4000, stock: 30, isDefault: true }]
    },
    {
      name: 'Желтое солнце', slug: 'yellow-tulips-51', description: 'Солнечный букет из 51 желтого тюльпана', flowerType: FlowerType.TULIPS, occasion: [Occasion.THANK_YOU], categoryId: tulips.id,
      variants: [{ size: VariantSize.L, price: 14000, stock: 5, isDefault: true }]
    },
    {
      name: 'Нежно-розовые тюльпаны', slug: 'pink-tulips', description: '21 розовый тюльпан в крафте', flowerType: FlowerType.TULIPS, occasion: [Occasion.MOTHERS_DAY], categoryId: tulips.id,
      variants: [{ size: VariantSize.M, price: 6500, stock: 20, isDefault: true }]
    },
    {
      name: 'Красная страсть (Тюльпаны)', slug: 'red-tulips', description: 'Букет из 35 красных тюльпанов', flowerType: FlowerType.TULIPS, occasion: [Occasion.VALENTINES], categoryId: tulips.id,
      variants: [{ size: VariantSize.M, price: 9500, stock: 15, isDefault: true }]
    },
    {
      name: 'Сиреневый туман', slug: 'lilac-tulips', description: '15 сиреневых тюльпанов с эвкалиптом', flowerType: FlowerType.TULIPS, occasion: [Occasion.JUST_BECAUSE], categoryId: tulips.id,
      variants: [{ size: VariantSize.S, price: 5000, stock: 20, isDefault: true }]
    },

    // ПИОНЫ (6 шт)
    {
      name: 'Пионовый рай', slug: 'peony-paradise', description: 'Пышный букет из 15 розовых пионов', flowerType: FlowerType.PEONIES, occasion: [Occasion.WEDDING, Occasion.BIRTHDAY], categoryId: peonies.id, featured: true,
      variants: [{ size: VariantSize.M, price: 15000, stock: 8, isDefault: true }]
    },
    {
      name: 'Сара Бернар', slug: 'peony-sarah', description: '9 знаменитых пионов сорта Сара Бернар', flowerType: FlowerType.PEONIES, occasion: [Occasion.ANNIVERSARY], categoryId: peonies.id,
      variants: [{ size: VariantSize.S, price: 9500, stock: 12, isDefault: true }]
    },
    {
      name: 'Коралловый шарм', slug: 'peony-coral', description: '15 коралловых пионов, меняющих цвет', flowerType: FlowerType.PEONIES, occasion: [Occasion.BIRTHDAY], categoryId: peonies.id,
      variants: [{ size: VariantSize.M, price: 17000, stock: 5, isDefault: true }]
    },
    {
      name: 'Белоснежные пионы', slug: 'white-peonies', description: '7 белоснежных пионов в минималистичной бумаге', flowerType: FlowerType.PEONIES, occasion: [Occasion.JUST_BECAUSE], categoryId: peonies.id,
      variants: [{ size: VariantSize.S, price: 7500, stock: 15, isDefault: true }]
    },
    {
      name: 'Микс пионов', slug: 'mixed-peonies', description: '25 пионов разных оттенков', flowerType: FlowerType.PEONIES, occasion: [Occasion.MOTHERS_DAY], categoryId: peonies.id,
      variants: [{ size: VariantSize.L, price: 25000, stock: 3, isDefault: true }]
    },
    {
      name: 'Пионы с эвкалиптом', slug: 'peony-eucalyptus', description: '5 пионов с ароматным эвкалиптом', flowerType: FlowerType.PEONIES, occasion: [Occasion.THANK_YOU], categoryId: peonies.id,
      variants: [{ size: VariantSize.S, price: 6000, stock: 10, isDefault: true }]
    },

    // АВТОРСКИЕ БУКЕТЫ (7 шт)
    {
      name: 'Прованс', slug: 'provence-mixed', description: 'Лаванда, кустовые розы и статица', flowerType: FlowerType.MIXED, occasion: [Occasion.JUST_BECAUSE], categoryId: mixed.id, featured: true,
      variants: [{ size: VariantSize.M, price: 6500, stock: 10, isDefault: true }]
    },
    {
      name: 'Летний бриз', slug: 'summer-breeze', description: 'Ромашки, васильки и колокольчики', flowerType: FlowerType.MIXED, occasion: [Occasion.BIRTHDAY], categoryId: mixed.id,
      variants: [{ size: VariantSize.S, price: 4500, stock: 15, isDefault: true }, { size: VariantSize.M, price: 7000, stock: 8, isDefault: false }]
    },
    {
      name: 'Нежность', slug: 'tenderness-mixed', description: 'Гортензия, розы и диантусы в пастельных тонах', flowerType: FlowerType.MIXED, occasion: [Occasion.MOTHERS_DAY], categoryId: mixed.id,
      variants: [{ size: VariantSize.M, price: 8500, stock: 12, isDefault: true }]
    },
    {
      name: 'Огненная страсть', slug: 'fire-passion', description: 'Красные розы, гиперикум и альстромерии', flowerType: FlowerType.MIXED, occasion: [Occasion.VALENTINES], categoryId: mixed.id,
      variants: [{ size: VariantSize.M, price: 7500, stock: 15, isDefault: true }]
    },
    {
      name: 'Лесная сказка', slug: 'forest-tale', description: 'Хлопок, шишки, хвоя и белые розы', flowerType: FlowerType.MIXED, occasion: [Occasion.OTHER], categoryId: mixed.id,
      variants: [{ size: VariantSize.M, price: 5500, stock: 20, isDefault: true }]
    },
    {
      name: 'Первое свидание', slug: 'first-date', description: 'Миниатюрный букет из орхидей и эустомы', flowerType: FlowerType.MIXED, occasion: [Occasion.JUST_BECAUSE], categoryId: mixed.id,
      variants: [{ size: VariantSize.S, price: 4000, stock: 15, isDefault: true }]
    },
    {
      name: 'Звездное небо', slug: 'starry-sky', description: 'Синие хризантемы с белой гипсофилой', flowerType: FlowerType.MIXED, occasion: [Occasion.BIRTHDAY], categoryId: mixed.id,
      variants: [{ size: VariantSize.L, price: 9000, stock: 5, isDefault: true }]
    },

    // МОНОБУКЕТЫ (5 шт)
    {
      name: 'Облако гортензий', slug: 'hydrangea-cloud', description: '3 пышные голубые гортензии', flowerType: FlowerType.HYDRANGEAS, occasion: [Occasion.MOTHERS_DAY], categoryId: mono.id, featured: true,
      variants: [{ size: VariantSize.M, price: 6500, stock: 10, isDefault: true }]
    },
    {
      name: 'Солнечные подсолнухи', slug: 'sunflowers-9', description: 'Шляпная коробка с 9 подсолнухами', flowerType: FlowerType.SUNFLOWERS, occasion: [Occasion.THANK_YOU], categoryId: mono.id,
      variants: [{ size: VariantSize.M, price: 7000, stock: 8, isDefault: true }]
    },
    {
      name: 'Французская лаванда', slug: 'lavender-mono', description: 'Сухоцветы французской лаванды', flowerType: FlowerType.DRIED, occasion: [Occasion.JUST_BECAUSE], categoryId: mono.id,
      variants: [{ size: VariantSize.S, price: 3000, stock: 30, isDefault: true }]
    },
    {
      name: 'Белоснежные орхидеи', slug: 'white-orchids', description: 'Ветка орхидеи Цимбидиум', flowerType: FlowerType.ORCHIDS, occasion: [Occasion.CORPORATE], categoryId: mono.id,
      variants: [{ size: VariantSize.S, price: 4500, stock: 12, isDefault: true }]
    },
    {
      name: 'Воздушная гипсофила', slug: 'gypsophila-rainbow', description: 'Огромный букет радужной гипсофилы', flowerType: FlowerType.OTHER, occasion: [Occasion.BIRTHDAY], categoryId: mono.id,
      variants: [{ size: VariantSize.L, price: 8000, stock: 15, isDefault: true }]
    }
  ];

  for (const prod of products) {
    await prisma.product.create({
      data: {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        flowerType: prod.flowerType,
        occasion: prod.occasion,
        categoryId: prod.categoryId,
        featured: prod.featured || false,
        variants: {
          create: prod.variants
        },
        images: {
          create: [
            { url: `https://via.placeholder.com/600x800?text=${encodeURIComponent(prod.name)}`, alt: prod.name, sortOrder: 0 }
          ]
        }
      }
    });
  }

  // ─── Добавки (Add-ons) ───
  await prisma.addOn.createMany({
    data: [
      { name: 'Открытка', description: 'Поздравительная открытка ручной работы', price: 500, available: true },
      { name: 'Шоколад Lindt', description: 'Коробка шоколадных конфет Lindt 200г', price: 2500, available: true },
      { name: 'Мягкая игрушка', description: 'Плюшевый мишка 30 см', price: 3000, available: true },
      { name: 'Воздушные шары', description: 'Набор из 5 гелиевых шаров', price: 2000, available: true },
    ],
  });

  // ─── Слоты доставки (на ближайшие 3 дня) ───
  for (let dayOffset = 1; dayOffset <= 3; dayOffset++) {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    date.setHours(0, 0, 0, 0);

    await prisma.deliverySlot.createMany({
      data: [
        { date, timeStart: '09:00', timeEnd: '12:00', maxOrders: 10 },
        { date, timeStart: '12:00', timeEnd: '15:00', maxOrders: 10 },
        { date, timeStart: '15:00', timeEnd: '18:00', maxOrders: 10 },
        { date, timeStart: '18:00', timeEnd: '21:00', maxOrders: 5 },
      ],
    });
  }

  // ─── Тестовый админ и клиент ───
  await prisma.user.create({
    data: { email: 'admin@probuton.com', name: 'Admin', phone: '+7 (999) 123-45-67', role: 'ADMIN' },
  });
  await prisma.user.create({
    data: { email: 'test@probuton.com', name: 'Тестовый Клиент', phone: '+7 (999) 000-00-00', role: 'CUSTOMER' },
  });

  console.log(`✅ Seed data created successfully! Added ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
