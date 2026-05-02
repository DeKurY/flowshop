import { SectionFade } from "@/components/ui/SectionFade";

export default function Delivery() {
  return (
    <SectionFade>
      <div className="container section">
        <div className="max-w-[800px] mx-auto">
          <h2>
            Условия <i className="accent-italic">доставки</i>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 mt-lg gap-lg">
            <div className="bg-bg border border-border p-lg rounded-card">
              <h3 className="mb-sm">По городу</h3>
              <p>
                Бесплатная доставка при заказе от 3000 ₽. Время доставки от 2
                часов с момента подтверждения заказа. Возможна срочная доставка за 1 час (оплачивается отдельно).
              </p>
            </div>
            <div className="bg-bg border border-border p-lg rounded-card">
              <h3 className="mb-sm">По области</h3>
              <p>
                Стоимость рассчитывается индивидуально оператором. Доставка в
                течение дня. Рекомендуем оформлять заказ за 24 часа.
              </p>
            </div>
          </div>

          <h3 className="mt-xl mb-md">
            Оплата
          </h3>
          <div className="bg-surface p-lg rounded-card">
            <ul className="list-disc list-inside space-y-sm text-text-muted">
              <li>Банковской картой онлайн на сайте</li>
              <li>Наличными или картой курьеру при получении</li>
              <li>СБП (Система быстрых платежей)</li>
              <li>Оплата для юридических лиц по безналичному расчету</li>
            </ul>
          </div>
        </div>
      </div>
    </SectionFade>
  );
}
