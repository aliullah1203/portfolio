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
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-400">Testimonials</p>
          <h2 className="text-4xl font-bold text-white sm:text-5xl">What people say</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {testimonials.map((item) => (
            <div
              key={item.author}
              className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-8"
            >
              <p className="text-lg leading-8 text-neutral-300">“{item.quote}”</p>
              <div className="mt-6 flex items-center justify-between gap-4 border-t border-neutral-800 pt-6 text-sm text-neutral-400">
                <div>
                  <p className="font-semibold text-white">{item.author}</p>
                  <p>{item.role}</p>
                </div>
                <div className="flex gap-1 text-accent-400">
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
