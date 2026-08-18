import Image from 'next/image';
import { Button } from '@/shared/ui/button';
import { siteConfig } from '@/shared/constants/site';
import { Github, Linkedin, Mail } from 'lucide-react';

const socials = [
  { label: 'Github', href: siteConfig.social.github, icon: Github },
  { label: 'LinkedIn', href: siteConfig.social.linkedin, icon: Linkedin },
  { label: 'Email', href: `mailto:${siteConfig.email}`, icon: Mail },
];

export function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden pt-12">
      <div className="relative mx-auto flex max-w-[1440px] flex-col gap-12 py-12 lg:flex-row lg:items-center lg:justify-between lg:gap-20">
        <div className="max-w-2xl space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Hi, I'm Ali
            </h1>
            <p className="text-xl text-neutral-400 leading-relaxed max-w-2xl">
              Junior Software Engineer building scalable web applications with Go, TypeScript, and modern cloud-native technologies.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button as="a" href="#projects" size="lg">
              View My Work
            </Button>
            <Button as="a" href="#contact" variant="secondary" size="lg">
              Get in Touch
            </Button>
          </div>

          <div className="flex items-center gap-3 pt-4">
            {socials.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-900/50 text-neutral-400 transition hover:border-accent-600 hover:bg-accent-600/10 hover:text-accent-400"
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-[380px] rounded-lg border border-neutral-700 bg-neutral-900/50 p-1 overflow-hidden">
          <Image
            src="/profile.png"
            alt="Ali Ullah"
            fill
            className="rounded-md object-cover"
            sizes="(min-width: 1024px) 380px, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
