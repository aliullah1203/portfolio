import { Card } from '@/shared/ui/card';

const timeline = [
  {
    title: 'Software Engineer',
    company: 'ActionBoard.AI (Deep Data Labs)',
    dateRange: 'Feb 2026 - Present',
    description:
      'Building scalable web applications and backend services with Next.js, TypeScript, and GraphQL. Focused on performance optimization, API efficiency, and delivering reliable production features.',
    tags: ['Next.js', 'TypeScript', 'GraphQL', 'React', 'AWS'],
  },
  {
    title: 'Backend Developer Intern',
    company: 'Luciety',
    dateRange: 'Sep 2025 - Jan 2026',
    description:
      'Engineered secure backend services in Go, implementing OAuth2, JWT authentication, and payment integration while optimizing PostgreSQL database performance.',
    tags: ['Go', 'PostgreSQL', 'JWT', 'OAuth2', 'Payment Systems'],
  },
  {
    title: 'Wing Chief - CP Wings',
    company: 'UITS Computer Club',
    dateRange: 'Jun 2025 - Jun 2026',
    description:
      'Led competitive programming activities, organized university programming contests, managed contest infrastructure, and mentored students in algorithmic problem solving.',
    tags: ['Leadership', 'Competitive Programming', 'Mentoring', 'Events'],
  },
  {
    title: 'Competitive Programmer',
    company: 'University of Information Technology & Sciences',
    dateRange: 'Jan 2022 - Present',
    description:
      'Solved 2000+ algorithmic problems, participated in 180+ programming contests, and represented the university in inter-university competitive programming events.',
    tags: ['DSA', 'Algorithms', 'Problem Solving', 'Codeforces', 'LeetCode'],
  }
];

export function ExperienceSection() {
  return (
    <section id="experience">
      <div className="mx-auto max-w-[1440px] space-y-12">
        <div>
          <p className="text-sm font-semibold text-accent-400 uppercase tracking-wide">Experience</p>
          <h2 className="mt-2 text-4xl font-bold text-white sm:text-5xl">Professional Timeline</h2>
        </div>

        <div className="space-y-4">
          {timeline.map((item) => (
            <Card key={item.title} className="p-6" interactive={false}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-neutral-400 mt-1">{item.company}</p>
                </div>
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap">
                  {item.dateRange}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-neutral-400">{item.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium text-accent-400 bg-accent-500/10 border border-accent-500/20 px-2.5 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
