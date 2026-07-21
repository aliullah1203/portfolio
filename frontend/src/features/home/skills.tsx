import { Card } from '@/shared/ui/card';
import { ArrowUpRight, Atom, Cloud, Code2, Database, Github, Layout, Layers, Server, Sparkles, Terminal, Zap } from 'lucide-react';

const skillGroups = [
  {
    title: 'Languages',
    skills: ['C', 'C++', 'JAVA' ,'Go', 'JavaScript', 'TypeScript'],
  },
  {
    title: 'Frontend',
    skills: ['HTML', 'CSS', 'React.js', 'Next.js', 'TanStack'],
  },
  {
    title: 'Backend',
    skills: ['Node.js', 'Express.js', 'Gin', 'GraphQL', 'REST APIs', 'WebSockets'],
  },
  {
    title: 'Databases & Tools',
    skills: ['MongoDB', 'MySQL', 'PostgreSQL', 'Git', 'GitHub', 'Postman'],
  },
  {
    title: 'Computer Science',
    skills: ['CP', 'OOP', 'Operating Systems'],
  },
];

const skillIconMap: Record<string, typeof Atom> = {
  Go: Terminal,
  JavaScript: Code2,
  TypeScript: Code2,
  'React.js': Atom,
  'Next.js': Layout,
  TanStack: Layers,
  'Node.js': Server,
  'Express.js': Zap,
  GraphQL: Sparkles,
  MongoDB: Database,
  MySQL: Database,
  PostgreSQL: Database,
  Git: Github,
  GitHub: Github,
  Postman: ArrowUpRight,
  CP: Code2,
  OOP: Layers,
  'Operating Systems': Cloud,
};

export function SkillsSection() {
  return (
    <section id="skills">
      <div className="mx-auto max-w-[1440px] space-y-10">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Skills</p>
          <h2 className="text-4xl font-semibold text-white sm:text-5xl">Technologies I Work With</h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
          {skillGroups.map((group) => (
            <Card key={group.title} className="space-y-4">
              <h3 className="text-lg font-semibold text-white">{group.title}</h3>
              <div className="grid gap-2">
                {group.skills.map((skill) => {
                  const Icon = skillIconMap[skill] ?? Code2;
                  return (
                    <div
                      key={skill}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-200"
                    >
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900/80 text-brand-300">
                        <Icon size={16} />
                      </span>
                      <span>{skill}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
