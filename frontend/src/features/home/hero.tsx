'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/shared/ui/button';
import { siteConfig } from '@/shared/constants/site';
import { Github, Linkedin, Mail } from 'lucide-react';

const socials = [
  { label: 'Github', href: siteConfig.social.github, icon: Github },
  { label: 'LinkedIn', href: siteConfig.social.linkedin, icon: Linkedin },
  { label: 'Email', href: `mailto:${siteConfig.email}`, icon: Mail },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: 'easeOut' },
  },
};

export function HeroSection() {
  return (
    <motion.section
      id="home"
      className="relative overflow-hidden pt-12"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: 0.08 },
        },
      }}
    >
      <div className="relative mx-auto flex max-w-[1440px] flex-col gap-12 py-12 lg:flex-row lg:items-center lg:justify-between lg:gap-20">
        <div className="max-w-2xl space-y-8">
          <motion.div className="space-y-4" variants={fadeUp}>
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Hi, I'm Ali
            </h1>
            <p className="text-xl text-neutral-400 leading-relaxed max-w-2xl">
              Software Engineer building scalable web applications with Go, TypeScript, and modern cloud-native technologies.
            </p>
          </motion.div>

          <motion.div className="flex flex-col gap-4 sm:flex-row sm:items-center" variants={fadeUp}>
            <Button as="a" href="#projects" size="lg">
              View My Work
            </Button>
            <Button as="a" href="#contact" variant="secondary" size="lg">
              Get in Touch
            </Button>
          </motion.div>

          <motion.div className="flex items-center gap-3 pt-4" variants={fadeUp}>
            {socials.map((item) => {
              const Icon = item.icon;
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -1, transition: { duration: 0.2, ease: 'easeOut' } }}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-900/50 text-neutral-400 transition hover:border-accent-600 hover:bg-accent-600/10 hover:text-accent-400"
                >
                  <Icon size={20} />
                </motion.a>
              );
            })}
          </motion.div>
        </div>

        <motion.div
          className="relative mx-auto aspect-[4/5] w-full max-w-[380px] rounded-lg border border-neutral-700 bg-neutral-900/50 p-1 overflow-hidden"
          variants={fadeUp}
        >
          <Image
            src="/profile.png"
            alt="Ali Ullah"
            fill
            className="rounded-md object-cover"
            sizes="(min-width: 1024px) 380px, 100vw"
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
