import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { ChevronLeft, ChevronRight, Loader2, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";

const projects = [
  {
    title: "ClientServe AI",
    description:
      "Developed this autonomous AI customer service agent system while working at Hashthink Technologies. Utilizes Retrieval-Augmented Generation (RAG) to handle voice, SMS, and chat interactions 24/7.",
    tech: ["AI Agents", "RAG", "LLMs", "Vector DB"],
    gradient: "from-violet-500/20 to-fuchsia-600/20",
    link: "https://clientserve.ai/",
    cta: "Visit ClientServe AI",
  },
  {
    title: "Apeiro",
    description:
      "Worked on this brand-experience platform while working at Rixotect. Rebuilt the checkout system and executed the launch campaign, increasing conversions by 38%.",
    tech: ["Next.js", "React", "TailwindCSS", "CRO"],
    gradient: "from-red-500/20 to-rose-600/20",
    link: "https://apeiro.ca/",
    cta: "Visit Apeiro",
  },
  {
    title: "Protiniyoto",
    description:
      "An active, fully-featured e-commerce platform in Bangladesh for gadgets, smart watches, accessories, and home appliances.",
    tech: ["Next.js", "React", "TailwindCSS", "E-commerce"],
    gradient: "from-blue-500/20 to-indigo-600/20",
    link: "https://protiniyoto.com/",
    cta: "Visit Protiniyoto",
  },
  {
    title: "GreenBasket",
    description:
      "GreenBasket is your trusted multi-vendor marketplace for fresh, organic produce delivered to your doorstep.",
    tech: ["Next.js", "TailwindCSS", "Supabase", "Framer Motion"],
    gradient: "from-green-500/20 to-emerald-600/20",
    link: "https://greenbasket-six.vercel.app/",
    cta: "Visit GreenBasket",
  },
  {
    title: "LeafCare Ai",
    description:
      "AI Based tree diseases detection platform for farmers and researchers.",
    tech: ["Next.js", "TensorFlow", "TailwindCSS", "AI"],
    gradient: "from-green-400/20 to-lime-500/20",
    link: "https://leafcareai-ruddy.vercel.app/",
    cta: "Visit LeafCare AI",
  },
  {
    title: "TreLux",
    description:
      "E-Commerce Mens shopping website with modern UI and seamless checkout.",
    tech: ["React", "Node.js", "MongoDB", "Stripe"],
    gradient: "from-blue-500/20 to-indigo-600/20",
    link: "https://trelux.vercel.app/",
    cta: "Visit TreLux",
  },
  {
    title: "EduCoder",
    description:
      "EduCoder is an e-learning platform that connects students and instructors, providing tools for effective course management.",
    tech: ["Next.js", "Supabase", "TailwindCSS"],
    gradient: "from-blue-400/20 to-cyan-500/20",
    link: "https://edu-coder.vercel.app/",
    cta: "Visit EduCoder",
  },
  {
    title: "ReviewHub",
    description:
      "ReviewHub is a product review platform that enables users to explore and contribute premium and interactive reviews.",
    tech: ["React", "Node.js", "MongoDB"],
    gradient: "from-yellow-400/20 to-pink-500/20",
    link: "https://assignment-9-client-iota.vercel.app/",
    cta: "Visit ReviewHub",
  },
  {
    title: "BU-Trace",
    description: "Realtime Bus Tracking system for University of Barishal.",
    tech: ["React Native", "Firebase", "Map APIs"],
    gradient: "from-green-400/20 to-blue-500/20",
    link: "#",
  },
];

const ProjectSlider = () => {
  const [open, setOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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
        },
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
    <div
      ref={sectionRef}
      className="h-full flex flex-col justify-center px-4 sm:px-6 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto w-full content-overlay">
        <div ref={headingRef} className="mb-6 md:mb-10">
          <p className="text-mono mb-2 md:mb-4 opacity-60 text-xs sm:text-sm">
            05 / Projects
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
            Featured <span className="text-primary text-glow">Work</span>
          </h2>
          <p className="text-muted-foreground mt-2 md:mt-4 max-w-xl text-sm md:text-base">
            A selection of projects showcasing expertise in full-stack web applications, AI agents, and workflow automations.
          </p>
        </div>

        <div className="relative">
          <div
            ref={sliderRef}
            className={`glass-card p-4 sm:p-6 md:p-10 relative overflow-hidden bg-black border border-gray-800 grayscale text-white w-full max-w-3xl min-h-[220px] md:min-h-[260px] mx-auto flex flex-col justify-center max-w-[520px] md:max-w-[640px]`}
          >
            <span className="absolute top-2 right-4 sm:top-4 sm:right-6 text-4xl sm:text-6xl md:text-8xl font-bold text-white/10">
              0{currentIndex + 1}
            </span>

            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl md:text-4xl font-bold mb-2 md:mb-4">
                {project.title}
              </h3>
              <p className="text-gray-300 text-sm md:text-lg mb-4 md:mb-6 max-w-2xl">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 md:gap-3 mb-4 items-end justify-between">
                <div className="flex flex-wrap gap-1.5 md:gap-3">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 md:px-4 py-1 md:py-2 text-[10px] sm:text-xs md:text-sm bg-gray-800 rounded-full border border-gray-700 text-gray-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {project.link && project.link !== "#" && (
                  <Button
                    onClick={() => setOpen(true)}
                    className="px-3 py-1 text-xs sm:text-sm rounded-full bg-white/30 backdrop-blur-md border border-white/40 shadow-md text-primary hover:bg-primary/80 hover:text-white transition-all ml-2"
                    style={{ minWidth: "70px" }}
                  >
                    Live Link
                  </Button>
                )}
              </div>

              {/* Modal for website preview */}
              {project.link && project.link !== "#" && (
                <Dialog
                  open={open}
                  onOpenChange={(val) => {
                    setOpen(val);
                    if (val) setLoading(true);
                  }}
                >
                  <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 overflow-hidden border-white/10 bg-black/80 backdrop-blur-xl flex flex-col">
                    <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                      </div>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-medium text-primary hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {project.cta || "View Project"}
                      </a>
                    </div>

                    <div className="flex-1 relative bg-white">
                      {loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20">
                          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                          <p className="text-sm font-mono text-primary/60">
                            Establishing secure connection...
                          </p>
                        </div>
                      )}
                      <iframe
                        src={project.link}
                        title={project.title}
                        className="w-full h-full border-none"
                        onLoad={() => setLoading(false)}
                        allowFullScreen
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-4 md:mt-6">
            <div className="flex gap-1.5 md:gap-2">
              {/* Only show 3 navigation dots: previous, current, next */}
              {[-1, 0, 1].map((offset) => {
                const total = projects.length;
                const i = (currentIndex + offset + total) % total;
                return (
                  <Button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                      i === currentIndex
                        ? "bg-white w-5 md:w-8"
                        : "bg-gray-700 hover:bg-gray-500"
                    }`}
                  />
                );
              })}
            </div>

            <div className="flex gap-2 md:gap-3">
              <Button
                onClick={prevProject}
                className="w-9 h-9 md:w-12 md:h-12 rounded-full border border-gray-700 flex items-center justify-center  bg-gray-800 transition-colors text-primary"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
              <Button
                onClick={nextProject}
                className="w-9 h-9 md:w-12 md:h-12 rounded-full border border-gray-700 flex items-center justify-center  bg-gray-800 transition-colors text-primary"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSlider;
