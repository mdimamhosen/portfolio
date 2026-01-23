import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import Scene from '@/components/Scene';

import Hero from '@/components/Hero';
import About from '@/components/About';
import SkillsGrid from '@/components/SkillsGrid';
import SkillsExpertise from '@/components/SkillsExpertise';
import ProjectSlider from '@/components/ProjectSlider';
import Automation from '@/components/Automation';
import AIAgents from '@/components/AIAgents';
import WebAppShowcase from '@/components/WebAppShowcase';
import Contact from '@/components/Contact';
import { useVisitorTracking } from '@/hooks/useVisitorTracking';

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'skills-expertise', label: 'Expertise' },
  { id: 'projects', label: 'Projects' },
  { id: 'automation', label: 'Automation' },
  { id: 'ai-agents', label: 'AI Agents' },
  { id: 'web-apps', label: 'Web Apps' },
  { id: 'contact', label: 'Contact' },
];

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(0);
  
  // Track visitor
  useVisitorTracking();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sectionElements = gsap.utils.toArray<HTMLElement>('.panel');
      
      sectionElements.forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          snap: {
            snapTo: 1,
            duration: { min: 0.3, max: 0.6 },
            ease: 'power2.inOut',
          },
          onEnter: () => setCurrentSection(i),
          onEnterBack: () => setCurrentSection(i),
        });
        
        const content = section.querySelector('.panel-content');
        if (content) {
          gsap.fromTo(content, 
            { opacity: 0, y: 100, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'top 20%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      });
      
      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (index: number) => {
    const section = document.getElementById(sections[index].id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSectionById = (id: string) => {
    const index = sections.findIndex((section) => section.id === id);
    if (index !== -1) {
      scrollToSection(index);
    }
  };

  return (
    <div ref={containerRef} className="relative bg-background text-foreground overflow-x-hidden">
      {/* 3D Scene Background */}
      <Scene />

      {/* Noise overlay */}
      <div className="noise-overlay" />


      {/* Section Indicators */}
      <div className="section-indicator hidden md:flex">
        {sections.map((section, i) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(i)}
            className={`section-dot ${currentSection === i ? 'active' : ''}`}
            aria-label={`Go to ${section.label}`}
          />
        ))}
      </div>

      {/* Main Content - Full Screen Panels */}
      <main className="relative z-10">
        <section id="hero" className="panel">
          <Hero
            onViewProjects={() => scrollToSectionById('projects')}
            onContact={() => scrollToSectionById('contact')}
          />
        </section>

        <section id="about" className="panel">
          <div className="panel-content h-full">
            <About />
          </div>
        </section>

        <section id="skills" className="panel">
          <div className="panel-content h-full">
            <SkillsGrid />
          </div>
        </section>

        <section id="skills-expertise" className="panel">
          <div className="panel-content h-full">
            <SkillsExpertise />
          </div>
        </section>

        <section id="projects" className="panel">
          <div className="panel-content h-full">
            <ProjectSlider />
          </div>
        </section>

        <section id="automation" className="panel">
          <div className="panel-content h-full">
            <Automation />
          </div>
        </section>

        <section id="ai-agents" className="panel">
          <div className="panel-content h-full">
            <AIAgents />
          </div>
        </section>

        <section id="web-apps" className="panel">
          <div className="panel-content h-full">
            <WebAppShowcase />
          </div>
        </section>

        <section id="contact" className="panel">
          <div className="panel-content h-full">
            <Contact />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;