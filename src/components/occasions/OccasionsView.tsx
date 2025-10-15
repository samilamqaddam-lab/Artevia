'use client';

import {Building2, Palette, Box, Truck, Shield, ArrowRight} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {Button} from '@/components/ui/Button';
import type {Locale} from '@/i18n/settings';

const iconMap = {
  palette: Palette,
  box: Box,
  truck: Truck,
  shield: Shield
};

interface OccasionsContent {
  hero: {
    highlight: string;
    title: string;
    description: string;
    cta: {
      primary: string;
      secondary: string;
    };
  };
  usps: {
    title: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  useCases: {
    title: string;
    subtitle: string;
    items: Array<{
      slug: string;
      title: string;
      description: string;
      image: string;
      badge?: string;
    }>;
  };
  trust: {
    title: string;
    subtitle: string;
  };
  cta: {
    title: string;
    description: string;
    button: string;
  };
}

interface OccasionsViewProps {
  locale: Locale;
  content: OccasionsContent;
}

export function OccasionsView({locale, content}: OccasionsViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-[#0a0a0a] dark:to-[#121212]">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-2 text-sm font-medium text-brand dark:bg-brand/20">
              <Building2 size={16} />
              {content.hero.highlight}
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
              {content.hero.title}
            </h1>

            <p className="mx-auto mb-10 max-w-3xl text-lg text-slate-600 sm:text-xl dark:text-slate-300">
              {content.hero.description}
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href={`/${locale}/rfq`}>
                <Button size="lg" variant="primary">
                  {content.hero.cta.primary}
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              </Link>
              <Link href={`/${locale}/catalog`}>
                <Button size="lg" variant="secondary">
                  {content.hero.cta.secondary}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* USPs Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-900 dark:text-white">
            {content.usps.title}
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {content.usps.items.map((usp, index) => {
              const Icon = iconMap[usp.icon as keyof typeof iconMap];
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-white p-6 text-center transition-shadow hover:shadow-lg dark:border-white/10 dark:bg-[#171717]"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 dark:bg-brand/20">
                    <Icon size={32} className="text-brand" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                    {usp.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{usp.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
              {content.useCases.title}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              {content.useCases.subtitle}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {content.useCases.items.map((useCase, index) => {
              const href =
                useCase.slug === 'kit-bienvenue-employe'
                  ? (`/${locale}/occasions/kit-bienvenue-employe` as const)
                  : (`/${locale}/rfq` as const);

              return (
                <Link
                  key={index}
                  href={href}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-xl dark:bg-[#171717]"
                >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={useCase.image}
                    alt={useCase.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {useCase.badge && (
                    <div className="absolute right-4 top-4 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
                      {useCase.badge}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                    {useCase.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {useCase.description}
                  </p>
                  <div className="mt-4 flex items-center text-brand group-hover:translate-x-1 transition-transform">
                    <span className="text-sm font-medium">En savoir plus</span>
                    <ArrowRight size={16} className="ml-1" />
                  </div>
                </div>
              </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-slate-100 px-4 py-16 sm:px-6 lg:px-8 dark:bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
            {content.trust.title}
          </h2>
          <p className="mb-8 text-lg text-slate-600 dark:text-slate-300">
            {content.trust.subtitle}
          </p>
          {/* Placeholder for logos - can be added later */}
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale">
            {/* Client logos would go here */}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-brand to-brand/80 p-12 text-center text-white shadow-2xl">
          <h2 className="mb-4 text-3xl font-bold">{content.cta.title}</h2>
          <p className="mb-8 text-lg opacity-90">{content.cta.description}</p>
          <Link href={`/${locale}/rfq`}>
            <Button size="lg" className="bg-white text-brand hover:bg-slate-100">
              {content.cta.button}
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
