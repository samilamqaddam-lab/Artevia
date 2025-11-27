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
  }
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostsByCategory(category: BlogPost['category']): BlogPost[] {
  return blogPosts.filter((post) => post.category === category);
}
