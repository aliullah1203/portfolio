'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/shared/ui/card';
import { ArrowRight, Github } from 'lucide-react';
import { Project } from '@/shared/types';

export function FeaturedProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const API_URL = 'https://portfolio-6i9r.onrender.com';
        const response = await fetch(`${API_URL}/api/projects/featured`);
        if (!response.ok) {
          throw new Error('Failed to load featured projects');
        }
        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError('Unable to load featured projects.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  return (
    <section id="projects">
      <div className="mx-auto max-w-[1440px] space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Featured Projects</p>
            <h2 className="text-4xl font-semibold text-white sm:text-5xl">Some Things I've Built</h2>
          </div>
          <button className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10">
            View All Projects
          </button>
        </div>

        {loading ? (
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-10 text-center text-slate-400">Loading featured projects...</div>
        ) : error ? (
          <div className="rounded-[2rem] border border-white/10 bg-red-500/10 p-10 text-center text-red-300">{error}</div>
        ) : projects.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-10 text-center text-slate-400">No featured projects available.</div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="group overflow-hidden p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={project.thumbnail || '/project-3.jpg'}
                    alt={project.title}
                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                </div>
                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-brand-300">Featured Project</p>
                    <div className="flex items-center gap-2 text-slate-400">
                      {project.githubUrl ? (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="transition hover:text-white">
                          <Github size={18} />
                        </a>
                      ) : null}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
                    <p className="text-sm leading-7 text-slate-300">{project.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                    {project.technologies?.map((tech) => (
                      <span key={tech} className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-2">
                        {tech}
                      </span>
                    ))}
                  </div>
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-brand-300 transition hover:text-brand-200"
                    >
                      Live Demo <ArrowRight size={16} />
                    </a>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
