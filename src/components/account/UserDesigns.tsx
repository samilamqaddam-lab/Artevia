'use client';

import {useEffect, useState} from 'react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/Button';
import {useSupabase} from '@/components/Providers';
import {
  getProjects,
  deleteProject,
  type Project
} from '@/lib/supabase/projects';
import {
  migrateProjectsToSupabase,
  hasLocalProjectsToMigrate
} from '@/lib/supabase/migrate-projects';
import {products} from '@/lib/products';
import type {Locale} from '@/i18n/settings';
import {logger} from '@/lib/logger';

interface UserDesignsProps {
  locale: Locale;
  title: string;
  emptyState: string;
  loadLabel: string;
  deleteLabel: string;
  duplicateLabel: string;
  migrationPrompt: string;
  migrateButton: string;
}

export function UserDesigns({
  locale,
  title: _title,
  emptyState,
  loadLabel,
  deleteLabel,
  migrationPrompt,
  migrateButton
}: UserDesignsProps) {
  const [projects, setProjects] = useState<(Project & {product_name?: string})[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMigrationPrompt, setShowMigrationPrompt] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const router = useRouter();
  const tProducts = useTranslations('products');
  const _supabase = useSupabase();

  useEffect(() => {
    loadProjects();
    checkForLocalProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();

      // Enrich with product names
      const enriched = data.map((project) => {
        const product = products.find((p) => p.id === project.product_id);
        const product_name = product
          ? tProducts(`${product.nameKey.split('.').slice(1).join('.')}`)
          : project.product_id;
        return {...project, product_name};
      });

      setProjects(enriched);
    } catch (error) {
      logger.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkForLocalProjects = async () => {
    const hasLocal = await hasLocalProjectsToMigrate();
    setShowMigrationPrompt(hasLocal);
  };

  const handleMigration = async () => {
    setIsMigrating(true);
    try {
      await migrateProjectsToSupabase(true);
      await loadProjects();
      setShowMigrationPrompt(false);
    } catch (error) {
      logger.error('Migration error:', error);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleLoad = (project: Project & {product_name?: string}) => {
    const product = products.find((item) => item.id === project.product_id);
    if (!product) return;
    router.push(`/${locale}/product/${product.slug}?projectId=${project.id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      await loadProjects();
    } catch (error) {
      logger.error('Error deleting project:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600 dark:text-slate-400">Chargement...</div>
      </div>
    );
  }

  return (
    <div dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {showMigrationPrompt && (
        <div className="mb-6 rounded-2xl border border-brand/20 bg-brand/5 p-4 dark:bg-brand/10">
          <p className="mb-3 text-sm text-slate-700 dark:text-slate-200">{migrationPrompt}</p>
          <Button
            size="sm"
            variant="primary"
            onClick={handleMigration}
            disabled={isMigrating}
          >
            {isMigrating ? 'Migration en cours...' : migrateButton}
          </Button>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500 dark:border-white/20 dark:bg-[#161616] dark:text-slate-400">
          {emptyState}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_30px_60px_-40px_rgba(130,212,187,0.35)] dark:border-white/10 dark:bg-[#161616] dark:text-slate-200 dark:hover:shadow-[0_30px_60px_-40px_rgba(130,212,187,0.65)]"
            >
              <div className="relative aspect-[4/5] border-b border-slate-200 bg-slate-100 dark:border-white/5 dark:bg-[#0f0f0f]">
                {project.preview_url ? (
                  <Image
                    src={project.preview_url}
                    alt={project.name}
                    fill
                    className="object-contain p-4"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                    {project.product_name}
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4 text-sm text-slate-600 dark:text-slate-300">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  {project.name}
                </h2>
                <p>{project.product_name}</p>
                <p className="text-xs text-slate-400 dark:text-slate-400">
                  {project.updated_at ? new Date(project.updated_at).toLocaleString(
                    locale === 'ar' ? 'ar-MA' : 'fr-MA'
                  ) : '-'}
                </p>
                <div className="mt-auto flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleLoad(project)}
                  >
                    {loadLabel}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(project.id)}
                  >
                    {deleteLabel}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
