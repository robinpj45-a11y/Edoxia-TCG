'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Gem } from 'lucide-react';

export function MainNav() {
  const pathname = usePathname();
  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/library', label: 'Bibliothèque' },
  ];

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <Gem className="h-6 w-6 text-primary" />
        <span className="font-headline text-lg font-bold">Edoxia-TCG</span>
      </div>
      <nav className="flex items-center space-x-4 lg:space-x-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname === link.href ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
