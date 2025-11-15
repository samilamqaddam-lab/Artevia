'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/Button';
import {useToast} from '@/components/Providers';
import {Edit2, RotateCcw, Check, X, Search} from 'lucide-react';
import {formatPrice} from '@/lib/utils';
import type {Locale} from '@/i18n/settings';

type PriceTier = {
  minQuantity: number;
  unitPrice: number;
};

type PricingItem = {
  product_id: string;
  product_name: string;
  product_slug: string;
  method_id: string;
  method_name: string;
  has_override: boolean;
  override_id: string | null;
  tiers: PriceTier[];
  updated_at: string | null;
  updated_by: string | null;
};

type EditingData = {
  product_id: string;
  method_id: string;
  tier_1_quantity: number;
  tier_1_price: number;
  tier_2_quantity: number;
  tier_2_price: number;
  tier_3_quantity: number;
  tier_3_price: number;
};

export default function AdminPricingPage({params}: {params: {locale: Locale}}) {
  const {locale} = params;
  const t = useTranslations('admin.pricing');
  const tProducts = useTranslations('products');
  const {pushToast} = useToast();

  const [pricing, setPricing] = useState<PricingItem[]>([]);
  const [filteredPricing, setFilteredPricing] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<PricingItem | null>(null);
  const [editData, setEditData] = useState<EditingData | null>(null);
  const [saving, setSaving] = useState(false);

  // Load pricing data
  const loadPricing = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/pricing');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setPricing(data.pricing || []);
      setFilteredPricing(data.pricing || []);
    } catch (error) {
      console.error('Error loading pricing:', error);
      pushToast({title: t('messages.loadError')});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPricing();
  }, []);

  // Filter pricing based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPricing(pricing);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = pricing.filter((item) => {
      const productName = tProducts(item.product_name.split('.').slice(1).join('.')).toLowerCase();
      const methodName = tProducts(item.method_name.split('.').slice(1).join('.')).toLowerCase();
      return productName.includes(query) || methodName.includes(query);
    });
    setFilteredPricing(filtered);
  }, [searchQuery, pricing, tProducts]);

  // Open edit modal
  const handleEdit = (item: PricingItem) => {
    setEditingItem(item);
    setEditData({
      product_id: item.product_id,
      method_id: item.method_id,
      tier_1_quantity: item.tiers[0]?.minQuantity || 50,
      tier_1_price: item.tiers[0]?.unitPrice || 0,
      tier_2_quantity: item.tiers[1]?.minQuantity || 100,
      tier_2_price: item.tiers[1]?.unitPrice || 0,
      tier_3_quantity: item.tiers[2]?.minQuantity || 300,
      tier_3_price: item.tiers[2]?.unitPrice || 0
    });
  };

  // Save price override
  const handleSave = async () => {
    if (!editData) return;

    // Validate
    if (
      editData.tier_1_quantity >= editData.tier_2_quantity ||
      editData.tier_2_quantity >= editData.tier_3_quantity
    ) {
      pushToast({title: t('messages.invalidQuantities')});
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/admin/pricing', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(editData)
      });

      if (!response.ok) throw new Error('Failed to save');

      pushToast({title: t('messages.saveSuccess')});
      setEditingItem(null);
      setEditData(null);
      await loadPricing();
    } catch (error) {
      console.error('Error saving pricing:', error);
      pushToast({title: t('messages.saveError')});
    } finally {
      setSaving(false);
    }
  };

  // Reset to default pricing
  const handleReset = async (item: PricingItem) => {
    if (!item.override_id) return;
    if (!confirm(t('messages.confirmReset'))) return;

    try {
      const response = await fetch(`/api/admin/pricing?id=${item.override_id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to reset');

      pushToast({title: t('messages.resetSuccess')});
      await loadPricing();
    } catch (error) {
      console.error('Error resetting pricing:', error);
      pushToast({title: t('messages.resetError')});
    }
  };

  // Calculate interpolated preview prices
  const getPreviewPrices = () => {
    if (!editData) return [];

    const samples = [75, 150, 200, 400];
    return samples.map((qty) => {
      let price = 0;

      if (qty <= editData.tier_1_quantity) {
        price = editData.tier_1_price;
      } else if (qty <= editData.tier_2_quantity) {
        // Interpolate between tier 1 and tier 2
        const ratio =
          (qty - editData.tier_1_quantity) /
          (editData.tier_2_quantity - editData.tier_1_quantity);
        price =
          editData.tier_1_price +
          (editData.tier_2_price - editData.tier_1_price) * ratio;
      } else if (qty <= editData.tier_3_quantity) {
        // Interpolate between tier 2 and tier 3
        const ratio =
          (qty - editData.tier_2_quantity) /
          (editData.tier_3_quantity - editData.tier_2_quantity);
        price =
          editData.tier_2_price +
          (editData.tier_3_price - editData.tier_2_price) * ratio;
      } else {
        price = editData.tier_3_price;
      }

      return {quantity: qty, price: price.toFixed(2)};
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-[#0a0a0a] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('title')}</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">{t('subtitle')}</p>
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
              placeholder={t('filter.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-slate-900 placeholder-slate-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-[#171717] dark:text-white dark:placeholder-slate-400"
            />
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="space-y-4">
          {filteredPricing.map((item) => (
            <div
              key={`${item.product_id}-${item.method_id}`}
              className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-[#171717]"
            >
              {/* Product & Method Info */}
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {tProducts(item.product_name.split('.').slice(1).join('.'))}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t('table.method')}:{' '}
                    {tProducts(item.method_name.split('.').slice(1).join('.'))}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {item.has_override ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      {t('table.modified')}
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      {t('table.default')}
                    </span>
                  )}
                </div>
              </div>

              {/* Price Tiers */}
              <div className="mb-4 grid gap-3 sm:grid-cols-3">
                {item.tiers.slice(0, 3).map((tier, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg bg-slate-50 p-4 dark:bg-[#0a0a0a]"
                  >
                    <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                      {t('table.tier', {number: idx + 1})}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {tier.minQuantity} {t('table.quantity')}
                    </p>
                    <p className="mt-1 text-lg font-bold text-brand">
                      {formatPrice(tier.unitPrice, locale)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-700">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {item.updated_at && (
                    <>
                      {t('table.lastUpdated')}{' '}
                      {new Date(item.updated_at).toLocaleDateString('fr-FR')}
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit2 size={16} className="mr-1" />
                    Modifier
                  </Button>
                  {item.has_override && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleReset(item)}
                    >
                      <RotateCcw size={16} className="mr-1" />
                      {t('edit.reset')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPricing.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              Aucun produit trouvé
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && editData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-[#171717]">
            {/* Modal Header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {t('edit.title')}
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {tProducts(editingItem.product_name.split('.').slice(1).join('.'))} -{' '}
                {tProducts(editingItem.method_name.split('.').slice(1).join('.'))}
              </p>
            </div>

            {/* Tier Inputs */}
            <div className="mb-6 space-y-4">
              {[1, 2, 3].map((tierNum) => (
                <div
                  key={tierNum}
                  className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                >
                  <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">
                    {t('edit.subtitle', {number: tierNum})}
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t('edit.quantityLabel')}
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={editData[`tier_${tierNum}_quantity` as keyof EditingData]}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            [`tier_${tierNum}_quantity`]: parseInt(e.target.value) || 0
                          })
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-600 dark:bg-[#0a0a0a] dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        {t('edit.priceLabel')}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editData[`tier_${tierNum}_price` as keyof EditingData]}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            [`tier_${tierNum}_price`]: parseFloat(e.target.value) || 0
                          })
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-600 dark:bg-[#0a0a0a] dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Preview */}
            <div className="mb-6 rounded-lg bg-slate-50 p-4 dark:bg-[#0a0a0a]">
              <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                {t('edit.preview')}
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {getPreviewPrices().map((sample) => (
                  <p
                    key={sample.quantity}
                    className="text-sm text-slate-600 dark:text-slate-400"
                  >
                    {t('edit.previewItem', {
                      quantity: sample.quantity,
                      price: sample.price
                    })}
                  </p>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setEditingItem(null);
                  setEditData(null);
                }}
                disabled={saving}
              >
                <X size={16} className="mr-1" />
                {t('edit.cancel')}
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={saving}
              >
                <Check size={16} className="mr-1" />
                {saving ? 'Sauvegarde...' : t('edit.save')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
