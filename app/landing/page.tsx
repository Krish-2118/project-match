"use client";

import dynamic from "next/dynamic";

const AppBar = dynamic(() => import("../components/shared/AppBar"), { ssr: false });
const Hero = dynamic(() => import("../components/shared/Home/Hero"), { ssr: false });
const Marquee = dynamic(() => import("../components/shared/Home/Marquee"), { ssr: false });
const About = dynamic(() => import("../components/shared/Home/About"), { ssr: false });
const Features = dynamic(() => import("../components/shared/Home/Features"), { ssr: false });
const FeaturedProject = dynamic(() => import("../components/shared/Home/ConnectMode"), { ssr: false });
const AppFlow = dynamic(() => import("../components/shared/Home/AppFlow"), { ssr: false });
const PremiumFooter = dynamic(() => import("../components/shared/Home/PremiumFooter"), { ssr: false });
const Menu = dynamic(() => import("../components/shared/Menu"), { ssr: false });
const TechnicalMesh = dynamic(() => import("../components/shared/TechnicalMesh"), { ssr: false });
const PerimeterDecals = dynamic(() => import("../components/shared/PerimeterDecals"), { ssr: false });

export default function LandingPage() {
  return (
    <div className="h-[100dvh] overflow-y-auto overflow-x-hidden overscroll-y-auto text-white relative selection:bg-primary selection:text-white">
      <TechnicalMesh />
      <PerimeterDecals />
      <div className="noise-overlay" />
      <div className="grid-background" />
      <Menu />
      <AppBar />
      
      {/* The main content sits above the fixed footer */}
      <div className="relative z-10 shadow-[0_40px_100px_rgba(0,0,0,1)] flex flex-col">
        <Hero />
        <Marquee />
        <About />
        <Features />
        <FeaturedProject />
        <AppFlow />
      </div>

      {/* The footer is revealed from behind via parallax */}
      <PremiumFooter />
    </div>
  );
}
