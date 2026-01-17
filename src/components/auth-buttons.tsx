'use client';

import Link from 'next/link';
import { useUser, useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function AuthButtons() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleSignOut = () => {
    if (auth) {
      auth.signOut();
    }
  };

  if (isUserLoading) {
    return <Skeleton className="h-10 w-24" />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">{user.email}</span>
        <Button variant="ghost" onClick={handleSignOut}>
          Se déconnecter
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost">
        <Link href="/login">Se connecter</Link>
      </Button>
      <Button asChild>
        <Link href="/signup">S'inscrire</Link>
      </Button>
    </div>
  );
}
