import { AboutSection } from '@/features/home/about';
import { Navbar } from '@/widgets/navbar';
import { Footer } from '@/widgets/footer';
import { siteConfig } from '@/shared/constants/site';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 space-y-16">
        <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-10 shadow-glow">
          <div className="space-y-8">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-brand-300">About</p>
              <h1 className="mt-4 text-5xl font-semibold text-white">I'm Ali Ullah, a Junior Software Engineer.</h1>
            </div>
            <p className="max-w-3xl text-lg leading-8 text-slate-300">
              I build scalable web applications using Go, TypeScript, Next.js, GraphQL, PostgreSQL, and MongoDB. My focus is on creating polished product experiences that perform reliably in production.
            </p>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Location</p>
                <p className="mt-4 text-lg font-medium text-white">{siteConfig.location}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Email</p>
                <p className="mt-4 text-lg font-medium text-white">{siteConfig.email}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Phone</p>
                <p className="mt-4 text-lg font-medium text-white">{siteConfig.phone}</p>
              </div>
            </div>
          </div>
        </section>

        <AboutSection />

        <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-10 shadow-glow">
          <div className="space-y-8">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-brand-300">What I bring</p>
              <h2 className="mt-4 text-4xl font-semibold text-white">Real product experience and engineering craftsmanship.</h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
                <h3 className="text-xl font-semibold text-white">Product-focused mindset</h3>
                <p className="mt-4 text-slate-300">I deliver solutions that solve user problems, not just technical challenges, by balancing quality, performance, and usability.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
                <h3 className="text-xl font-semibold text-white">Clean architecture</h3>
                <p className="mt-4 text-slate-300">I use modular, maintainable patterns in both frontend and backend systems so teams can iterate faster and ship safer changes.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
