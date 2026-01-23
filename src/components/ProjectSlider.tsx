import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const projects = [
  {
    title: "AI Agent Platform",
    description: "Autonomous AI agents for task automation with multi-agent orchestration and RAG systems",
    tech: ["React Native", "Expo", "LangChain", "Go", "PostgreSQL"],
    gradient: "from-primary/20 to-accent/20",
  },
  {
    title: "Mobile Fintech App",
    description: "Cross-platform mobile banking app with real-time transactions and biometric auth",
    tech: ["React Native", "Expo", "Node.js", "MongoDB", "Socket.io"],
    gradient: "from-accent/20 to-primary/20",
  },
  {
    title: "Enterprise Dashboard",
    description: "Real-time analytics dashboard with complex data visualizations and role-based access",
    tech: ["Next.js", "TypeScript", "Go", "PostgreSQL"],
    gradient: "from-primary/20 to-muted/40",
  },
  {
    title: "AI Workflow Engine",
    description: "Intelligent automation platform processing 10K+ tasks daily with n8n and custom AI models",
    tech: ["Next.js", "n8n", "OpenAI", "Prisma"],
    gradient: "from-muted/40 to-primary/20",
  },
];

const ProjectSlider = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      gsap.to(sliderRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.2,
        onComplete: () => {
          gsap.to(sliderRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power4.out",
          });
        },
      });
    }
  }, [currentIndex]);

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const project = projects[currentIndex];

  return (
    <div ref={sectionRef} className="h-full flex flex-col justify-center px-4 sm:px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto w-full content-overlay">
        <div ref={headingRef} className="mb-6 md:mb-10">
          <p className="text-mono mb-2 md:mb-4 opacity-60 text-xs sm:text-sm">04 / Projects</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
            Featured <span className="text-primary text-glow">Work</span>
          </h2>
          <p className="text-muted-foreground mt-2 md:mt-4 max-w-xl text-sm md:text-base">
            A selection of projects showcasing expertise in mobile apps, AI agents, and full-stack systems.
          </p>
        </div>

        <div className="relative">
          <div
            ref={sliderRef}
            className={`glass-card p-4 sm:p-6 md:p-10 relative overflow-hidden bg-gradient-to-br ${project.gradient}`}
          >
            <span className="absolute top-2 right-4 sm:top-4 sm:right-6 text-4xl sm:text-6xl md:text-8xl font-bold text-muted/10">
              0{currentIndex + 1}
            </span>

            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl md:text-4xl font-bold mb-2 md:mb-4">{project.title}</h3>
              <p className="text-muted-foreground text-sm md:text-lg mb-4 md:mb-6 max-w-2xl">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 md:gap-3">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 md:px-4 py-1 md:py-2 text-[10px] sm:text-xs md:text-sm bg-muted/50 rounded-full border border-border"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-4 md:mt-6">
            <div className="flex gap-1.5 md:gap-2">
              {projects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'bg-primary w-5 md:w-8' : 'bg-muted hover:bg-muted-foreground'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2 md:gap-3">
              <button
                onClick={prevProject}
                className="w-9 h-9 md:w-12 md:h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted/50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button
                onClick={nextProject}
                className="w-9 h-9 md:w-12 md:h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted/50 transition-colors"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSlider;
