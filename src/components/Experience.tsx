import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { Briefcase, Calendar, MapPin, Code, ChevronRight } from "lucide-react";

const experiences = [
  {
    company: "Hashthink Technologies",
    role: "Software Engineer",
    location: "Canada (Remote)",
    period: "March 2026 - May 2026",
    technologies: ["RAG Systems", "LangChain", "Twilio API", "AI Agents", "LLMs", "Workflows"],
    highlights: [
      "Engineered advanced Retrieval-Augmented Generation (RAG) pipelines and LLM-powered multi-agent systems using LangChain, improving contextual response accuracy.",
      "Designed and integrated real-time communication modules and webhook integrations utilizing Twilio APIs.",
      "Created autonomous AI agents for executing complex web operations and system tasks, cutting manual process times significantly.",
      "Optimized query routing and semantic document indexing with vector databases for high-speed retrieval."
    ]
  },
  {
    company: "RixoTech",
    role: "Full Stack Engineer",
    location: "Remote",
    period: "January 2025 - December 2025",
    technologies: ["React", "Next.js", "Node.js", "Go", "PostgreSQL", "Docker", "AWS", "REST APIs"],
    highlights: [
      "Architected and deployed high-performance, full-stack web applications and cloud-native services for international clients.",
      "Built scalable microservices and robust RESTful APIs in Go and Node.js with optimized PostgreSQL database schemas.",
      "Streamlined deployment processes with Docker containers, AWS integrations, and automated CI/CD pipelines.",
      "Collaborated with design and product teams to translate premium UI/UX mockups into production-grade, responsive code."
    ]
  }
];

const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in header elements
      gsap.fromTo(
        [headingRef.current, subtitleRef.current],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );

      // Animate vertical timeline line
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 70%",
          },
        }
      );

      // Fade in timeline items
      itemsRef.current.forEach((item, index) => {
        if (item) {
          gsap.fromTo(
            item,
            { opacity: 0, x: -30 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              delay: index * 0.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 80%",
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="section-container h-full flex flex-col justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-16 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto w-full content-overlay flex flex-col h-full max-h-[85vh] justify-center">
        <div>
          <p className="text-mono mb-2 opacity-60 text-xs sm:text-sm">02 / Experience</p>
          <h2
            ref={headingRef}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 text-center lg:text-left"
          >
            Professional <span className="text-primary text-glow">Journey</span>
          </h2>
          <p
            ref={subtitleRef}
            className="text-muted-foreground mb-6 md:mb-10 max-w-2xl text-xs sm:text-sm md:text-base text-center lg:text-left"
          >
            A timeline of my professional experience building production-grade applications, 
            AI integrations, and automated architectures.
          </p>
        </div>

        {/* Timeline Container */}
        <div 
          ref={timelineRef}
          className="relative overflow-y-auto max-h-[50vh] sm:max-h-[55vh] scrollbar-hide py-4 pl-4 pr-2"
        >
          {/* Vertical progress line */}
          <div
            ref={lineRef}
            className="absolute left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-primary/50 to-transparent origin-top"
          />

          <div className="space-y-8 md:space-y-12">
            {experiences.map((exp, i) => (
              <div
                key={exp.company}
                ref={(el) => (itemsRef.current[i] = el)}
                className="relative pl-10 md:pl-16 group"
              >
                {/* Timeline node */}
                <div className="absolute left-[15px] top-1.5 w-4 h-4 rounded-full bg-background border-2 border-primary/50 flex items-center justify-center -translate-x-1/2 z-10 group-hover:border-primary group-hover:scale-110 transition-all duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/80 group-hover:bg-primary" />
                </div>

                {/* Timeline content card */}
                <div className="glass-card-glow p-4 sm:p-6 md:p-8 hover:border-primary/30 transition-all duration-500 relative">
                  {/* Top highlight border line */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/10 to-transparent group-hover:via-primary/40 transition-all duration-500" />
                  
                  {/* Card Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4 border-b border-border/40 pb-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-primary shrink-0" />
                        {exp.company}
                      </h3>
                      <p className="text-primary/80 font-medium text-sm sm:text-base mt-0.5">
                        {exp.role}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-1 text-left md:text-right md:items-end">
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                        <Calendar className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                        {exp.period}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/80 font-mono">
                        <MapPin className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                        {exp.location}
                      </span>
                    </div>
                  </div>

                  {/* Highlights Bullet List */}
                  <ul className="space-y-2 mb-6">
                    {exp.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        <ChevronRight className="w-4 h-4 text-primary/60 shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Technologies Footer */}
                  <div className="border-t border-border/40 pt-4">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Code className="w-3.5 h-3.5 text-primary/70" />
                      <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-muted-foreground">Technologies Used</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 text-[9px] sm:text-[10px] font-mono bg-muted/30 border border-primary/10 rounded text-muted-foreground/90 group-hover:border-primary/25 transition-colors duration-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
