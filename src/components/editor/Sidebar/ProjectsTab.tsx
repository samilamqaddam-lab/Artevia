'use client';

import {useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import {FolderOpen, Trash2} from 'lucide-react';
import Image from 'next/image';
import {Button} from '@/components/ui/Button';
import type {Product} from '@/lib/products';
import type {Locale} from '@/i18n/settings';
import {listProjects, deleteProject, type ProjectStore} from '@/lib/storage/projects';
import {cn as _cn} from '@/lib/utils';

interface ProjectsTabProps {
  product: Product;
  locale: Locale;
  onLoadProject: (projectId: string) => void;
}

export function ProjectsTab({product, locale, onLoadProject}: ProjectsTabProps) {
  const [projects, setProjects] = useState<ProjectStore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjectsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProjectsList = async () => {
    setLoading(true);
    try {
      const allProjects = await listProjects();
      const filtered = allProjects.filter(p => p.productId === product.id);
      setProjects(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Supprimer ce projet ?')) return;
    await deleteProject(projectId);
    await loadProjectsList();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center gap-2">
        <FolderOpen size={18} className="text-brand" aria-hidden />
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          Mes Projets
        </h2>
      </header>

      <p className="text-xs text-slate-600 dark:text-slate-400">
        Retrouvez tous vos designs sauvegardés
      </p>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FolderOpen size={32} className="mb-3 text-slate-300" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Aucun projet sauvegardé
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Créez un design et enregistrez-le pour le retrouver ici
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{opacity: 0, y: 10}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: index * 0.05}}
              className="group rounded-2xl border border-slate-200 bg-white p-3 transition-all hover:border-brand hover:shadow-md dark:border-white/10 dark:bg-[#1f1f1f]"
            >
              <div className="flex items-start gap-3">
                {/* Preview */}
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
                  {project.previewDataUrl ? (
                    <Image
                      src={project.previewDataUrl}
                      alt={project.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-slate-100 dark:bg-[#0f0f0f]">
                      <FolderOpen size={20} className="text-slate-300" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {project.name}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {new Date(project.updatedAt).toLocaleDateString(
                      locale === 'ar' ? 'ar-MA' : 'fr-MA',
                      {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      }
                    )}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onLoadProject(project.id)}
                  className="flex-1"
                >
                  Charger
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteProject(project.id)}
                  className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                >
                  <Trash2 size={14} aria-hidden />
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-[#0f0f0f]">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          💡 Vos projets sont sauvegardés localement dans votre navigateur
        </p>
      </div>
    </div>
  );
}
