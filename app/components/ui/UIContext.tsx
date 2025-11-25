'use client';

import React, { createContext, useContext, useState } from 'react';

type UIContextValue = {
  showShell: boolean;
  setShowShell: (v: boolean) => void;
  title: string;
  setTitle: (t: string) => void;
};

const UIContext = createContext<UIContextValue | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [showShell, setShowShell] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('Fitness Dashboard');

  return (
    <UIContext.Provider value={{ showShell, setShowShell, title, setTitle }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}