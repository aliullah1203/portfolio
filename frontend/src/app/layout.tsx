import type { Metadata } from 'next';
import '../shared/styles/globals.css'
import { Providers } from '@/shared/providers';

export const metadata: Metadata = {
  title: 'Ali Ullah | Junior Software Engineer',
  description: 'Junior Software Engineer specializing in Go, TypeScript, Next.js, GraphQL, PostgreSQL, MongoDB, and scalable web applications.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
