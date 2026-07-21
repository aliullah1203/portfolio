const testimonials = [
  {
    quote: 'Ali consistently delivers production-grade code and brings strong ownership to every feature. His Go and TypeScript expertise helped us ship faster with fewer bugs.',
    author: 'Sarah Johnson',
    role: 'Product Lead',
  },
  {
    quote: 'Working with Ali was a pleasure. He built clean, maintainable applications with thoughtful interfaces, and he communicates well across the team.',
    author: 'Morgan Lee',
    role: 'Engineering Manager',
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials">
      <div className="mx-auto max-w-[1440px] space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Testimonials</p>
          <h2 className="text-4xl font-semibold text-white sm:text-5xl">What People Say</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {testimonials.map((item) => (
            <div
              key={item.author}
              className="glass-card p-8"
            >
              <p className="text-lg leading-8 text-slate-300">“{item.quote}”</p>
              <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-slate-400">
                <div>
                  <p className="font-semibold text-white">{item.author}</p>
                  <p>{item.role}</p>
                </div>
                <div className="flex gap-1 text-brand-400">
                  {'★'.repeat(5)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
