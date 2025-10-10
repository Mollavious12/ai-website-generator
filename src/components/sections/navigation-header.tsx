import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const NavigationHeader = () => {
  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-border bg-gray-50 px-8 py-4">
      {/* Left section: Logo */}
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-icon-background p-1.5">
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/0ef6c2bf-705a-4e28-8b85-4f0f9121de1d-ai-website-generator-tubeguruji-com/assets/svgs/logo-1.svg?"
            alt="AI Website Generator Logo"
            width={20}
            height={20}
            className="h-full w-full"
          />
        </div>
        <h2 className="text-xl font-semibold text-foreground">AI Website Generator</h2>
      </Link>

      {/* Center section: Navigation Links */}
      <nav className="flex items-center gap-8">
        <Link href="#" className="nav-link text-gray-600 hover:text-black transition-colors">
          Pricing
        </Link>
        <Link href="#" className="nav-link text-gray-600 hover:text-black transition-colors">
          Contact us
        </Link>
      </nav>

      {/* Right section: CTA Button */}
      <Link
        href="#"
        className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <span className="button-text">Get Started</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </header>
  );
};

export default NavigationHeader;