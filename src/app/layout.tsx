import type { Metadata } from 'next';
import './globals.css';
import { MainNav } from '@/components/main-nav';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Edoxia-TCG',
  description: 'A mystical trading card game.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Lora&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-background font-body antialiased">
        <header className="sticky top-0 z-40 w-full">
          <div className="container relative flex h-16 items-center">
            <MainNav />
          </div>
        </header>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
