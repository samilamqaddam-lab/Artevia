'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import type {Order} from '@/lib/supabase/orders';
import {logger} from '@/lib/logger';

interface OrdersListProps {
  locale: string;
}

export function OrdersList({locale}: OrdersListProps) {
  const t = useTranslations('account.orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des commandes');
        }
        const data = await response.json();
        setOrders(data.orders || []);
      } catch (err) {
        logger.error('Error fetching orders:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/30 dark:bg-red-900/10">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500 dark:border-white/20 dark:bg-[#161616] dark:text-slate-400">
        {t('empty')}
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending-review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending-review':
        return t('status.pending');
      case 'processing':
        return t('status.processing');
      case 'completed':
        return t('status.completed');
      case 'cancelled':
        return t('status.cancelled');
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatPrice = (amount: number | string | null) => {
    if (!amount) return '—';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR'
    }).format(num);
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-[#161616]"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {order.order_id}
                </h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}
                >
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <p>
                  <span className="font-medium">{t('date')}:</span>{' '}
                  {formatDate(order.created_at)}
                </p>
                {order.quantity_total && (
                  <p>
                    <span className="font-medium">{t('quantity')}:</span> {order.quantity_total}{' '}
                    {t('items')}
                  </p>
                )}
                {order.notes && (
                  <p className="italic">
                    <span className="font-medium">{t('notes')}:</span> {order.notes}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              {order.total_amount && (
                <div className="text-right">
                  <p className="text-2xl font-bold text-brand">
                    {formatPrice(order.total_amount)}
                  </p>
                  {order.discount_amount && parseFloat(String(order.discount_amount)) > 0 && (
                    <p className="text-xs text-green-600 dark:text-green-400">
                      -{formatPrice(order.discount_amount)} {t('discount')}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Order items preview */}
          {order.items && Array.isArray(order.items) && order.items.length > 0 && (
            <div className="mt-4 border-t border-slate-100 pt-4 dark:border-white/5">
              <p className="mb-2 text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
                {t('itemsTitle')}
              </p>
              <div className="space-y-1">
                {(order.items as Array<{quantity?: number; productId?: string}>)
                  .slice(0, 3)
                  .map((item, idx: number) => (
                    <p key={idx} className="text-sm text-slate-600 dark:text-slate-400">
                      • {item.quantity}x {item.productId || t('product')}
                    </p>
                  ))}
                {(order.items as unknown[]).length > 3 && (
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    +{(order.items as unknown[]).length - 3} {t('moreItems')}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
