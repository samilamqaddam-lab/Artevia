/**
 * SEO Monitoring Configuration for Arteva
 * Target keywords for Moroccan market
 */

export const config = {
  domain: 'arteva.ma',
  baseUrl: 'https://arteva.ma',

  // Target keywords to track (prioritized for Morocco)
  keywords: [
    // High priority - Main terms
    'objets publicitaires Maroc',
    'objets publicitaires personnalisés Maroc',
    'goodies entreprise Casablanca',
    'cadeaux entreprise Maroc',

    // Product-specific keywords
    'bloc-notes personnalisé entreprise Maroc',
    'stylos personnalisés logo Maroc',
    'mug personnalisé entreprise Maroc',
    't-shirt personnalisé entreprise Casablanca',
    'clé USB personnalisée Maroc',

    // Intent-based keywords
    'devis objets publicitaires Maroc',
    'fournisseur goodies Casablanca',
    'kit bienvenue employé Maroc',
    'cadeaux clients entreprise Maroc'
  ],

  // Competitors to track
  competitors: [
    'lepublicitaire.com',
    'objetpublicitaire.ma',
    'publiimport.ma',
    'maroc-objet.com',
    'imagia.ma',
    'myprogift.com',
    'progift-maroc.com'
  ],

  // Pages to monitor performance
  pagesToAudit: [
    '/',
    '/fr',
    '/fr/catalog',
    '/fr/product/bloc-notes-personnalises',
    '/fr/product/stylos-metal-s1',
    '/fr/rfq'
  ],

  // Lighthouse thresholds (alert if below)
  thresholds: {
    performance: 80,
    seo: 90,
    accessibility: 90,
    bestPractices: 90
  }
};

export type SEOConfig = typeof config;
