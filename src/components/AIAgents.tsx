import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { Bot, Brain, Cpu, Network, Sparkles, Workflow } from 'lucide-react';

const agentCapabilities = [
  {
    icon: Bot,
    title: "Autonomous Agents",
    description: "Self-operating AI systems that make decisions and take actions independently",
  },
  {
    icon: Brain,
    title: "Multi-Agent Systems",
    description: "Orchestrating multiple AI agents working together on complex tasks",
  },
  {
    icon: Workflow,
    title: "Agentic Workflows",
    description: "Designing AI-powered workflows that adapt and learn from outcomes",
  },
  {
    icon: Network,
    title: "RAG Systems",
    description: "Retrieval-Augmented Generation for context-aware AI responses",
  },
  {
    icon: Cpu,
    title: "LLM Integration",
    description: "Seamless integration with GPT-4, Claude, and open-source models",
  },
  {
    icon: Sparkles,
    title: "Prompt Engineering",
    description: "Crafting optimized prompts for reliable AI behavior and outputs",
  },
];

const AIAgents = () => {
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
        { opacity: 0, y: 40, rotateY: -15 },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
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
        <p className="text-mono mb-2 md:mb-4 opacity-60 text-xs sm:text-sm">07 / AI Agents</p>
        <h2 ref={headingRef} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 text-center lg:text-left">
          Agentic <span className="text-primary text-glow">AI</span>
        </h2>
        <p className="text-muted-foreground mb-4 md:mb-8 max-w-2xl text-xs sm:text-sm md:text-base">
          Building intelligent systems that go beyond simple automation — 
          autonomous agents that reason, plan, and execute complex tasks.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 lg:gap-6">
          {agentCapabilities.map((item, i) => (
            <div
              key={item.title}
              ref={(el) => (cardsRef.current[i] = el)}
              className="glass-card p-3 md:p-4 lg:p-6 group hover:border-primary/30 transition-all duration-500 perspective-1000"
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

export default AIAgents;
