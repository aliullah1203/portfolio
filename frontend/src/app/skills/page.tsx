import { Navbar } from '@/widgets/navbar';
import { Footer } from '@/widgets/footer';
import { SkillsSection } from '@/features/home/skills';

export default function SkillsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 space-y-16">
        <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-10 shadow-glow">
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Skills</p>
              <h1 className="mt-4 text-5xl font-semibold text-white">All Skills</h1>
            </div>
            <p className="max-w-3xl text-lg leading-8 text-slate-300">
              Explore my full technical skill set across frontend, backend, databases, tools, and computer science fundamentals.
            </p>
          </div>
        </section>

        <SkillsSection />
      </main>
      <Footer />
    </div>
  );
}
