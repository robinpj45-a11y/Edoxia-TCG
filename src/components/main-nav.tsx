'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

export function MainNav() {
  const pathname = usePathname();
  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/updates', label: 'Mise à jour' },
    { href: '/library', label: 'Bibliothèque' },
  ];

  return (
    <div className="flex w-full items-center justify-between">
      <nav className="flex items-center space-x-4 lg:space-x-6 ml-6">
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
      <div className="flex items-center">
        <button className="" disabled>
          <User className="h-5 w-5 text-muted-foreground" />
          <span className="sr-only">Profil</span>
        </button>
      </div>
    </div>
  );
}
