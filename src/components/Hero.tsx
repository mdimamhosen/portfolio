import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';

const typewriterTexts = [
  "Building intelligent AI agents that automate complex workflows",
  "Developing scalable, modern web applications with React, Next.js & Go",
  "Designing scalable backends with Go, Node.js & PostgreSQL",
  "Integrating LLMs and custom AI models into production systems",
  "Creating real-time applications with WebSocket & Socket.io",
];

interface HeroProps {
  onViewProjects: () => void;
  onContact: () => void;
}

const Hero = ({ onViewProjects, onContact }: HeroProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const typewriterRef = useRef<HTMLSpanElement>(null);
  
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect
  useEffect(() => {
    const currentFullText = typewriterTexts[currentTextIndex];
    const typingSpeed = isDeleting ? 30 : 50;
    const pauseTime = isDeleting ? 500 : 2000;

    if (!isDeleting && displayText === currentFullText) {
      // Pause before starting to delete
      const timeout = setTimeout(() => setIsDeleting(true), pauseTime);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayText === '') {
      // Move to next text
      setIsDeleting(false);
      setCurrentTextIndex((prev) => (prev + 1) % typewriterTexts.length);
      return;
    }

    const timeout = setTimeout(() => {
      if (isDeleting) {
        setDisplayText(currentFullText.substring(0, displayText.length - 1));
      } else {
        setDisplayText(currentFullText.substring(0, displayText.length + 1));
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentTextIndex]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
      });

      gsap.set([nameRef.current, titleRef.current, ctaRef.current], {
        opacity: 0,
        y: 20,
      });
      gsap.set(lineRef.current, { scaleX: 0 });

      tl.to(nameRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.4,
      })
        .to(
          lineRef.current,
          {
            scaleX: 1,
            duration: 0.3,
            ease: "power2.out",
          },
          "-=0.2"
        )
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
          },
          "-=0.2"
        )
        .to(
          ctaRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
          },
          "-=0.2"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="section-container min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 relative py-12"
    >
      {/* Content */}
      <div className="content-overlay text-center max-w-5xl mx-auto">
        {/* Label */}
        <p className="text-mono mb-4 md:mb-8 text-foreground/80 text-xs sm:text-sm tracking-widest uppercase">Software Engineer | Web, Backend & AI Agents</p>

        {/* Name */}
        <h1 ref={nameRef} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter mb-4 md:mb-6">
          Md. Imam Hosen
        </h1>

        {/* Animated line */}
        <div
          ref={lineRef}
          className="w-16 sm:w-24 h-px mx-auto mb-6 md:mb-8 origin-center bg-gradient-to-r from-transparent via-white/60 to-transparent"
        />

        {/* Typewriter Title */}
        <div
          ref={titleRef}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 md:mb-16 font-light leading-relaxed px-4 h-16 md:h-20 flex items-center justify-center"
        >
          <span ref={typewriterRef} className="text-foreground">
            {displayText}
            <span className="animate-pulse text-primary">|</span>
          </span>
        </div>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
          <button
            className="btn-primary text-sm md:text-base"
            onClick={onViewProjects}
          >
            View Projects
          </button>
          <button
            className="btn-outline text-sm md:text-base"
            onClick={onContact}
          >
            Contact Me
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:gap-3 opacity-30">
        <span className="text-mono text-[10px] md:text-xs tracking-widest">Scroll</span>
        <div className="w-4 h-6 md:w-5 md:h-8 border border-white/30 rounded-full flex justify-center">
          <div className="w-0.5 h-1.5 md:h-2 bg-white/60 rounded-full mt-1 md:mt-1.5 animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default Hero;