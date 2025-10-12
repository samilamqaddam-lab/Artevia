/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import type {QuoteMode} from '@/types/quote';
import {generateId} from '@/lib/utils';

// Mock storage for SSR
const createNoopStorage = () => ({
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
});

export type QuoteItem = {
  id: string;
  productId: string;
  quantity: number;
  methodId: string;
  zoneId: string;
  leadTimeId: string;
  colorCount: number;
  colorwayId: string;
  mode: QuoteMode;
  projectId?: string;
  previewDataUrl?: string;
  batUrl?: string;
  notes?: string;
};

type QuoteState = {
  items: QuoteItem[];
  addItem: (payload: Omit<QuoteItem, 'id'> & {id?: string}) => QuoteItem;
  updateItem: (id: string, changes: Partial<QuoteItem>) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  totalQuantity: () => number;
};

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: ({id, ...payload}) => {
        const newItem: QuoteItem = {
          id: id ?? generateId(),
          ...payload
        };
        set({items: [...get().items, newItem]});
        return newItem;
      },
      updateItem: (id, changes) =>
        set({
          items: get().items.map((item) => (item.id === id ? {...item, ...changes} : item))
        }),
      removeItem: (id) => set({items: get().items.filter((item) => item.id !== id)}),
      clear: () => set({items: []}),
      totalQuantity: () => get().items.reduce((sum, item) => sum + item.quantity, 0)
    }),
    {
      name: 'artevia-rfq',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? window.localStorage : createNoopStorage()))
    }
  )
);
