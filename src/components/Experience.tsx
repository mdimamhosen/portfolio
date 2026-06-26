import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { Briefcase, Calendar, MapPin, Code, ChevronRight, Award } from "lucide-react";

const experiences = [
  {
    company: "Hashthink Technologies",
    role: "Software Engineer",
    location: "Canada (Remote)",
    period: "March 2026 - May 2026",
    isFreelance: false,
    technologies: ["RAG Systems", "LangChain", "Twilio API", "Socket.io", "Redis", "CRM Integration", "AI Agents"],
    highlights: [
      "Engineered advanced Retrieval-Augmented Generation (RAG) pipelines and LLM-powered multi-agent systems using LangChain.",
      "Designed and integrated real-time communication modules, webhook endpoints, and live chat features using Twilio and Socket.io.",
      "Integrated custom CRM pipelines with autonomous AI agents to automate customer lead classification and routing workflows."
    ]
  },
  // {
  //   company: "Upwork",
  //   role: "Freelancer (Top Rated)",
  //   location: "Remote",
  //   period: "January 2026 - Present",
  //   isFreelance: true,
  //   technologies: ["AI Agents", "Redis", "Socket.io", "Twilio", "CRM Integration", "Next.js", "LangChain"],
  //   highlights: [
  //     "Maintained Top Rated status by delivering high-impact AI agents, CRM system integrations, and full-stack solutions for global clients.",
  //     "Developed real-time applications with Socket.io and Redis for low-latency communication and event-driven data synchronization.",
  //     "Built and deployed custom workflow automations connecting HubSpot/Salesforce CRMs, Twilio, and LLM backends."
  //   ]
  // },
  {
    company: "RixoTech",
    role: "Full Stack Engineer",
    location: "Remote",
    period: "January 2025 - December 2025",
    isFreelance: false,
    technologies: ["React", "Next.js", "Node.js", "Go", "Redis", "Socket.io", "PostgreSQL", "Docker", "AWS"],
    highlights: [
      "Architected and deployed full-stack web applications, integrating Redis for server caching and Socket.io for real-time live updates.",
      "Built scalable microservices and robust RESTful APIs in Go and Node.js with optimized PostgreSQL database schemas.",
      "Streamlined deployment processes with Docker containers, AWS integrations, and automated CI/CD pipelines."
    ]
  }
];

const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

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

      // Fade in cards with a stagger and slight scale up
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 50, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="section-container h-full flex flex-col justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-16 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto w-full content-overlay flex flex-col h-full max-h-[85vh] justify-center">
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
            My career history building production-grade web applications, advanced AI agent systems, and custom automation.
          </p>
        </div>

        {/* Responsive Cards Grid - Scrollable to prevent overflow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 overflow-y-auto max-h-[50vh] sm:max-h-[55vh] md:max-h-[60vh] scrollbar-hide py-2 pr-1">
          {experiences.map((exp, i) => (
            <div
              key={exp.company}
              ref={(el) => (cardsRef.current[i] = el)}
              className="glass-card-glow p-4 sm:p-5 flex flex-col justify-between group hover:border-primary/30 transition-all duration-500 relative"
            >
              {/* Top border highlight line */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent group-hover:via-primary/50 transition-all duration-500" />
              
              <div>
                {/* Header */}
                <div className="flex flex-col gap-1.5 mb-4 border-b border-border/40 pb-4">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-1.5 leading-snug">
                      {exp.isFreelance ? (
                        <Award className="w-4 h-4 text-primary shrink-0" />
                      ) : (
                        <Briefcase className="w-4 h-4 text-primary shrink-0" />
                      )}
                      {exp.company}
                    </h3>
                  </div>
                  <p className="text-primary/80 font-medium text-xs sm:text-sm">
                    {exp.role}
                  </p>
                  
                  <div className="flex flex-col gap-0.5 mt-1 font-mono text-[10px] sm:text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                {/* Job Highlights */}
                <ul className="space-y-1.5 mb-6">
                  {exp.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-1.5 text-xs text-muted-foreground leading-relaxed">
                      <ChevronRight className="w-3.5 h-3.5 text-primary/60 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies used */}
              <div className="border-t border-border/40 pt-4 mt-auto">
                <div className="flex items-center gap-1 mb-2">
                  <Code className="w-3 h-3 text-primary/70" />
                  <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Tech Used</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-1.5 py-0.5 text-[9px] font-mono bg-muted/30 border border-primary/10 rounded text-muted-foreground/90 group-hover:border-primary/25 transition-colors duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;
