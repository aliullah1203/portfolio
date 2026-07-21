import { FeaturedProjectsSection } from '@/features/home/projects';
import { Navbar } from '@/widgets/navbar';
import { Footer } from '@/widgets/footer';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 space-y-16">
        <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-10 shadow-glow">
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Projects</p>
              <h1 className="mt-4 text-5xl font-semibold text-white">Selected Work</h1>
            </div>
            <p className="max-w-3xl text-lg leading-8 text-slate-300">
              A selection of production-ready applications and developer tooling I built using modern full stack technologies, such as Go, Next.js, GraphQL, and PostgreSQL.
            </p>
          </div>
        </section>

        <FeaturedProjectsSection />
      </main>
      <Footer />
    </div>
  );
}
