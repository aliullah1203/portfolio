import { type ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}

export function Card({ children, className, interactive = true }: CardProps) {
  return (
    <div className={clsx(interactive ? 'card-interactive' : 'card', className)}>
      {children}
    </div>
  );
}
