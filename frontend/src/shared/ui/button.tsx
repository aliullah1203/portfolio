import { type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

type ButtonProps = BaseButtonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  type?: 'button' | 'submit' | 'reset';
};

type AnchorButtonProps = BaseButtonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a' };

type Props = ButtonProps | AnchorButtonProps;

const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-neutral-950';

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded',
  md: 'px-4 py-2.5 text-sm rounded-md',
  lg: 'px-5 py-3 text-base rounded-md',
};

const variants = {
  primary: 'bg-accent-600 text-white hover:bg-accent-700 active:bg-accent-800 disabled:opacity-50 disabled:cursor-not-allowed',
  secondary: 'border border-neutral-700 bg-neutral-900/50 text-neutral-200 hover:border-neutral-600 hover:bg-neutral-900 active:bg-neutral-800',
  ghost: 'text-neutral-300 hover:text-white hover:bg-neutral-900/50 active:bg-neutral-900',
};

export function Button({ className, variant = 'primary', size = 'md', ...props }: Props) {
  const variantStyles = variants[variant];
  const sizeStyles = sizes[size];

  if ('as' in props && props.as === 'a') {
    const { as: _as, ...anchorProps } = props;
    return (
      <a
        className={clsx(baseStyles, sizeStyles, variantStyles, className)}
        {...anchorProps}
      />
    );
  }

  const buttonProps = props as ButtonProps;

  return (
    <button
      className={clsx(baseStyles, sizeStyles, variantStyles, className)}
      {...buttonProps}
    />
  );
}
