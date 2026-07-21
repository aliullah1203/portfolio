import Image from 'next/image';
import { Button } from '@/shared/ui/button';
import { siteConfig } from '@/shared/constants/site';
import { Github, Linkedin, Instagram } from 'lucide-react';

const socials = [
  { label: 'Github', href: siteConfig.social.github, icon: Github },
  { label: 'LinkedIn', href: siteConfig.social.linkedin, icon: Linkedin },
  { label: 'Instagram', href: siteConfig.social.instagram, icon: Instagram },
];

export function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden pt-16">
      <div className="absolute inset-x-0 top-0 h-80 bg-hero-grid opacity-80" />
      <div className="relative mx-auto flex max-w-[1440px] flex-col gap-16 py-16 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-8">
          <span className="inline-flex items-center rounded-full border border-brand-500/30 bg-slate-900/80 px-4 py-2 text-xs uppercase tracking-[0.35em] text-brand-300 shadow-[0_20px_80px_-60px_rgba(124,58,237,0.8)]">
            Open to Collaborations
          </span>
          <div className="space-y-4">
            <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Hi, I'm <span className="text-brand-400">Ali Ullah</span>
            </h1>
            <p className="max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Junior Software Engineer building scalable web applications with Go, TypeScript, and modern cloud-native tooling.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button as="a" href="#projects" variant="primary">
              View My Work
            </Button>
            <Button as="a" href="#contact" variant="secondary">
              Get in Touch
            </Button>
          </div>

          <div className="flex items-center gap-4 pt-4">
            {socials.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-slate-200 transition hover:border-brand-400 hover:bg-brand-500/10"
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px] rounded-[2rem] border border-white/10 bg-slate-900/70 p-4 shadow-glow backdrop-blur-xl">
          <Image
            src="/profile.png"
            alt="Ali Ullah"
            fill
            className="rounded-[1.75rem] object-cover"
            sizes="(min-width: 1024px) 420px, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
