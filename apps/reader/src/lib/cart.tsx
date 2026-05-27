'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type CartItem = {
  id: string;
  title: string;
  price: string;
};

type CartCtx = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
  isOpen: boolean;
  lastAdded: CartItem | null;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastAdded, setLastAdded] = useState<CartItem | null>(null);

  const add = useCallback((item: CartItem) => {
    setItems((prev) => [...prev, item]);
    setLastAdded(item);
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartCtx>(
    () => ({
      items,
      add,
      remove,
      clear,
      count: items.length,
      isOpen: items.length > 0,
      lastAdded,
    }),
    [items, add, remove, clear, lastAdded]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
