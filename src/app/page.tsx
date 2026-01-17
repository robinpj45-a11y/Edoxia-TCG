import { Gem } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const bgImage = PlaceHolderImages.find((img) => img.id === 'home-background');

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full">
      {bgImage ? (
        <Image
          src={bgImage.imageUrl}
          alt="Background"
          fill
          className="object-cover"
          data-ai-hint={bgImage.imageHint}
          priority
        />
      ) : (
        <div className="h-full w-full bg-black" />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
        <Gem className="h-24 w-24 text-primary" />
        <h1 className="mt-4 font-headline text-7xl font-bold tracking-tighter md:text-8xl lg:text-9xl">
          Edoxia-TCG
        </h1>
      </div>
    </div>
  );
}
