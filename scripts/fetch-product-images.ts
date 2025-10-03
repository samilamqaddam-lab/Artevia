#!/usr/bin/env -S ts-node --esm

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';

type QueryMap = Record<string, string>;

type ImageAttribution = {
  title?: string;
  source?: string;
  link?: string;
};

type ProductImageOverride = {
  heroImage?: string;
  gallery?: string[];
  attributions?: ImageAttribution[];
  fetchedAt?: string;
  query?: string;
};

type OverridesFile = Record<string, ProductImageOverride>;

type SerpApiImageResult = {
  original?: string;
  original_height?: number;
  original_width?: number;
  thumbnail?: string;
  title?: string;
  link?: string;
  source?: string;
};

type SerpApiResponse = {
  images_results?: SerpApiImageResult[];
  error?: string;
};

const BLOCKED_HOSTS = new Set([
  't4.ftcdn.net',
  't3.ftcdn.net',
  'stock.adobe.com',
  'cdn.pixabay.com',
  'www.shutterstock.com',
  'shutterstock.com',
  'img.freepik.com',
  'www.freepik.com',
  'static.vecteezy.com',
  'www.vecteezy.com',
  'media.istockphoto.com',
  'www.istockphoto.com',
  'thumbs.dreamstime.com',
  'www.dreamstime.com',
  'c8.alamy.com',
  'www.alamy.com',
  'graphicburger.com',
  'goodmockups.com',
  'elements.envato.com',
  'elements-resized.envatousercontent.com',
  'supplycrew.com.au',
  'cdn11.bigcommerce.com',
  'mtc.ae',
  'www.photoflashdrive.com',
  'www.usbandmore.co.za',
  'goodthings.com.au',
  'media.gettyimages.com',
  'www.gettyimages.com',
  'assets.mockey.ai',
  'mockey.ai'
]);

const PREFERRED_HOST_WEIGHTS = new Map<string, number>([
  ['images.unsplash.com', 0],
  ['plus.unsplash.com', 0],
  ['source.unsplash.com', 0],
  ['images.pexels.com', 0],
  ['dynamic.pexels.com', 0],
  ['upload.wikimedia.org', 1]
]);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const queriesPath = path.join(rootDir, 'src/lib/product-image-queries.json');
const overridesPath = path.join(rootDir, 'src/lib/product-image-overrides.json');

const args = process.argv.slice(2);

function getFlagValue(flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index !== -1) {
    return args[index + 1];
  }
  return undefined;
}

const slugFilter = getFlagValue('--slug') ?? getFlagValue('-s');
const dryRun = args.includes('--dry-run');
const limitArg = getFlagValue('--limit');
const delayArg = getFlagValue('--delay');
const galleryLimit = Number.isFinite(Number(limitArg)) ? Math.max(1, Number(limitArg)) : 4;
const delayMs = Number.isFinite(Number(delayArg)) ? Math.max(0, Number(delayArg)) : 1200;

async function sleep(ms: number) {
  if (ms <= 0) return;
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function loadJson<T>(filepath: string, fallback: T): Promise<T> {
  try {
    const data = await fs.readFile(filepath, 'utf8');
    return JSON.parse(data) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return fallback;
    }
    throw error;
  }
}

function unique<T>(values: T[]): T[] {
  const seen = new Set<T>();
  const response: T[] = [];
  for (const value of values) {
    if (value === undefined || value === null) continue;
    if (seen.has(value)) continue;
    seen.add(value);
    response.push(value);
  }
  return response;
}

function isBlockedUrl(url: string | undefined | null) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, '');
    return BLOCKED_HOSTS.has(hostname) || BLOCKED_HOSTS.has(parsed.hostname);
  } catch (error) {
    return true;
  }
}

function getHostWeight(url: string | undefined | null) {
  if (!url) return Number.POSITIVE_INFINITY;
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    if (PREFERRED_HOST_WEIGHTS.has(hostname)) {
      return PREFERRED_HOST_WEIGHTS.get(hostname) ?? 0;
    }
    return 10;
  } catch (error) {
    return Number.POSITIVE_INFINITY;
  }
}

