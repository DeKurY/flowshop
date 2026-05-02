import { SectionFade } from "@/components/ui/SectionFade";
import Button from "@/components/ui/Button";

export default function Contacts() {
  return (
    <SectionFade>
      <div className="container section">
        <div className="max-w-[800px] mx-auto">
          <h2 className="mb-xl text-center">
            Наши <i className="accent-italic">контакты</i>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-xl mb-xl">
            <div className="bg-surface p-lg rounded-card">
              <h3 className="mb-md">Для связи</h3>
              <ul className="list-none space-y-sm text-[1.1rem] mb-lg">
                <li className="font-medium">+7 (999) 123-45-67</li>
                <li className="text-text-muted">Ежедневно 9:00 – 21:00</li>
              </ul>
              
              <div className="flex flex-col gap-sm">
                <Button variant="outline">Написать в WhatsApp</Button>
                <Button variant="outline">Написать в Telegram</Button>
              </div>
            </div>

            <div className="p-lg md:p-0 flex flex-col justify-center">
               <h3 className="mb-md">Адрес студии</h3>
               <p className="text-[1.1rem] mb-sm font-medium">г. Москва, ул. Цветочная, 15</p>
               <p className="text-text-muted mb-lg">Метро Ботанический сад, вход со стороны парка.</p>
               <div className="w-full h-[200px] bg-surface rounded-card flex items-center justify-center border border-border mt-auto">
                  <span className="text-text-muted text-sm">Карта (Placeholder)</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </SectionFade>
  );
}
