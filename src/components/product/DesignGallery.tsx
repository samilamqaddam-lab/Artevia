'use client';

import {useEffect, useState} from 'react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/Button';
import {listProjects, deleteProject, type ProjectStore} from '@/lib/storage/projects';
import {products} from '@/lib/products';
import type {Locale} from '@/i18n/settings';

interface DesignGalleryProps {
  locale: Locale;
  title: string;
  emptyState: string;
  loadLabel: string;
  deleteLabel: string;
}

export function DesignGallery({locale, title, emptyState, loadLabel, deleteLabel}: DesignGalleryProps) {
  const [projects, setProjects] = useState<ProjectStore[]>([]);
  const router = useRouter();
  const tProducts = useTranslations('products');

  useEffect(() => {
    refreshProjects();
  }, []);

  const refreshProjects = async () => {
    const data = await listProjects();
    setProjects(data);
  };

  const handleLoad = (project: ProjectStore) => {
    const product = products.find((item) => item.id === project.productId);
    if (!product) return;
    router.push(`/${locale}/product/${product.slug}?projectId=${project.id}`);
  };

  const handleDelete = async (id: string) => {
    await deleteProject(id);
    await refreshProjects();
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="rounded-[36px] border border-slate-200 bg-white px-6 py-12 text-slate-900 shadow-[0_35px_80px_-60px_rgba(0,0,0,0.1)] sm:px-10 dark:border-white/10 dark:bg-[#121212] dark:text-slate-100 dark:shadow-[0_35px_80px_-60px_rgba(0,0,0,0.9)]">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">{title}</h1>
        </header>
        {projects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500 dark:border-white/20 dark:bg-[#161616] dark:text-slate-400">
            {emptyState}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const product = products.find((item) => item.id === project.productId);
              const productName = product
                ? tProducts(`${product.nameKey.split('.').slice(1).join('.')}`)
                : project.productId;
              return (
                <article
                  key={project.id}
                  className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_30px_60px_-40px_rgba(130,212,187,0.35)] dark:border-white/10 dark:bg-[#161616] dark:text-slate-200 dark:hover:shadow-[0_30px_60px_-40px_rgba(130,212,187,0.65)]"
                >
                  <div className="relative aspect-[4/5] border-b border-slate-200 bg-slate-100 dark:border-white/5 dark:bg-[#0f0f0f]">
                    {project.previewDataUrl ? (
                      <Image
                        src={project.previewDataUrl}
                        alt={project.name}
                        fill
                        className="object-contain p-4"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                        {productName}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-4 text-sm text-slate-600 dark:text-slate-300">
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">{project.name}</h2>
                    <p>{productName}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-400">
                      {new Date(project.updatedAt).toLocaleString(locale === 'ar' ? 'ar-MA' : 'fr-MA')}
                    </p>
                    <div className="mt-auto flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handleLoad(project)}>
                        {loadLabel}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(project.id)}>
                        {deleteLabel}
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
