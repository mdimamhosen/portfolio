import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { createMagneticEffect } from '@/lib/gsap';

const skillCategories = [
  {
    title: "Frontend",
    skills: ["HTML5", "CSS3", "Tailwind CSS", "TypeScript", "JavaScript (ES6+)", "React", "Next.js", "Redux Toolkit", "Zustand", "Shadcn UI", "Framer Motion"]
  },
  {
    title: "Backend & APIs",
    skills: ["Go (Golang)", "Node.js", "Express.js", "Nest.js", "FastAPI", "Python", "GraphQL", "RESTful APIs", "WebSockets", "Socket.io"]
  },
  {
    title: "AI & Automation",
    skills: ["LangChain", "LlamaIndex", "AI Agents", "RAG Pipelines", "Vector Search", "n8n Automation", "OpenAI/Anthropic APIs", "Twilio Integration", "CRM Integration (HubSpot/Salesforce)"]
  },
  {
    title: "Database & Cloud",
    skills: ["PostgreSQL", "MongoDB", "Redis", "Pinecone / ChromaDB", "Supabase", "Prisma ORM", "Docker", "AWS (S3, EC2)", "Git/GitHub", "CI/CD Pipelines"]
  }
];

const SkillsGrid = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const skillRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [headingRef.current, subtitleRef.current],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        }
      );

      categoryRefs.current.forEach((category, index) => {
        if (category) {
          gsap.fromTo(
            category,
            { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: category,
                start: "top 80%",
              },
            }
          );
        }
      });

      skillRefs.current.forEach((skill) => {
        if (skill) {
          createMagneticEffect(skill, 0.15);
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  let skillIndex = 0;

  return (
    <div ref={sectionRef} className="h-full flex flex-col justify-center px-4 sm:px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto w-full content-overlay flex flex-col h-full max-h-[85vh] justify-center">
        <div>
          <p className="text-mono mb-2 opacity-60 text-xs sm:text-sm">03 / Skills</p>
          <h2 ref={headingRef} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 text-center lg:text-left">
            Tech <span className="text-primary text-glow">Stack</span>
          </h2>
          <p ref={subtitleRef} className="text-muted-foreground mb-6 md:mb-10 max-w-2xl text-xs sm:text-sm md:text-base text-center lg:text-left">
            A comprehensive view of the languages, frameworks, databases, and automated tools that drive my development stack.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6 overflow-y-auto max-h-[50vh] sm:max-h-none scrollbar-hide py-1">
          {skillCategories.map((category, catIndex) => (
            <div
              key={category.title}
              ref={(el) => (categoryRefs.current[catIndex] = el)}
              className="glass-card p-3 md:p-5 rounded-xl"
            >
              <h3 className="text-xs md:text-sm font-semibold text-primary mb-2 md:mb-3 uppercase tracking-wider">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {category.skills.map((skill) => {
                  const currentIndex = skillIndex++;
                  return (
                    <span
                      key={skill}
                      ref={(el) => (skillRefs.current[currentIndex] = el)}
                      className="skill-tag px-2 py-1 md:px-3 md:py-1.5 text-[10px] sm:text-xs md:text-sm font-medium 
                                 bg-muted/50 border border-primary/20 rounded-full
                                 hover:bg-primary/20 hover:border-primary/50 hover:text-primary
                                 transition-all duration-300 cursor-default
                                 hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]"
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsGrid;
