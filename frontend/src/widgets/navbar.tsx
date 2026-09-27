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
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-neutral-800 bg-white shadow-sm">
            <svg viewBox="0 0 64 64" className="h-9 w-9" aria-label="Cowboy icon" role="img">
              <circle cx="32" cy="32" r="29" fill="#ffffff" />
              <path
                d="M17 28c2-12 9-17 15-17s13 5 15 17l-3 3H20l-3-3Z"
                fill="#111111"
              />
              <path
                d="M12 33c2-3 6-5 10-5h20c4 0 8 2 10 5l-3 11c-2 6-7 10-17 10S17 50 14 44l-2-11Z"
                fill="#111111"
              />
              <path d="M20 31c2-4 5-6 12-6s10 2 12 6" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="25.5" cy="35" r="1.7" fill="#ffffff" />
              <circle cx="38.5" cy="35" r="1.7" fill="#ffffff" />
              <path d="M29 39c2 2 4 2 6 0" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M16 32c7 2 10 3 16 3 6 0 9-1 16-3" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M18 29C12 31 9 34 8 39" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M46 29c6 2 9 5 10 10" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
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
