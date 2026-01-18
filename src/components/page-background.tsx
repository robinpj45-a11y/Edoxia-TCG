'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function PageBackground() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    if (isHomePage) {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundAttachment = '';
      document.body.style.backgroundPosition = '';
    } else {
      document.body.style.backgroundImage = `url(/dark-blue-water.jpg)`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundAttachment = 'fixed';
      document.body.style.backgroundPosition = 'center';
    }

    // Cleanup function to reset styles
    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundAttachment = '';
      document.body.style.backgroundPosition = '';
    };
  }, [isHomePage]);

  return null;
}
