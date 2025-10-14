'use client';

import {
  Users,
  Heart,
  TrendingUp,
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  Sparkles
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {Button} from '@/components/ui/Button';
import type {Locale} from '@/i18n/settings';

const iconMap = {
  users: Users,
  heart: Heart,
  'trending-up': TrendingUp,
  award: Award
};

interface KitBienvenueContent {
  hero: {
    badge: string;
    title: string;
    description: string;
    cta: {
      primary: string;
      secondary: string;
    };
    image: string;
  };
  benefits: {
    title: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  included: {
    title: string;
    subtitle: string;
    packs: Array<{
      name: string;
      description: string;
      price: string;
      popular?: boolean;
      items: string[];
    }>;
  };
  process: {
    title: string;
    steps: Array<{
      number: number;
      title: string;
      description: string;
    }>;
  };
  testimonials: {
    title: string;
    items: Array<{
      quote: string;
      author: string;
      role: string;
      company: string;
    }>;
  };
  cta: {
    title: string;
    description: string;
    button: string;
  };
}

interface KitBienvenueViewProps {
  locale: Locale;
  content: KitBienvenueContent;
}

export function KitBienvenueView({locale, content}: KitBienvenueViewProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand/5 via-white to-brand/10 px-4 py-20 dark:from-brand/10 dark:via-[#0a0a0a] dark:to-brand/5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">
                <Sparkles size={16} />
                {content.hero.badge}
              </div>

              <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                {content.hero.title}
              </h1>

              <p className="mb-8 text-lg text-slate-600 dark:text-slate-300">
                {content.hero.description}
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
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

            <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl lg:aspect-[4/3]">
              <Image
                src={content.hero.image}
                alt={content.hero.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-900 dark:text-white">
            {content.benefits.title}
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {content.benefits.items.map((benefit, index) => {
              const Icon = iconMap[benefit.icon as keyof typeof iconMap];
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#171717]"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 dark:bg-brand/20">
                    <Icon size={24} className="text-brand" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Packs Section */}
      <section className="bg-slate-50 px-4 py-16 dark:bg-[#121212] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
              {content.included.title}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              {content.included.subtitle}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {content.included.packs.map((pack, index) => (
              <div
                key={index}
                className={`relative rounded-3xl border-2 bg-white p-8 dark:bg-[#171717] ${
                  pack.popular
                    ? 'border-brand shadow-xl scale-105'
                    : 'border-slate-200 dark:border-white/10'
                }`}
              >
                {pack.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-brand px-4 py-1 text-sm font-semibold text-white">
                    <Star size={16} className="inline mr-1" />
                    Populaire
                  </div>
                )}

                <h3 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {pack.name}
                </h3>
                <p className="mb-6 text-slate-600 dark:text-slate-400">{pack.description}</p>

                <div className="mb-6 space-y-3">
                  {pack.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle size={20} className="mt-0.5 flex-shrink-0 text-brand" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>

                <Link href={`/${locale}/rfq`}>
                  <Button
                    variant={pack.popular ? 'primary' : 'secondary'}
                    className="w-full"
                    size="lg"
                  >
                    Demander un devis
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-900 dark:text-white">
            {content.process.title}
          </h2>

          <div className="space-y-8">
            {content.process.steps.map((step, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
                  {step.number}
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-slate-50 px-4 py-16 dark:bg-[#121212] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-900 dark:text-white">
            {content.testimonials.title}
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            {content.testimonials.items.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-white/10 dark:bg-[#171717]"
              >
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className="fill-brand text-brand" />
                  ))}
                </div>
                <p className="mb-6 text-lg italic text-slate-700 dark:text-slate-300">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {testimonial.role} · {testimonial.company}
                  </p>
                </div>
              </div>
            ))}
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
