"use client";

import React, { useState, useEffect } from 'react';
import { HiddenTerminal } from './HiddenTerminal';

export function ClientOnlyHiddenTerminal() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <HiddenTerminal />;
}
