import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/widgets/navbar';
import { Footer } from '@/widgets/footer';

const projectData = {
  'learning-platform': {
    title: 'Learning Platform',
    description: 'A course management and analytics platform built with Next.js, Go, and PostgreSQL.',
    highlights: [
      'Student and instructor dashboards with role-based access',
      'Data analytics for course engagement and completion rates',
      'Responsive UI built with modern React and Tailwind patterns',
    ],
    techStack: ['Next.js', 'Go', 'PostgreSQL', 'GraphQL', 'TypeScript'],
    githubUrl: 'https://github.com/aliullah1203/learning-platform',
    liveUrl: 'https://github.com/aliullah1203/learning-platform',
  },
  'team-messaging-app': {
    title: 'Team Messaging App',
    description: 'A realtime communication tool with channels, user presence, and performance-optimized messaging.',
    highlights: [
      'Channel-based collaboration with threaded messaging',
      'Fast syncing and presence awareness across sessions',
      'Lightweight architecture for production-ready deployment',
    ],
    techStack: ['Next.js', 'GraphQL', 'Redis', 'TypeScript'],
    githubUrl: 'https://github.com/aliullah1203/team-chat',
    liveUrl: 'https://github.com/aliullah1203/team-chat',
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = slug in projectData ? projectData[slug as keyof typeof projectData] : undefined;
  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 space-y-10">
        <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-10 shadow-glow">
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Project</p>
                <h1 className="mt-4 text-5xl font-semibold text-white">{project.title}</h1>
              </div>
              <Link href="/projects" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10">
                Back to Projects
              </Link>
            </div>
            <p className="max-w-3xl text-lg leading-8 text-slate-300">{project.description}</p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-10 shadow-glow">
            <h2 className="text-2xl font-semibold text-white">Project highlights</h2>
            <ul className="mt-6 space-y-4 text-slate-300">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-400" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-10 shadow-glow">
            <h2 className="text-2xl font-semibold text-white">Tech stack</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {project.techStack.map((tech) => (
                <span key={tech} className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-sm text-slate-200">
                  {tech}
                </span>
              ))}
            </div>
            <div className="mt-10 space-y-4">
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-brand-400 bg-brand-500/10 px-6 py-3 text-sm font-semibold text-brand-200 transition hover:bg-brand-500/20">
                View Code
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
