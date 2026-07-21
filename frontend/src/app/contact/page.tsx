import { Navbar } from '@/widgets/navbar';
import { Footer } from '@/widgets/footer';
import { ContactSection } from '@/features/home/contact';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 space-y-16">
        <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-10 shadow-glow">
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Contact</p>
              <h1 className="mt-4 text-5xl font-semibold text-white">Let&apos;s Build Together</h1>
            </div>
            <p className="max-w-3xl text-lg leading-8 text-slate-300">
              Share your project requirements or collaboration ideas. I&apos;m available for remote and hybrid roles and respond quickly to serious inquiries.
            </p>
          </div>
        </section>

        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
