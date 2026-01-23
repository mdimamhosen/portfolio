import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const projects = [
  {
    title: "AI Workflow Engine",
    description: "Intelligent automation platform processing 10K+ tasks daily with n8n and custom AI models",
    tech: ["Next.js", "n8n", "OpenAI", "PostgreSQL"],
    gradient: "from-cyan-500/20 to-blue-600/20",
    link: "#",
  },
  {
    title: "Enterprise Dashboard",
    description: "Real-time analytics dashboard with complex data visualizations and role-based access",
    tech: ["React", "TypeScript", "D3.js", "Node.js"],
    gradient: "from-purple-500/20 to-pink-600/20",
    link: "#",
  },
  {
    title: "E2E Testing Suite",
    description: "Comprehensive Playwright testing framework reducing QA time by 70%",
    tech: ["Playwright", "TypeScript", "CI/CD", "Docker"],
    gradient: "from-green-500/20 to-emerald-600/20",
    link: "#",
  },
  {
    title: "API Gateway",
    description: "High-performance API gateway handling 1M+ requests with intelligent rate limiting",
    tech: ["Node.js", "Redis", "GraphQL", "Kubernetes"],
    gradient: "from-orange-500/20 to-red-600/20",
    link: "#",
  },
];

const Projects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const projectsContainerRef = useRef<HTMLDivElement>(null);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
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

      // Projects stagger with depth effect
      projectRefs.current.forEach((project, i) => {
        if (project) {
          gsap.fromTo(
            project,
            {
              opacity: 0,
              y: 80,
              rotateX: 10,
              scale: 0.95,
            },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              scale: 1,
              duration: 1,
              ease: "power4.out",
              scrollTrigger: {
                trigger: project,
                start: "top 80%",
                end: "top 50%",
                toggleActions: "play none none reverse",
              },
              delay: i * 0.1,
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-container min-h-screen py-32 px-6 relative"
    >
      <div className="max-w-6xl mx-auto content-overlay">
        {/* Section label */}
        <p className="text-mono mb-4 opacity-60">03 / Projects</p>

        <div ref={headingRef} className="mb-16">
          <h2 className="text-section">
            Featured <span className="text-primary text-glow">Work</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl">
            A selection of projects that showcase my expertise in building 
            scalable, intelligent systems.
          </p>
        </div>

        {/* Projects Grid */}
        <div
          ref={projectsContainerRef}
          className="grid md:grid-cols-2 gap-6"
        >
          {projects.map((project, i) => (
            <div
              key={project.title}
              ref={(el) => (projectRefs.current[i] = el)}
              className="group relative overflow-hidden rounded-2xl cursor-pointer perspective-1000"
            >
              {/* Background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Card content */}
              <div className="glass-card p-8 relative z-10 h-full border-transparent group-hover:border-primary/20 transition-all duration-500">
                {/* Number */}
                <span className="text-6xl font-bold text-muted/20 absolute top-4 right-6">
                  0{i + 1}
                </span>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs bg-muted rounded-full text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Link */}
                  <div className="flex items-center gap-2 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span>View Project</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* View all link */}
        <div className="mt-12 text-center">
          <button className="btn-outline">
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
