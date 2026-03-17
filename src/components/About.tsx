import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        contentRef.current?.querySelectorAll("p"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="section-container h-screen py-12 md:py-20 px-4 sm:px-6 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto content-overlay h-full flex items-center">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full">
          {/* Left: Content */}
          <div>
            <p className="text-mono mb-4 md:mb-6 opacity-40 text-xs sm:text-sm">
              01 / About
            </p>

            <h2
              ref={headingRef}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 md:mb-10"
            >
              Building the <br />
              <span className="text-foreground">Future</span>
            </h2>

            <div
              ref={contentRef}
              className="space-y-4 md:space-y-6 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed"
            >
              <p>
                I'm a Web App, Mobile App (Flutter, React Native), & AI Agent
                Developer specializing in building intelligent, scalable systems
                that transform how businesses operate.
              </p>
              <p>
                With expertise in Flutter, React Native Expo for mobile apps,
                modern web frameworks, and agentic AI systems, I bridge the gap
                between innovative AI solutions and production-ready
                applications.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-12">
              {[
                { value: "2+", label: "Years Experience" },
                { value: "50+", label: "Projects Delivered" },
                { value: "100%", label: "Client Satisfaction" },
              ].map((stat, i) => (
                <div key={i} className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <div ref={imageRef} className="relative">
            <div className="glass-card-glow p-4 sm:p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <div className="font-mono text-xs sm:text-sm space-y-2 sm:space-y-3 text-muted-foreground">
                <div>
                  <span className="text-foreground">const</span> developer ={" "}
                  {"{"}
                </div>
                <div className="pl-4 sm:pl-6">
                  <span className="opacity-60">name:</span>{" "}
                  <span className="text-foreground">"Md. Imam Hosen"</span>,
                </div>
                <div className="pl-4 sm:pl-6">
                  <span className="opacity-60">role:</span>{" "}
                  <span className="text-foreground">
                    "Web App & AI Agent Dev"
                  </span>
                  ,
                </div>
                <div className="pl-4 sm:pl-6">
                  <span className="opacity-60">passion:</span>{" "}
                  <span className="text-foreground">"Agentic AI Systems"</span>,
                </div>
                <div className="pl-4 sm:pl-6">
                  <span className="opacity-60">focus:</span>{" "}
                  <span className="text-foreground/70">[</span>
                </div>
                <div className="pl-8 sm:pl-10 text-foreground text-xs sm:text-sm">
                  "AI Agents",
                  <br />
                  "Mobile Apps",
                  <br />
                  "Full-Stack Web"
                </div>
                <div className="pl-4 sm:pl-6">
                  <span className="text-foreground/70">]</span>
                </div>
                <div>{"}"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
