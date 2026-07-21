import { HeroSection } from '@/features/home/hero';
import { AboutSection } from '@/features/home/about';
import { SkillsSection } from '@/features/home/skills';
import { FeaturedProjectsSection } from '@/features/home/projects';
import { ExperienceSection } from '@/features/home/experience';
import { TestimonialsSection } from '@/features/home/testimonials';
import { BlogSection } from '@/features/home/blog';
import { ContactSection } from '@/features/home/contact';
import { Navbar } from '@/widgets/navbar';
import { Footer } from '@/widgets/footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <FeaturedProjectsSection />
        <ExperienceSection />
        <TestimonialsSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
