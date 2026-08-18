'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/shared/ui/card';
import { ArrowUpRight, Github } from 'lucide-react';
import { Project } from '@/shared/types';

const API_BASE = 'https://portfolio-6i9r.onrender.com';

export function FeaturedProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/projects/featured`);
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
      <div className="mx-auto max-w-[1440px] space-y-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-accent-400 uppercase tracking-wide">Featured Work</p>
            <h2 className="mt-2 text-4xl font-bold text-white sm:text-5xl">Selected Projects</h2>
          </div>
          <a href="/projects" className="inline-flex items-center gap-2 text-accent-400 hover:text-accent-300 transition font-medium">
            View all
            <ArrowUpRight size={16} />
          </a>
        </div>

        {loading ? (
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-12 text-center text-neutral-400">
            Loading projects...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-12 text-center text-neutral-400">
            {error}
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-12 text-center text-neutral-400">
            No projects available.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="group overflow-hidden p-0">
                <a href={`/project/${project.slug}`} className="block h-full">
                  <div className="relative overflow-hidden bg-neutral-800 h-56">
                    <img
                      src={project.thumbnail || '/project-3.jpg'}
                      alt={project.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-4 p-5">
                    <h3 className="text-lg font-semibold text-white group-hover:text-accent-400 transition">
                      {project.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-neutral-400">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-xs font-medium text-neutral-400 bg-neutral-800/50 px-2 py-1 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies && project.technologies.length > 3 && (
                        <span className="text-xs font-medium text-neutral-400">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-accent-400 hover:text-accent-300 transition"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ArrowUpRight size={16} />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-neutral-400 hover:text-accent-400 transition"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </a>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
