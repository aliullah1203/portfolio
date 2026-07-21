import { type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}

type ButtonProps = BaseButtonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  type?: 'button' | 'submit' | 'reset';
};

type AnchorButtonProps = BaseButtonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a' };

type Props = ButtonProps | AnchorButtonProps;

export function Button({ className, variant = 'primary', ...props }: Props) {
  if ('as' in props && props.as === 'a') {
    const { as: _as, ...anchorProps } = props;
    return (
      <a
        className={clsx(
          'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-slate-950',
          variant === 'primary' && 'bg-brand-500 text-white shadow-glow hover:bg-brand-400',
          variant === 'secondary' && 'border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10',
          variant === 'ghost' && 'bg-transparent text-slate-100 hover:bg-white/10',
          className,
        )}
        {...anchorProps}
      />
    );
  }

  const buttonProps = props as ButtonProps;

  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-slate-950',
        variant === 'primary' && 'bg-brand-500 text-white shadow-glow hover:bg-brand-400',
        variant === 'secondary' && 'border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10',
        variant === 'ghost' && 'bg-transparent text-slate-100 hover:bg-white/10',
        className,
      )}
      {...buttonProps}
    />
  );
}
