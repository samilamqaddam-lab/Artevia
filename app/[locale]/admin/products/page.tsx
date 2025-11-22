/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import {
  Settings,
  Image as ImageIcon,
  Package,
  ArrowLeft,
  Search,
  Loader2
} from 'lucide-react';
import { products } from '@/lib/products';

export default function AdminProductsPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('admin.products');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/role');
      if (!response.ok) {
        router.push(`/${locale}/auth/login`);
        return;
      }

      const data = await response.json();
      if (data.role !== 'admin' && data.role !== 'super_admin') {
        router.push(`/${locale}/auth/login`);
        return;
      }

      setIsAuthenticated(true);
      loadProducts();
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push(`/${locale}/auth/login`);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setProducts(products);
      setFilteredProducts(products);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter((product) => {
      return product.name.toLowerCase().includes(query) ||
             product.category.toLowerCase().includes(query);
    });
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  if (!isAuthenticated || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-brand" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-[#0a0a0a] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}/admin/pricing`}
              className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Gestion des Produits
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {products.length} produits disponibles
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-slate-900 placeholder-slate-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-[#171717] dark:text-white dark:placeholder-slate-400"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white transition-all hover:shadow-lg dark:border-slate-700 dark:bg-[#171717]"
            >
              {/* Product Image */}
              <div className="aspect-square relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                  src={product.heroImage}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {product.category}
                </p>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/${locale}/admin/products/${product.id}/photos`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
                  >
                    <ImageIcon size={16} />
                    <span>Photos</span>
                  </Link>
                  <button
                    onClick={() => router.push(`/${locale}/product/${product.slug}`)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-[#0a0a0a] dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <Package size={16} />
                    <span>Voir</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
            <Package className="mx-auto mb-4 text-slate-400" size={48} />
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Aucun produit trouvé
            </p>
            {searchQuery && (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">
                Essayez avec d'autres mots-clés
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}