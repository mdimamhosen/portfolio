import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { GitBranch, Database, Cpu, Cloud, CheckCircle } from 'lucide-react';

const timelineSteps = [
  {
    step: "01",
    title: "Data Ingestion",
    description: "Automated collection from APIs, webhooks, and databases",
    icon: Database,
  },
  {
    step: "02",
    title: "AI Processing",
    description: "Intelligent transformation using custom AI models",
    icon: Cpu,
  },
  {
    step: "03",
    title: "Workflow Orchestration",
    description: "Complex CRM workflows with conditional logic",
    icon: GitBranch,
  },
  {
    step: "04",
    title: "Cloud Integration",
    description: "Seamless delivery with real-time monitoring",
    icon: Cloud,
  },
  {
    step: "05",
    title: "Validation & Delivery",
    description: "Quality checks and automated reporting",
    icon: CheckCircle,
  },
];

const AutomationTimeline = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);

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

      // Animate vertical line growing
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.5,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 70%",
          },
        }
      );

      // Animate each step
      stepRefs.current.forEach((step, index) => {
        if (step) {
          gsap.fromTo(
            step,
            { 
              opacity: 0, 
              x: index % 2 === 0 ? -30 : 30,
              scale: 0.9
            },
            {
              opacity: 1,
              x: 0,
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="h-full flex flex-col justify-center px-4 sm:px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto w-full content-overlay">
        <p className="text-mono mb-2 opacity-60 text-xs sm:text-sm">06 / Pipeline</p>
        <h2 ref={headingRef} className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-center lg:text-left">
          Automation <span className="text-primary text-glow">Pipeline</span>
        </h2>

        {/* Vertical Timeline - Responsive */}
        <div ref={timelineRef} className="relative py-2">
          {/* Vertical center line */}
          <div
            ref={lineRef}
            className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 origin-top bg-gradient-to-b from-primary via-primary/60 to-primary/20"
          />

          {/* Steps */}
          <div className="flex flex-col gap-3 md:gap-4">
            {timelineSteps.map((item, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div
                  key={item.step}
                  ref={(el) => (stepRefs.current[index] = el)}
                  className="relative flex items-start md:items-center gap-3 md:gap-4"
                >
                  {/* Mobile: All items on right of line */}
                  {/* Desktop: Alternating left/right */}
                  
                  {/* Left content (desktop only) */}
                  <div className={`hidden md:block flex-1 ${isLeft ? 'text-right pr-6' : ''}`}>
                    {isLeft && (
                      <div className="glass-card p-3 rounded-xl group hover:border-primary/30 transition-all duration-300 inline-block ml-auto max-w-[240px]">
                        <span className="text-[10px] text-primary font-mono">{item.step}</span>
                        <h3 className="text-sm font-semibold mt-0.5 mb-0.5 group-hover:text-primary transition-colors">{item.title}</h3>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Center Node */}
                  <div className="relative z-10 w-8 h-8 rounded-full bg-background border-2 border-primary/50 flex items-center justify-center shrink-0 hover:border-primary hover:scale-110 hover:bg-primary/10 transition-all duration-300 ml-0 md:ml-0">
                    <item.icon className="w-3.5 h-3.5 text-primary" />
                  </div>

                  {/* Right content (desktop: only odd items, mobile: all items) */}
                  <div className={`flex-1 ${!isLeft ? 'md:text-left md:pl-6' : 'md:hidden'}`}>
                    <div className="glass-card p-3 rounded-xl group hover:border-primary/30 transition-all duration-300 max-w-[240px] md:max-w-[240px]">
                      <span className="text-[10px] text-primary font-mono">{item.step}</span>
                      <h3 className="text-sm font-semibold mt-0.5 mb-0.5 group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  {/* Empty space for desktop right side when item is on left */}
                  {isLeft && <div className="hidden md:block flex-1" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 text-center max-w-xl mx-auto">
          <p className="text-xs text-muted-foreground">
            End-to-end automation pipelines powered by cutting-edge AI.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AutomationTimeline;