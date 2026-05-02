import { SectionFade } from "@/components/ui/SectionFade";

export default function About() {
  return (
    <SectionFade>
      <div className="container section">
        <div className="max-w-[800px] mx-auto text-center">
          <h2>
            Искусство <i className="accent-italic">флористики</i>
          </h2>
          <img
            src="https://images.unsplash.com/photo-1559863486-d24cdb9f0d0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="Pro Buton Studio"
            className="w-full rounded-card my-lg object-cover"
          />
          <p className="text-[1.1rem] leading-[1.8] text-text-main">
            Каждый букет в Pro Buton собирается вручную нашими флористами. Мы
            тщательно отбираем свежие цветы каждое утро, чтобы гарантировать
            идеальное качество. Наша цель — передать ваши самые искренние
            эмоции через эстетику природных форм.
          </p>

          <p className="text-[1.1rem] leading-[1.8] mt-md text-text-main">
            Студия открылась в 2018 году как маленькая мастерская и выросла
            в любимое место горожан, где всегда можно найти авторские букеты
            и редкие экзотические цветы.
          </p>
        </div>
      </div>
    </SectionFade>
  );
}
