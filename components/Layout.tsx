"use client";
// src/components/Layout.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconMenu2, IconX } from '@tabler/icons-react';
import Link from 'next/link';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header with hamburger menu */}
      <header className="bg-slate-900 text-white p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Text Editor PWA</h1>
        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className="p-2 focus:outline-none"
          aria-label={isDrawerOpen ? 'Close menu' : 'Open menu'}
        >
          {isDrawerOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
        </button>
      </header>

      {/* Navigation drawer */}
      <nav
        className={`fixed top-0 left-0 h-full w-64 bg-slate-800 text-white transform ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="p-4">
          <h2 className="text-xl font-semibold">Menu</h2>
          <ul className="mt-4 space-y-2">
            <li>
              <Link href="/" className="block p-2 hover:bg-slate-700 rounded">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="block p-2 hover:bg-slate-700 rounded">
                About
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Editor</CardTitle>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </main>
    </div>
  );
}