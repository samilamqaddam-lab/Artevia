/**
 * Blog posts for SEO content marketing
 * Target keywords for Moroccan promotional products market
 */

export interface BlogPost {
  id: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  image: string;
  category: 'guide' | 'tendances' | 'conseils' | 'cas-client';
  readingTime: number; // minutes
  // Translations handled via next-intl
  titleKey: string;
  excerptKey: string;
  contentKey: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 'objets-publicitaires-maroc-guide-complet',
    slug: 'objets-publicitaires-maroc-guide-complet',
    publishedAt: '2024-11-15',
    updatedAt: '2024-11-27',
    image: '/images/blog/objets-publicitaires-guide.jpg',
    category: 'guide',
    readingTime: 8,
    titleKey: 'blog.posts.objets-publicitaires-maroc-guide-complet.title',
    excerptKey: 'blog.posts.objets-publicitaires-maroc-guide-complet.excerpt',
    contentKey: 'blog.posts.objets-publicitaires-maroc-guide-complet.content'
  },
  {
    id: 'goodies-entreprise-casablanca-tendances',
    slug: 'goodies-entreprise-casablanca-tendances',
    publishedAt: '2024-11-20',
    updatedAt: '2024-11-27',
    image: '/images/blog/goodies-tendances.jpg',
    category: 'tendances',
    readingTime: 5,
    titleKey: 'blog.posts.goodies-entreprise-casablanca-tendances.title',
    excerptKey: 'blog.posts.goodies-entreprise-casablanca-tendances.excerpt',
    contentKey: 'blog.posts.goodies-entreprise-casablanca-tendances.content'
  },
  {
    id: 'kit-bienvenue-employe-comment-creer',
    slug: 'kit-bienvenue-employe-comment-creer',
    publishedAt: '2024-11-25',
    updatedAt: '2024-11-27',
    image: '/images/blog/kit-bienvenue.jpg',
    category: 'conseils',
    readingTime: 6,
    titleKey: 'blog.posts.kit-bienvenue-employe-comment-creer.title',
    excerptKey: 'blog.posts.kit-bienvenue-employe-comment-creer.excerpt',
    contentKey: 'blog.posts.kit-bienvenue-employe-comment-creer.content'
  },
  {
    id: 'stylos-publicitaires-maroc-guide-achat',
    slug: 'stylos-publicitaires-maroc-guide-achat',
    publishedAt: '2024-12-05',
    updatedAt: '2024-12-07',
    image: '/images/blog/stylos-publicitaires.jpg',
    category: 'guide',
    readingTime: 7,
    titleKey: 'blog.posts.stylos-publicitaires-maroc-guide-achat.title',
    excerptKey: 'blog.posts.stylos-publicitaires-maroc-guide-achat.excerpt',
    contentKey: 'blog.posts.stylos-publicitaires-maroc-guide-achat.content'
  },
  {
    id: 'cadeaux-entreprise-fin-annee-maroc',
    slug: 'cadeaux-entreprise-fin-annee-maroc',
    publishedAt: '2024-12-06',
    updatedAt: '2024-12-07',
    image: '/images/blog/cadeaux-fin-annee.jpg',
    category: 'tendances',
    readingTime: 6,
    titleKey: 'blog.posts.cadeaux-entreprise-fin-annee-maroc.title',
    excerptKey: 'blog.posts.cadeaux-entreprise-fin-annee-maroc.excerpt',
    contentKey: 'blog.posts.cadeaux-entreprise-fin-annee-maroc.content'
  },
  {
    id: 'personnalisation-logo-entreprise-techniques',
    slug: 'personnalisation-logo-entreprise-techniques',
    publishedAt: '2024-12-07',
    updatedAt: '2024-12-07',
    image: '/images/blog/personnalisation-logo.jpg',
    category: 'conseils',
    readingTime: 8,
    titleKey: 'blog.posts.personnalisation-logo-entreprise-techniques.title',
    excerptKey: 'blog.posts.personnalisation-logo-entreprise-techniques.excerpt',
    contentKey: 'blog.posts.personnalisation-logo-entreprise-techniques.content'
  },
  {
    id: 'choisir-goodies-entreprise-evenement',
    slug: 'choisir-goodies-entreprise-evenement',
    publishedAt: '2025-03-01',
    updatedAt: '2025-03-10',
    image: '/images/blog/goodies-evenement.jpg',
    category: 'guide',
    readingTime: 7,
    titleKey: 'blog.posts.choisir-goodies-entreprise-evenement.title',
    excerptKey: 'blog.posts.choisir-goodies-entreprise-evenement.excerpt',
    contentKey: 'blog.posts.choisir-goodies-entreprise-evenement.content'
  },
  {
    id: 'tote-bag-personnalise-maroc-tendances',
    slug: 'tote-bag-personnalise-maroc-tendances',
    publishedAt: '2025-03-03',
    updatedAt: '2025-03-10',
    image: '/images/blog/tote-bag-maroc.jpg',
    category: 'tendances',
    readingTime: 6,
    titleKey: 'blog.posts.tote-bag-personnalise-maroc-tendances.title',
    excerptKey: 'blog.posts.tote-bag-personnalise-maroc-tendances.excerpt',
    contentKey: 'blog.posts.tote-bag-personnalise-maroc-tendances.content'
  },
  {
    id: 'mugs-personnalises-entreprise-maroc',
    slug: 'mugs-personnalises-entreprise-maroc',
    publishedAt: '2025-03-05',
    updatedAt: '2025-03-10',
    image: '/images/blog/mugs-personnalises.jpg',
    category: 'guide',
    readingTime: 6,
    titleKey: 'blog.posts.mugs-personnalises-entreprise-maroc.title',
    excerptKey: 'blog.posts.mugs-personnalises-entreprise-maroc.excerpt',
    contentKey: 'blog.posts.mugs-personnalises-entreprise-maroc.content'
  },
  {
    id: 'objets-publicitaires-ecologiques-maroc',
    slug: 'objets-publicitaires-ecologiques-maroc',
    publishedAt: '2025-03-06',
    updatedAt: '2025-03-10',
    image: '/images/blog/goodies-ecologiques.jpg',
    category: 'tendances',
    readingTime: 7,
    titleKey: 'blog.posts.objets-publicitaires-ecologiques-maroc.title',
    excerptKey: 'blog.posts.objets-publicitaires-ecologiques-maroc.excerpt',
    contentKey: 'blog.posts.objets-publicitaires-ecologiques-maroc.content'
  },
  {
    id: 'goodies-salon-professionnel-maroc',
    slug: 'goodies-salon-professionnel-maroc',
    publishedAt: '2025-03-07',
    updatedAt: '2025-03-10',
    image: '/images/blog/salon-professionnel.jpg',
    category: 'conseils',
    readingTime: 6,
    titleKey: 'blog.posts.goodies-salon-professionnel-maroc.title',
    excerptKey: 'blog.posts.goodies-salon-professionnel-maroc.excerpt',
    contentKey: 'blog.posts.goodies-salon-professionnel-maroc.content'
  },
  {
    id: 'cle-usb-personnalisee-maroc-guide',
    slug: 'cle-usb-personnalisee-maroc-guide',
    publishedAt: '2025-03-08',
    updatedAt: '2025-03-10',
    image: '/images/blog/cle-usb-personnalisee.jpg',
    category: 'guide',
    readingTime: 5,
    titleKey: 'blog.posts.cle-usb-personnalisee-maroc-guide.title',
    excerptKey: 'blog.posts.cle-usb-personnalisee-maroc-guide.excerpt',
    contentKey: 'blog.posts.cle-usb-personnalisee-maroc-guide.content'
  },
  {
    id: 't-shirts-personnalises-entreprise-maroc',
    slug: 't-shirts-personnalises-entreprise-maroc',
    publishedAt: '2025-03-09',
    updatedAt: '2025-03-10',
    image: '/images/blog/t-shirts-entreprise.jpg',
    category: 'guide',
    readingTime: 6,
    titleKey: 'blog.posts.t-shirts-personnalises-entreprise-maroc.title',
    excerptKey: 'blog.posts.t-shirts-personnalises-entreprise-maroc.excerpt',
    contentKey: 'blog.posts.t-shirts-personnalises-entreprise-maroc.content'
  },
  {
    id: 'budget-goodies-entreprise-maroc-combien',
    slug: 'budget-goodies-entreprise-maroc-combien',
    publishedAt: '2025-03-10',
    updatedAt: '2025-03-10',
    image: '/images/blog/budget-goodies.jpg',
    category: 'conseils',
    readingTime: 5,
    titleKey: 'blog.posts.budget-goodies-entreprise-maroc-combien.title',
    excerptKey: 'blog.posts.budget-goodies-entreprise-maroc-combien.excerpt',
    contentKey: 'blog.posts.budget-goodies-entreprise-maroc-combien.content'
  },
  {
    id: 'cadeaux-clients-fideles-maroc',
    slug: 'cadeaux-clients-fideles-maroc',
    publishedAt: '2025-02-25',
    updatedAt: '2025-03-10',
    image: '/images/blog/cadeaux-clients.jpg',
    category: 'conseils',
    readingTime: 5,
    titleKey: 'blog.posts.cadeaux-clients-fideles-maroc.title',
    excerptKey: 'blog.posts.cadeaux-clients-fideles-maroc.excerpt',
    contentKey: 'blog.posts.cadeaux-clients-fideles-maroc.content'
  },
  {
    id: 'objets-publicitaires-communication-interne-maroc',
    slug: 'objets-publicitaires-communication-interne-maroc',
    publishedAt: '2025-02-20',
    updatedAt: '2025-03-10',
    image: '/images/blog/communication-interne.jpg',
    category: 'tendances',
    readingTime: 6,
    titleKey: 'blog.posts.objets-publicitaires-communication-interne-maroc.title',
    excerptKey: 'blog.posts.objets-publicitaires-communication-interne-maroc.excerpt',
    contentKey: 'blog.posts.objets-publicitaires-communication-interne-maroc.content'
  }
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostsByCategory(category: BlogPost['category']): BlogPost[] {
  return blogPosts.filter((post) => post.category === category);
}
