import { Card } from '@/shared/ui/card';

const timeline = [
  {
    title: 'Junior Software Engineer',
    company: 'ActionBoard.AI (Deep Data Labs)',
    dateRange: 'Feb 2026 - Present',
    description:
      'Building scalable web applications and backend services with Next.js, TypeScript, and GraphQL. Focused on performance optimization, API efficiency, and delivering reliable production features that enhance user experience and engineering productivity.',
    tags: ['Next.js', 'TypeScript', 'GraphQL', 'React', 'Postman', 'AWS'],
  },
  {
    title: 'Backend Developer Intern',
    company: 'Luciety',
    dateRange: 'Sep 2025 - Jan 2026',
    description:
      'Engineered secure backend services in Go, implementing Google OAuth2, JWT authentication, bcrypt password hashing, and SSLCommerz payment integration while optimizing PostgreSQL database performance.',
    tags: ['Go', 'PostgreSQL', 'JWT', 'OAuth2', 'SSLCommerz'],
  },
  {
    title: 'Wing Chief - CP Wings',
    company: 'UITS Computer Club',
    dateRange: 'Jun 2025 - Jun 2026',
    description:
      'Led competitive programming activities, organized 3+ university programming contests, managed contest infrastructure, and mentored students in algorithmic problem solving and coding best practices.',
    tags: ['Leadership', 'Competitive Programming', 'Mentoring', 'Contest Management'],
  },
  {
    title: 'Competitive Programmer',
    company: 'University of Information Technology & Sciences (UITS)',
    dateRange: 'Jan 2022 - Present',
    description:
      'Solved 2000+ algorithmic problems across Codeforces and LeetCode, participated in 180+ programming contests, and represented the university in multiple inter-university competitive programming events.',
    tags: ['DSA', 'Algorithms', 'Codeforces', 'LeetCode', 'Problem Solving'],
  }
];

export function ExperienceSection() {
  return (
    <section id="experience">
      <div className="mx-auto max-w-[1440px] space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Experience</p>
          <h2 className="text-4xl font-semibold text-white sm:text-5xl">My Professional Journey</h2>
        </div>

        <div className="space-y-6">
          {timeline.map((item, index) => (
            <div key={item.title} className="relative pl-8">
              <div className="absolute left-0 top-3 h-3 w-3 rounded-full bg-brand-500 shadow-glow" />
              <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-[0_20px_80px_-60px_rgba(124,58,237,0.9)]">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-slate-400">{item.company}</p>
                  </div>
                  <span className="rounded-full bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-300">
                    {item.dateRange}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                  {item.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-2">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
