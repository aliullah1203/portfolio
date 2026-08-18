import { Card } from '@/shared/ui/card';
import { Code2, Database } from 'lucide-react';

const skillGroups = [
  {
    title: 'Languages',
    skills: ['C', 'C++', 'Java', 'Go', 'JavaScript', 'TypeScript'],
  },
  {
    title: 'Frontend',
    skills: ['HTML', 'CSS', 'React.js', 'Next.js', 'TanStack Query', 'Tailwind CSS'],
  },
  {
    title: 'Backend',
    skills: ['Node.js', 'Express.js', 'Gin', 'GraphQL', 'REST APIs', 'WebSockets'],
  },
  {
    title: 'Databases & Tools',
    skills: ['MongoDB', 'MySQL', 'PostgreSQL', 'Git / GitHub', 'Postman', 'Docker'],
  },
];

export function SkillsSection() {
  return (
    <section id="skills">
      <div className="mx-auto max-w-[1440px] space-y-12">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-accent-400 uppercase tracking-wide">Skills</p>
          <h2 className="text-4xl font-bold text-white sm:text-5xl">Technologies & Tools</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          {skillGroups.map((group) => (
            <Card key={group.title} className="space-y-4 p-6" interactive={false}>
              <h3 className="text-base font-semibold text-white">{group.title}</h3>
              <div className="space-y-2">
                {group.skills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-3 rounded-md border border-neutral-700/50 bg-neutral-900/30 px-3 py-2 text-sm text-neutral-300 hover:border-neutral-600 hover:bg-neutral-900/50 transition"
                  >
                    <Code2 size={14} className="text-accent-500 flex-shrink-0" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
