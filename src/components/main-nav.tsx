'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Gem, User } from 'lucide-react';

export function MainNav() {
  const pathname = usePathname();
  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/updates', label: 'Mise à jour' },
    { href: '/library', label: 'Bibliothèque' },
  ];

  return (
    <>
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
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="Page d'accueil Edoxia-TCG"
        >
          <Gem className="h-6 w-6 text-primary" />
          <span className="hidden font-headline text-lg font-bold sm:inline-block">
            Edoxia-TCG
          </span>
        </Link>
      </div>
      <div className="ml-auto flex items-center">
        <button className="" disabled>
          <User className="h-5 w-5 text-muted-foreground" />
          <span className="sr-only">Profil</span>
        </button>
      </div>
    </>
  );
}
