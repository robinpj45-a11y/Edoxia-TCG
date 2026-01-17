import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/placeholder background 1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
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
