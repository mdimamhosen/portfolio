import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

const expertiseAreas = [
  {
    title: "Mobile App Development",
    description: "Cross-platform apps with React Native & Expo for iOS and Android",
    icon: "📱",
  },
  {
    title: "AI Agent Systems",
    description: "Building autonomous agents that reason, plan, and execute complex tasks",
    icon: "🤖",
  },
  {
    title: "Full-Stack Architecture",
    description: "Scalable APIs and microservices with Go, Node.js, and cloud infrastructure",
    icon: "🔧",
  },
];

const SkillsExpertise = () => {
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
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.15,
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
        <p className="text-mono mb-2 md:mb-4 opacity-60 text-xs sm:text-sm">03 / Expertise</p>
        <h2 ref={headingRef} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-12 text-center lg:text-left">
          Core <span className="text-primary text-glow">Strengths</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
          {expertiseAreas.map((item, i) => (
            <div
              key={i}
              ref={(el) => (cardsRef.current[i] = el)}
              className="glass-card p-4 md:p-6 lg:p-8 group hover:border-primary/30 transition-all duration-500"
            >
              <div className="text-3xl md:text-4xl lg:text-5xl mb-3 md:mb-4">{item.icon}</div>
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-2 md:mb-3 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm md:text-base">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsExpertise;
