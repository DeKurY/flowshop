import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface py-xl mt-xl">
      <div className="container grid grid-cols-4 gap-lg">
        <div>
          <Link href="/" className="font-serif text-2xl font-medium mb-md block no-underline text-text-main">
            Pro <i className="accent-italic">Buton</i>
          </Link>
          <p className="text-sm">
            Премиальная студия флористики и доставки эмоций.
          </p>
        </div>

        <div>
          <h4 className="font-sans uppercase text-xs tracking-[0.05em] mb-md font-medium">
            Каталог
          </h4>
          <ul className="list-none space-y-2">
            <li className="text-[0.9rem] text-text-muted">
              <Link href="/catalog" className="no-underline text-text-muted hover:text-text-main transition-colors">
                Популярное
              </Link>
            </li>
            <li className="text-[0.9rem] text-text-muted">
              <Link href="/catalog" className="no-underline text-text-muted hover:text-text-main transition-colors">
                Сборные букеты
              </Link>
            </li>
            <li className="text-[0.9rem] text-text-muted">
              <Link href="/catalog" className="no-underline text-text-muted hover:text-text-main transition-colors">
                Монобукеты
              </Link>
            </li>
            <li className="text-[0.9rem] text-text-muted">
              <Link href="/catalog" className="no-underline text-text-muted hover:text-text-main transition-colors">
                Подарки
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-sans uppercase text-xs tracking-[0.05em] mb-md font-medium">
            Информация
          </h4>
          <ul className="list-none space-y-2">
            <li className="text-[0.9rem] text-text-muted">
              <Link href="/about" className="no-underline text-text-muted hover:text-text-main transition-colors">
                О студии
              </Link>
            </li>
            <li className="text-[0.9rem] text-text-muted">
              <Link href="/delivery" className="no-underline text-text-muted hover:text-text-main transition-colors">
                Доставка и оплата
              </Link>
            </li>
            <li className="text-[0.9rem] text-text-muted">
              <Link href="/contacts" className="no-underline text-text-muted hover:text-text-main transition-colors">
                Контакты
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-sans uppercase text-xs tracking-[0.05em] mb-md font-medium">
            Контакты
          </h4>
          <ul className="list-none space-y-2">
            <li className="text-[0.9rem] text-text-muted">+7 (999) 123-45-67</li>
            <li className="text-[0.9rem] text-text-muted">WhatsApp</li>
            <li className="text-[0.9rem] text-text-muted">Telegram</li>
            <li className="text-xs-caps mt-sm">
              ул. Цветочная, 15, Москва
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