async function fetchImages(slug: string, query: string, apiKey: string) {
  const url = new URL('https://serpapi.com/search.json');
  url.searchParams.set('engine', 'google_images');
  url.searchParams.set('q', query);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('gl', 'ma');
  url.searchParams.set('hl', 'fr');

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`SerpAPI request failed (${response.status} ${response.statusText})`);
  }

  const payload = (await response.json()) as SerpApiResponse;
  if (payload.error) {
    throw new Error(`SerpAPI error: ${payload.error}`);
  }

  const images = payload.images_results ?? [];
  if (images.length === 0) {
    console.warn(`⚠️  ${slug}: aucune image trouvée pour "${query}".`);
    return null;
  }

  const allowedImages = images.filter((image) => {
    const candidate = image.original ?? image.thumbnail;
    return candidate && !isBlockedUrl(candidate);
  });

  allowedImages.sort((a, b) => getHostWeight(a.original ?? a.thumbnail) - getHostWeight(b.original ?? b.thumbnail));

  if (allowedImages.length === 0) {
    console.warn(`⚠️  ${slug}: images bloquées (watermark/licence) pour "${query}".`);
    return null;
  }

  const bestCandidate = allowedImages.find((image) => Boolean(image.original)) ?? allowedImages[0];
  const heroImage = bestCandidate?.original ?? bestCandidate?.thumbnail;
  if (!heroImage) {
    console.warn(`⚠️  ${slug}: résultats sans URLs exploitables.`);
    return null;
  }

  const gallery = unique(
    allowedImages
      .slice(0, galleryLimit)
      .map((image) => image.original ?? image.thumbnail)
      .filter((value): value is string => Boolean(value))
  );

  const attributions: ImageAttribution[] = allowedImages.slice(0, galleryLimit).map((image) => ({
    title: image.title,
    source: image.source,
    link: image.link
  }));

  return {
    heroImage,
    gallery,
    attributions
  };
}

async function main() {
  const apiKey = process.env.SERPAPI_KEY ?? process.env.SERP_API_KEY;
  if (!apiKey) {
    console.error('❌ SERPAPI_KEY (ou SERP_API_KEY) est requis pour lancer la recherche d\'images.');
    process.exitCode = 1;
    return;
  }

  const queries = await loadJson<QueryMap>(queriesPath, {});
  const overrides = await loadJson<OverridesFile>(overridesPath, {});

  const entries = Object.entries(queries)
    .filter(([slug]) => (slugFilter ? slug === slugFilter : true))
    .sort(([a], [b]) => a.localeCompare(b));

  if (entries.length === 0) {
    console.warn(slugFilter ? `⚠️  Aucun produit trouvé pour le slug "${slugFilter}".` : '⚠️  Aucun slug à traiter.');
    return;
  }

  const updates: Array<{slug: string; heroImage: string; gallery: string[]}> = [];

  for (const [slug, query] of entries) {
    if (!query) {
      console.warn(`⚠️  ${slug}: requête vide, ignoré.`);
      continue;
    }

    console.log(`🔍  Recherche du visuel pour ${slug}…`);
    try {
      const result = await fetchImages(slug, query, apiKey);
      if (!result) {
        continue;
      }

      const previous = overrides[slug] ?? {};
      const updated: ProductImageOverride = {
        ...previous,
        heroImage: result.heroImage,
        gallery: result.gallery.length ? result.gallery : previous.gallery,
        attributions: result.attributions,
        fetchedAt: new Date().toISOString(),
        query
      };
      overrides[slug] = updated;
      updates.push({slug, heroImage: updated.heroImage ?? '', gallery: updated.gallery ?? []});
      console.log(`✅  ${slug}: ${result.gallery.length} visuel(s) récupéré(s).`);
    } catch (error) {
      console.error(`❌  ${slug}: ${(error as Error).message}`);
    }

    if (delayMs > 0) {
      await sleep(delayMs);
    }
  }

  if (updates.length === 0) {
    console.log('ℹ️  Aucun override enregistré.');
    return;
  }

  const sortedOverrides = Object.fromEntries(
    Object.entries(overrides).sort(([a], [b]) => a.localeCompare(b))
  );

  const nextContent = `${JSON.stringify(sortedOverrides, null, 2)}\n`;
  if (dryRun) {
    console.log('📝  Mode dry-run — fichier non enregistré. Aperçu des overrides:');
    console.log(nextContent);
    return;
  }

  await fs.writeFile(overridesPath, nextContent, 'utf8');
  console.log(`💾  Overrides mis à jour pour ${updates.length} produit(s) → ${path.relative(rootDir, overridesPath)}`);
}

main().catch((error) => {
  console.error('❌  Échec inattendu:', error);
  process.exitCode = 1;
});
