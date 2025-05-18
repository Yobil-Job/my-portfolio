"use client";

import React from 'react';
import { Provider as WrapBalancerProvider } from 'react-wrap-balancer';

export function BalancerProvider({ children }: { children: React.ReactNode }) {
  return (
    <WrapBalancerProvider>
      {children}
    </WrapBalancerProvider>
  );
}
