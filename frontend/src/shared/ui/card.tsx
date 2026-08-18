'use client';

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}

export function Card({ children, className, interactive = true }: CardProps) {
  return (
    <motion.div
      initial={false}
      whileHover={interactive ? { y: -2, transition: { duration: 0.2, ease: 'easeOut' } } : undefined}
      className={clsx(interactive ? 'card-interactive' : 'card', className)}
    >
      {children}
    </motion.div>
  );
}
