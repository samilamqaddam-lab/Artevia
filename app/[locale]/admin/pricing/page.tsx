'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/Button';
import {useToast} from '@/components/Providers';
import {Edit2, RotateCcw, Check, X, Search, Plus, Trash2} from 'lucide-react';
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

type EditTier = {
  quantity: string;
  price: string;
};

type EditingData = {
  product_id: string;
  method_id: string;
  tiers: EditTier[];
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      tiers: item.tiers.map((tier) => ({
        quantity: tier.minQuantity.toString(),
        price: tier.unitPrice.toString()
      }))
    });
  };

  // Add a new tier
  const handleAddTier = () => {
    if (!editData) return;
    const lastTier = editData.tiers[editData.tiers.length - 1];
    const lastQuantity = lastTier ? parseFloat(lastTier.quantity) || 0 : 0;
    const lastPrice = lastTier ? parseFloat(lastTier.price) || 0 : 0;
    setEditData({
      ...editData,
      tiers: [
        ...editData.tiers,
        {
          quantity: (lastQuantity + 100).toString(),
          price: (lastPrice * 0.9).toFixed(2)
        }
      ]
    });
  };

  // Remove a tier
  const handleRemoveTier = (index: number) => {
    if (!editData || editData.tiers.length <= 1) return;
    setEditData({
      ...editData,
      tiers: editData.tiers.filter((_, i) => i !== index)
    });
  };

  // Update tier value
  const handleUpdateTier = (index: number, field: 'quantity' | 'price', value: string) => {
    if (!editData) return;
    const newTiers = [...editData.tiers];
    newTiers[index] = {...newTiers[index], [field]: value};
    setEditData({...editData, tiers: newTiers});
  };

  // Save price override
  const handleSave = async () => {
    if (!editData) return;

    // Convert strings to numbers
    const tiersAsNumbers = editData.tiers.map((tier) => ({
      quantity: parseFloat(tier.quantity),
      price: parseFloat(tier.price)
    }));

    // Validate all values are valid numbers
    for (let i = 0; i < tiersAsNumbers.length; i++) {
      if (isNaN(tiersAsNumbers[i].quantity) || isNaN(tiersAsNumbers[i].price)) {
        pushToast({title: t('messages.invalidFields')});
        return;
      }
    }

    // Validate all values are positive
    for (const tier of tiersAsNumbers) {
      if (tier.quantity <= 0 || tier.price <= 0) {
        pushToast({title: t('messages.invalidValues')});
        return;
      }
    }

    // Validate quantities are in ascending order
    for (let i = 1; i < tiersAsNumbers.length; i++) {
      if (tiersAsNumbers[i].quantity <= tiersAsNumbers[i - 1].quantity) {
        pushToast({title: t('messages.invalidQuantities')});
        return;
      }
    }

    try {
      setSaving(true);
      const response = await fetch('/api/admin/pricing', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          product_id: editData.product_id,
          method_id: editData.method_id,
          price_tiers: {
            tiers: tiersAsNumbers
          }
        })
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
                  {item.has_override && (
                    <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
                      {t('status.customized')}
                    </span>
                  )}
                  <Button variant="secondary" size="sm" onClick={() => handleEdit(item)}>
                    <Edit2 size={16} className="mr-1" />
                    {t('actions.edit')}
                  </Button>
                  {item.has_override && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReset(item)}
                    >
                      <RotateCcw size={16} className="mr-1" />
                      {t('actions.reset')}
                    </Button>
                  )}
                </div>
              </div>

              {/* Price Tiers Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="px-4 py-2 text-left text-sm font-medium text-slate-600 dark:text-slate-400">
                        {t('table.quantity')}
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-slate-600 dark:text-slate-400">
                        {t('table.unitPrice')}
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-slate-600 dark:text-slate-400">
                        {t('table.totalPrice')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.tiers.map((tier, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-100 dark:border-slate-800"
                      >
                        <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                          {tier.minQuantity}+
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                          {formatPrice(tier.unitPrice, locale)}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {formatPrice(tier.unitPrice * tier.minQuantity, locale)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {editingItem && editData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-[#171717]">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {t('edit.title')}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {tProducts(editingItem.product_name.split('.').slice(1).join('.'))} -{' '}
                    {tProducts(editingItem.method_name.split('.').slice(1).join('.'))}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setEditData(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Tier Inputs */}
              <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Paliers de prix
                  </h3>
                  <Button variant="secondary" size="sm" onClick={handleAddTier}>
                    <Plus size={16} className="mr-1" />
                    Ajouter un palier
                  </Button>
                </div>

                {editData.tiers.map((tier, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                  >
                    <div className="flex-1">
                      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Quantité min.
                      </label>
                      <input
                        type="number"
                        value={tier.quantity}
                        onChange={(e) =>
                          handleUpdateTier(index, 'quantity', e.target.value)
                        }
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-600 dark:bg-[#0a0a0a] dark:text-white"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Prix unitaire (MAD)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={tier.price}
                        onChange={(e) =>
                          handleUpdateTier(index, 'price', e.target.value)
                        }
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-600 dark:bg-[#0a0a0a] dark:text-white"
                      />
                    </div>
                    {editData.tiers.length > 1 && (
                      <button
                        onClick={() => handleRemoveTier(index)}
                        className="mt-6 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEditingItem(null);
                    setEditData(null);
                  }}
                >
                  <X size={16} className="mr-1" />
                  {t('actions.cancel')}
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  <Check size={16} className="mr-1" />
                  {saving ? t('actions.saving') : t('actions.save')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
