import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { Globe, Layers, Smartphone, Zap, Database, Shield } from 'lucide-react';

const webCapabilities = [
  {
    icon: Smartphone,
    title: "Mobile Apps (Expo)",
    description: "Cross-platform iOS & Android apps with React Native and Expo",
  },
  {
    icon: Globe,
    title: "Progressive Web Apps",
    description: "Offline-capable, installable web applications with native-like experience",
  },
  {
    icon: Layers,
    title: "Full-Stack Development",
    description: "End-to-end solutions from database design to pixel-perfect frontends",
  },
  {
    icon: Zap,
    title: "Performance First",
    description: "Optimized for Core Web Vitals with sub-second load times",
  },
  {
    icon: Database,
    title: "Real-time Systems",
    description: "WebSocket-powered applications with live data synchronization",
  },
  {
    icon: Shield,
    title: "Secure Architecture",
    description: "Auth, encryption, and security best practices built-in from day one",
  },
];

const WebAppShowcase = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        }
      );

      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="h-full flex flex-col justify-center px-4 sm:px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto w-full content-overlay">
        <p className="text-mono mb-2 md:mb-4 opacity-60 text-xs sm:text-sm">08 / Web & Mobile Apps</p>
        <h2 ref={headingRef} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 text-center lg:text-left">
          Web & Mobile <span className="text-primary text-glow">Applications</span>
        </h2>
        <p className="text-muted-foreground mb-4 md:mb-8 max-w-2xl text-xs sm:text-sm md:text-base">
          Crafting modern web and mobile experiences that combine stunning design 
          with robust engineering for scalable, production-ready applications.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 lg:gap-6">
          {webCapabilities.map((item, i) => (
            <div
              key={item.title}
              ref={(el) => (cardsRef.current[i] = el)}
              className="glass-card p-3 md:p-4 lg:p-6 group hover:border-primary/30 transition-all duration-500"
            >
              <item.icon className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-primary mb-2 md:mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-sm md:text-base lg:text-lg font-semibold mb-1 md:mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-[10px] sm:text-xs md:text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebAppShowcase;
