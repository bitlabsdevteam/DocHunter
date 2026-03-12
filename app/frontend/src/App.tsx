import { useState } from 'react';

type Locale = 'en' | 'ja';

export function App() {
  const [locale, setLocale] = useState<Locale>('en');

  return (
    <main className="container">
      <header className="header">
        <h1>DocHunter</h1>
        <select value={locale} onChange={(e) => setLocale(e.target.value as Locale)}>
          <option value="en">English</option>
          <option value="ja">日本語</option>
        </select>
      </header>

      <section className="card">
        <h2>{locale === 'en' ? 'AI Healthcare Locator' : 'AI医療機関ロケーター'}</h2>
        <p>
          {locale === 'en'
            ? 'Describe symptoms and we will find nearby clinics/hospitals in Japan.'
            : '症状を入力すると、日本国内の近隣クリニック・病院を提案します。'}
        </p>
        <textarea placeholder={locale === 'en' ? 'e.g. fever and sore throat' : '例：発熱と喉の痛み'} rows={4} />
        <button>Start triage</button>
      </section>
    </main>
  );
}
