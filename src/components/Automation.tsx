import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { Workflow, Zap, Bot, Cog, ArrowRight } from 'lucide-react';

const automationSteps = [
  {
    step: "01",
    title: "Data Collection",
    description: "Automated scraping & API integration",
    icon: Workflow,
  },
  {
    step: "02",
    title: "AI Processing",
    description: "Intelligent data transformation",
    icon: Bot,
  },
  {
    step: "03",
    title: "Workflow Automation",
    description: "n8n powered task orchestration",
    icon: Cog,
  },
  {
    step: "04",
    title: "Delivery",
    description: "Real-time notifications & reports",
    icon: Zap,
  },
];

const stats = [
  { value: "50+", label: "Workflows Built" },
  { value: "100+", label: "Tasks Automated" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Monitoring" },
];

const Automation = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        }
      );

      stepsRef.current.forEach((step, index) => {
        if (step) {
          gsap.fromTo(
            step,
            { opacity: 0, y: 30, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              delay: index * 0.15,
              ease: "back.out(1.5)",
              scrollTrigger: {
                trigger: step,
                start: "top 85%",
              },
            }
          );
        }
      });

      statsRef.current.forEach((stat, index) => {
        if (stat) {
          gsap.fromTo(
            stat,
            { opacity: 0, scale: 0.8 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              delay: index * 0.1,
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: stat,
                start: "top 90%",
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="h-full flex flex-col justify-center px-4 sm:px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto w-full content-overlay">
        <p className="text-mono mb-2 opacity-60 text-xs sm:text-sm">06 / Automation</p>
        <h2 ref={headingRef} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-8 text-center lg:text-left">
          Workflow <span className="text-primary text-glow">Automation</span>
        </h2>

        {/* Timeline Steps */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-8">
          {automationSteps.map((item, index) => (
            <div
              key={item.step}
              ref={(el) => (stepsRef.current[index] = el)}
              className="glass-card p-2.5 md:p-4 rounded-xl group hover:border-primary/50 transition-all duration-300 relative"
            >
              <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-3.5 h-3.5 md:w-5 md:h-5 text-primary" />
                </div>
                <span className="text-[10px] md:text-xs text-muted-foreground font-mono">{item.step}</span>
              </div>
              <h3 className="text-xs md:text-base font-semibold mb-0.5 md:mb-1">{item.title}</h3>
              <p className="text-[10px] md:text-xs text-muted-foreground">{item.description}</p>
              
              {index < automationSteps.length - 1 && (
                <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
              )}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              ref={(el) => (statsRef.current[index] = el)}
              className="glass-card p-2.5 md:p-4 rounded-xl text-center"
            >
              <div className="text-lg md:text-2xl lg:text-3xl font-bold text-primary text-glow mb-0.5 md:mb-1">
                {stat.value}
              </div>
              <div className="text-[10px] md:text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Automation;
