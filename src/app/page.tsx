import NavigationHeader from '@/components/sections/navigation-header';
import HeroGeneratorSection from '@/components/sections/hero-generator-section';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationHeader />
      <main className="flex-1">
        <HeroGeneratorSection />
      </main>
    </div>
  );
}