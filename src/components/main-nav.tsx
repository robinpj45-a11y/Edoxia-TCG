'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AuthButtons } from './auth-buttons';
import { useUser } from '@/firebase';

export function MainNav() {
  const pathname = usePathname();
  const { user } = useUser();
  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/updates', label: 'Mise à jour' },
    { href: '/library', label: 'Les cartes' },
  ];

  return (
    <div className="flex w-full items-center px-6">
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
        {user && (
          <Link
            href="/my-collection"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname === '/my-collection'
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            Ma collection
          </Link>
        )}
      </nav>
      <div className="ml-auto flex items-center space-x-4">
        <AuthButtons />
      </div>
    </div>
  );
}
