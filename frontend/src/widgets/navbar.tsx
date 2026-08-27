import Link from 'next/link';
import { Button } from '@/shared/ui/button';

const navigation = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Skills', href: '/skills' },
  { label: 'Projects', href: '/projects' },
  { label: 'Experience', href: '/experience' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-600">
            <span className="text-sm font-bold text-white">AU</span>
          </div>
          <span className="hidden font-semibold text-white sm:inline">Ali Ullah</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-neutral-400 transition hover:text-neutral-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" as="a" href="/aliullah.pdf" download="aliullah.pdf">
            Resume
          </Button>
        </div>
      </div>
    </header>
  );
}
