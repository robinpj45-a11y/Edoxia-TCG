import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const homeBg = PlaceHolderImages.find((img) => img.id === 'home-background');

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden">
      {homeBg && (
        <Image
          src={homeBg.imageUrl}
          alt={homeBg.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={homeBg.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <Image
          src="/edoxia-logo.svg"
          alt="Logo Edoxia"
          width={600}
          height={600}
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
