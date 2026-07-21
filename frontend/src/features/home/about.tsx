import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

const stats = [
  { value: '1+', label: 'Years Experience' },
  { value: '12+', label: 'Projects Delivered' },
  { value: '15+', label: 'Technologies' },
];

export function AboutSection() {
  return (
    <section id="about" className="relative">
      <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.35em] text-brand-300">About Me</p>
          <h2 className="text-4xl font-semibold text-white sm:text-5xl">Building modern web products</h2>
          <p className="max-w-2xl text-base leading-8 text-slate-300">
            I am a Junior Software Engineer focused on delivering performant, user-friendly applications with Go, Next.js, GraphQL, PostgreSQL, and MongoDB. I enjoy solving complex problems and shipping polished end-to-end experiences.
          </p>
          <Button as="a" href="#projects" variant="primary">
            View My Work
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((item) => (
            <Card key={item.label} className="flex min-w-0 flex-col items-start gap-2">
              <span className="text-3xl font-semibold text-white">{item.value}</span>
              <span className="text-sm uppercase tracking-[0.10em] text-slate-400">{item.label}</span>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
