import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { createMagneticEffect } from '@/lib/gsap';
import { Zap, Wrench, Bot } from 'lucide-react';

const skills = [
  { name: "Next.js", category: "Frontend", level: 95 },
  { name: "React", category: "Frontend", level: 95 },
  { name: "TypeScript", category: "Language", level: 90 },
  { name: "Node.js", category: "Backend", level: 88 },
  { name: "Socket.io", category: "Real-time", level: 85 },
  { name: "Redis", category: "Database", level: 85 },
  { name: "Twilio", category: "API", level: 88 },
  { name: "CRM Integration", category: "Automation", level: 90 },
  { name: "HubSpot CRM", category: "CRM", level: 88 },
  { name: "Stripe API", category: "Payments", level: 85 },
  { name: "AI Workflows", category: "AI", level: 90 },
  { name: "API Engineering", category: "Backend", level: 88 },
  { name: "PostgreSQL", category: "Database", level: 85 },
  { name: "Go", category: "Backend", level: 90 },
  { name: "Docker", category: "DevOps", level: 80 },
  { name: "Python", category: "Language", level: 82 },
  { name: "GraphQL", category: "API", level: 78 },
];

const Skills = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const skillsContainerRef = useRef<HTMLDivElement>(null);
  const skillRefs = useRef<(HTMLDivElement | null)[]>([]);

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

      // Skills stagger animation
      gsap.fromTo(
        skillRefs.current,
        {
          opacity: 0,
          y: 40,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: {
            each: 0.08,
            from: "random",
          },
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: skillsContainerRef.current,
            start: "top 70%",
          },
        }
      );

      // Add magnetic effect to each skill
      skillRefs.current.forEach((skill) => {
        if (skill) {
          createMagneticEffect(skill, 0.2);
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
        <p className="text-mono mb-4 opacity-60">02 / Skills</p>

        <h2 ref={headingRef} className="text-section mb-16 text-center lg:text-left">
          Technical <span className="text-primary text-glow">Expertise</span>
        </h2>

        {/* Skills Grid */}
        <div
          ref={skillsContainerRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {skills.map((skill, i) => (
            <div
              key={skill.name}
              ref={(el) => (skillRefs.current[i] = el)}
              className="skill-node cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{skill.name}</span>
                <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  {skill.level}%
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{skill.category}</div>
              
              {/* Progress bar */}
              <div className="mt-3 h-[2px] bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 origin-left scale-x-0 group-hover:scale-x-100"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Frontend Mastery",
              description: "Building performant, accessible UIs with React and Next.js",
              icon: <Zap className="text-primary w-8 h-8" />,
            },
            {
              title: "Backend Architecture",
              description: "Scalable APIs and microservices with Node.js",
              icon: <Wrench className="text-primary w-8 h-8" />,
            },
            {
              title: "AI Integration",
              description: "Implementing intelligent automation workflows",
              icon: <Bot className="text-primary w-8 h-8" />,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="glass-card p-6 group hover:border-primary/30 transition-all duration-500"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
