"use client";

import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { Code, LayoutDashboard, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTerminal } from '@/contexts/TerminalContext';

export function Header() {
  const { toggleTerminal } = useTerminal();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Code className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Eyob's API Portfolio</span>
        </Link>
        <nav className="flex items-center space-x-2 sm:space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center space-x-1">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/api-explorer" className="flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h12v4"/><path d="M4 12v8h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.34"/><path d="M16 12h-2.34"/><path d="M10.66 12H8"/><circle cx="18" cy="18" r="2"/><circle cx="6" cy="6" r="2"/></svg>
              <span>API Explorer</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleTerminal} title="Toggle Terminal (Ctrl + ~)">
            <Terminal className="h-5 w-5" />
            <span className="sr-only">Toggle Terminal</span>
          </Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
