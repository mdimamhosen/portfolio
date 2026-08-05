import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import {
  CalendarDays,
  Ticket,
  MapPin,
  Users,
  ExternalLink,
  Rocket,
  Store,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const pillars = [
  {
    icon: Ticket,
    title: "Ticketing & Management",
    description:
      "End-to-end event ops — create events, sell tickets, and track everything in one place.",
  },
  {
    icon: MapPin,
    title: "Local Discovery",
    description:
      "Hyper-local feeds: happening now, this weekend, around you, free events, and just dropped.",
  },
  {
    icon: Store,
    title: "Vendor Ecosystem",
    description:
      "Tools for vendors and organizers to list, promote, and grow across music, nightlife, sports, and more.",
  },
  {
    icon: Sparkles,
    title: "Curated Experiences",
    description:
      "Category-rich browsing — concerts, festivals, food, tech, family, gaming, and after-dark nightlife.",
  },
];

const CoHost = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
        },
      );

      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
          },
        },
      );

      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 40, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.1,
          duration: 0.7,
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

  return (
    <div
      ref={sectionRef}
      className="section-container h-full flex flex-col justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-16 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto w-full content-overlay flex flex-col h-full max-h-[85vh] justify-center">
        <div>
          <p className="text-mono mb-2 opacity-60 text-xs sm:text-sm">
            02 / Venture
          </p>
          <h2
            ref={headingRef}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 text-center lg:text-left"
          >
            Building{" "}
            <span className="text-primary text-glow">CoHost</span>
          </h2>
          <p
            ref={subtitleRef}
            className="text-muted-foreground mb-6 md:mb-8 max-w-2xl text-xs sm:text-sm md:text-base text-center lg:text-left"
          >
            Co-Founder &amp; Team Lead — shipping a full event management and
            ticketing platform for organizers, vendors, and attendees.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-stretch overflow-y-auto max-h-[55vh] sm:max-h-[60vh] scrollbar-hide pr-1">
          {/* Story panel */}
          <div
            ref={contentRef}
            className="glass-card-glow p-4 sm:p-6 flex flex-col relative group"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent group-hover:via-primary/60 transition-all duration-500" />

            <div className="flex items-center gap-2 mb-4">
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-primary/80">
                Co-Founder · Team Lead
              </span>
            </div>

            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 leading-snug">
              Your full event management platform
            </h3>

            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-4">
              <a
                href="https://co-hostapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-2 hover:text-primary transition-colors"
              >
                CoHost
              </a>{" "}
              helps people find their next experience and lets organizers create,
              promote, and run events with less friction — from discovery to
              ticketing and tracking.
            </p>

            <ul className="space-y-2 mb-6 flex-1">
              {[
                "Live discovery: happening now, this weekend, what's buzzing, after dark",
                "Browse by vibe — free, family, nightlife, sports, music, tech, and more",
                "Organizer & vendor flows to list events and reach local audiences",
                "Built as a product, not a demo — design, engineering, and team leadership",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-primary/60 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3 mt-auto pt-2 border-t border-border/40">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono text-muted-foreground">
                <CalendarDays className="w-3.5 h-3.5 text-primary/70" />
                Events · Tickets · Discovery
              </div>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono text-muted-foreground">
                <Users className="w-3.5 h-3.5 text-primary/70" />
                Organizers & Attendees
              </div>
            </div>

            <a
              href="https://co-hostapp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity w-full sm:w-auto"
            >
              Visit co-hostapp.com
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Platform pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {pillars.map((pillar, i) => (
              <div
                key={pillar.title}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className="glass-card p-3 sm:p-4 group hover:border-primary/30 transition-all duration-500"
              >
                <pillar.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary mb-2 sm:mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="text-sm sm:text-base font-semibold mb-1 group-hover:text-primary transition-colors">
                  {pillar.title}
                </h4>
                <p className="text-muted-foreground text-[10px] sm:text-xs leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoHost;
