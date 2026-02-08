import Link from 'next/link'
;
;export const metadata = {
  title: 'Devotional | Glad Tidings',
  description: 'Daily devotional reading and verse of the day.',
}

export default function DevotionalPage() {
  return (
    <main className="px-4 sm:px-6 py-8 sm:py-12 animate-fade-in-up">
      <div className="container mx-auto max-w-3xl">
        <header className="mb-10 animate-fade-in-up">
          <p className="text-secondary font-semibold tracking-wide uppercase text-sm">
            Daily Devotional
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl md:text-5xl text-primary font-black">
            Draw Near
          </h1>
          <p className="mt-4 font-sans text-gray-700 leading-relaxed sm:leading-extra-relaxed text-base sm:text-lg">
            Placeholder devotional content. This page will feature a short reading,
            reflection, and prayer to encourage faith and practical living.
          </p>
        </header>

        {/* Verse of the Day */}
        <section className="border-2 border-gold rounded-xl bg-white p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up animation-delay-200">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-serif text-xl sm:text-2xl text-primary font-black">Verse of the Day</h2>
            <span className="text-xs font-black text-primary bg-gold/20 px-3 py-1 rounded-full">
              Psalm 46:10
            </span>
          </div>

          <blockquote className="mt-4 font-serif text-gray-800 leading-relaxed sm:leading-extra-relaxed text-base sm:text-lg devotional-content">
            “Be still, and know that I am God: I will be exalted among the heathen,
            I will be exalted in the earth.”
          </blockquote>

          <p className="mt-4 font-serif text-gray-600 leading-relaxed sm:leading-extra-relaxed text-base sm:text-lg devotional-content">
            Reflection (placeholder): In the quiet moments, God invites us to pause,
            breathe, and remember who He is. Stillness is not inactivity—it’s trust.
          </p>
        </section>

        {/* Actions */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up animation-delay-400">
          <Link
            href="#"
            className="inline-flex items-center justify-center rounded-2xl bg-gold hover:bg-gold-dark text-primary px-6 sm:px-8 py-3 sm:py-4 font-black transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 ui-text w-full sm:w-auto"
          >
            Yesterday&apos;s Devotional
          </Link>
          <Link
            href="#"
            className="inline-flex items-center justify-center rounded-2xl border-2 border-gold bg-white text-primary px-6 sm:px-8 py-3 sm:py-4 font-black hover:bg-gold-light transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 ui-text w-full sm:w-auto"
          >
            Browse Archive
          </Link>
        </div>
      </div>
    </main>
  )
}

