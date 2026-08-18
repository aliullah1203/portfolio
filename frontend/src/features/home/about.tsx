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
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm font-semibold text-accent-400 uppercase tracking-wide">About</p>
          <h2 className="text-4xl font-bold text-white sm:text-5xl">Building modern web experiences</h2>
          <p className="max-w-2xl text-base leading-relaxed text-neutral-400">
            I'm a Junior Software Engineer focused on delivering performant, user-centric applications with Go, Next.js, GraphQL, PostgreSQL, and MongoDB. I enjoy solving complex problems and shipping polished end-to-end experiences.
          </p>
          <Button as="a" href="#projects" size="lg">
            View My Work
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((item) => (
            <Card key={item.label} className="flex flex-col items-start gap-3 p-4" interactive={false}>
              <span className="text-3xl font-bold text-accent-400">{item.value}</span>
              <span className="text-xs font-semibold uppercase text-neutral-500 tracking-wide">{item.label}</span>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
