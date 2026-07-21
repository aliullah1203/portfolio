import { ExperienceSection } from '@/features/home/experience';
import { Navbar } from '@/widgets/navbar';
import { Footer } from '@/widgets/footer';

export default function ExperiencePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 space-y-16">
        <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-10 shadow-glow">
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Experience</p>
              <h1 className="mt-4 text-5xl font-semibold text-white">Career Timeline</h1>
            </div>
            <p className="max-w-3xl text-lg leading-8 text-slate-300">
              Review my work history and competitive programming experience, including backend engineering, internship projects, leadership in tech communities, and algorithmic problem solving.
            </p>
          </div>
        </section>

        <ExperienceSection />
      </main>
      <Footer />
    </div>
  );
}
