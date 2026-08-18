'use client';

import { motion } from 'framer-motion';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

const stats = [
  { value: '1+', label: 'Years Experience' },
  { value: '12+', label: 'Projects Delivered' },
  { value: '15+', label: 'Technologies' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: 'easeOut' },
  },
};

export function AboutSection() {
  return (
    <motion.section
      id="about"
      className="relative"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: 0.08 },
        },
      }}
    >
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
        <motion.div className="space-y-6" variants={fadeUp}>
          <p className="text-sm font-semibold text-accent-400 uppercase tracking-wide">About</p>
          <h2 className="text-4xl font-bold text-white sm:text-5xl">Building modern web experiences</h2>
          <p className="max-w-2xl text-base leading-relaxed text-neutral-400">
            I'm a Junior Software Engineer focused on delivering performant, user-centric applications with Go, Next.js, GraphQL, PostgreSQL, and MongoDB. I enjoy solving complex problems and shipping polished end-to-end experiences.
          </p>
          <Button as="a" href="#projects" size="lg">
            View My Work
          </Button>
        </motion.div>

        <motion.div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" variants={fadeUp}>
          {stats.map((item) => (
            <Card key={item.label} className="flex flex-col items-start gap-3 p-4" interactive={false}>
              <span className="text-3xl font-bold text-accent-400">{item.value}</span>
              <span className="text-xs font-semibold uppercase text-neutral-500 tracking-wide">{item.label}</span>
            </Card>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
