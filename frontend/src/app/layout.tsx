import type { Metadata } from 'next';
import '../shared/styles/globals.css'
import { Providers } from '@/shared/providers';

export const metadata: Metadata = {
  title: 'Ali Ullah | Software Engineer',
 description: 'Software Engineer specializing in Backend and full-stack development with Go, TypeScript, Next.js, GraphQL, AWS, DynamoDB, PostgreSQL, MongoDB, and scalable web applications.',
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
