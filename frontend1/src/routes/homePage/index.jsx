import { FeaturesSection } from "./FeaturesSection";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { HeroSection } from "./HeroSection";


export function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}