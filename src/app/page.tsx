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
        <h1 className="font-headline text-8xl font-bold tracking-tighter text-white drop-shadow-lg">
          Edoxia-TCG
        </h1>
      </div>
    </div>
  );
}
