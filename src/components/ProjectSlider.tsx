import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "@/lib/gsap";
import { ChevronLeft, ChevronRight, Loader2, ExternalLink, X } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const projects: Array<{
  title: string;
  description: string;
  tech: string[];
  gradient: string;
  link: string;
  cta?: string;
  privatePreview?: boolean;
  statusNote?: string;
  accessRole?: string;
  loginEmail?: string;
  loginPassword?: string;
}> = [
  {
    title: "DropBridge",
    description:
      "AirDrop-style file sharing between Android, macOS, Windows and Linux. A Rust core with TLS 1.3 encryption, BLAKE3 verification and resumable transfers; Tauri desktop app and Kotlin/Compose Android app. Open source.",
    tech: ["Rust", "Tauri", "Kotlin", "TLS 1.3"],
    gradient: "from-blue-500/20 to-cyan-500/20",
    link: "https://mdimamhosen.me/DropBridge/",
    cta: "Visit DropBridge",
  },
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
    title: "CoHost",
    description:
      "Event platform for ticketing and management, hyper-local discovery feeds, vendor tools, and curated browsing across concerts, nightlife, sports, and family experiences.",
    tech: ["Events", "Ticketing", "Discovery", "Vendors"],
    gradient: "from-purple-500/20 to-pink-500/20",
    link: "https://co-hostapp.com/",
    cta: "Visit CoHost",
  },
  {
    title: "xArbitration",
    description:
      "Arbitration workspace for cases, documents, notices, and arbitrator selection, with separate portals for councils, parties, and arbitrators. AI assists process steps; awards stay with authorized people.",
    tech: ["Next.js", "Role-based portals", "Notices", "Stripe billing"],
    gradient: "from-slate-500/20 to-amber-500/20",
    link: "https://www.xarbitration.ai/",
    cta: "Visit xArbitration",
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
    title: "Linden Operations Desk",
    description:
      "A role-based operations workspace for sales, orders, inventory, customer relationships, and team workflows.",
    tech: ["Next.js", "MongoDB", "Role-based access", "Operations"],
    gradient: "from-emerald-500/20 to-lime-400/20",
    link: "https://linden-five.vercel.app/",
    cta: "Open Linden",
    privatePreview: true,
    statusNote: "Private preview. Production database setup is still required.",
    accessRole: "Owner",
    loginEmail: "imamhosen9426224+linden@gmail.com",
    loginPassword: "Linden-Owner-2026",
  },
  {
    title: "Halden Analytics Desk",
    description:
      "An analytics workspace for KPIs, revenue reporting, growth metrics, forecasts, and team performance.",
    tech: ["Next.js", "MongoDB", "Analytics", "Role-based access"],
    gradient: "from-amber-400/20 to-yellow-600/20",
    link: "https://halden-sigma-murex.vercel.app/",
    cta: "Open Halden",
    privatePreview: true,
    statusNote: "Private preview. Production database setup is still required.",
    accessRole: "Owner",
    loginEmail: "imamhosen9426224+halden@gmail.com",
    loginPassword: "Halden-Owner-2026",
  },
  {
    title: "Portico Case Desk",
    description:
      "A case-management workspace for matters, client relationships, documents, billing, and audit history.",
    tech: ["Next.js", "MongoDB", "Case management", "Role-based access"],
    gradient: "from-violet-500/20 to-fuchsia-500/20",
    link: "https://portico-gamma.vercel.app/",
    cta: "Open Portico",
    privatePreview: true,
    statusNote: "Private preview. Production database setup is still required.",
    accessRole: "Admin",
    loginEmail: "imamhosen9426224+portico@gmail.com",
    loginPassword: "Portico-Admin-2026",
  },
  {
    title: "Cedar Hospital Desk",
    description:
      "A hospital operations workspace for patient administration, appointments, admissions, laboratory, and billing records.",
    tech: ["Next.js", "MongoDB", "Hospital operations", "Role-based access"],
    gradient: "from-teal-400/20 to-cyan-500/20",
    link: "https://cedar-ivory.vercel.app/",
    cta: "Open Cedar",
    privatePreview: true,
    statusNote: "Private preview. Production database setup is still required.",
    accessRole: "Admin",
    loginEmail: "imamhosen9426224+cedar@gmail.com",
    loginPassword: "Cedar-Admin-2026",
  },
  {
    title: "CourtHelp",
    description:
      "Built a Dallas–Fort Worth consumer legal platform with a live practice-area catalog, case intake and document workspace, and a LegalHelp attorney portal for profile review and granted case access. Self Guided Path remains disabled by default behind its feature flag.",
    tech: ["Next.js", "TypeScript", "Fastify", "PostgreSQL", "Prisma", "Docker"],
    gradient: "from-blue-500/20 to-amber-400/20",
    link: "https://dev.courthelp.law/",
    cta: "Visit CourtHelp",
  },
  {
    title: "Fathom Yard",
    description:
      "Concept website for an electric dayboat brand. Includes an editorial product story, boat detail pages, journal, and a local sea-trial inquiry demo.",
    tech: ["Concept Website", "Next.js", "TypeScript", "Tailwind CSS"],
    gradient: "from-blue-500/20 to-cyan-400/20",
    link: "https://fathom-yard.vercel.app/",
    cta: "Visit Fathom Yard",
  },
  {
    title: "Kiln House",
    description:
      "Concept website for a ceramic tableware studio, with a collection, studio notes, original product imagery, and a local reservation form demo.",
    tech: ["Concept Website", "Next.js", "TypeScript", "Tailwind CSS"],
    gradient: "from-orange-500/20 to-amber-300/20",
    link: "https://kiln-house.vercel.app/",
    cta: "Visit Kiln House",
  },
  {
    title: "Merrin Hale",
    description:
      "Concept website for a retained executive-search firm, with practice pages, editorial notes, and a client brief form demo.",
    tech: ["Concept Website", "Next.js", "TypeScript", "Editorial UI"],
    gradient: "from-pink-500/20 to-rose-300/20",
    link: "https://merrin-hale.vercel.app/",
    cta: "Visit Merrin Hale",
  },
  {
    title: "Brim",
    description:
      "Concept website for a usage-based billing startup, with product, pricing, documentation, and a local onboarding form demo.",
    tech: ["Concept Website", "Next.js", "TypeScript", "SaaS"],
    gradient: "from-lime-400/20 to-green-500/20",
    link: "https://brim-amber.vercel.app/",
    cta: "Visit Brim",
  },
  {
    title: "Plover",
    description:
      "Concept stay brand for small coastal houses, with original property photography, stay detail pages, journal, and an inquiry form demo.",
    tech: ["Concept Website", "Next.js", "TypeScript", "Hospitality"],
    gradient: "from-orange-400/20 to-red-400/20",
    link: "https://plover-weld.vercel.app/",
    cta: "Visit Plover",
  },
  {
    title: "Understory",
    description:
      "Plant-club concept with original plant imagery, an editorial collection, care notes, and a local-only join form demo.",
    tech: ["Concept Website", "Next.js", "TypeScript", "Art Direction"],
    gradient: "from-violet-500/20 to-emerald-400/20",
    link: "https://understory-two-blue.vercel.app/",
    cta: "Visit Understory",
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

const PUBLIC_PREVIEW_PROJECTS = projects.filter(
  (p) => p.link && p.link !== "#" && !p.privatePreview,
);

const PUBLIC_PREVIEW_ORIGINS = [
  ...new Set(
    PUBLIC_PREVIEW_PROJECTS.map((p) => {
      try {
        return new URL(p.link).origin;
      } catch {
        return null;
      }
    }).filter((origin): origin is string => Boolean(origin)),
  ),
];

function scheduleIdleWork(work: () => void, timeoutMs = 1200) {
  const requestIdle = window.requestIdleCallback;
  if (requestIdle) {
    const id = requestIdle(work, { timeout: timeoutMs });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(work, Math.min(timeoutMs, 500));
  return () => window.clearTimeout(id);
}

type PreviewMeta = {
  url: string;
  title: string;
  cta: string;
};

const ProjectSlider = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewMeta, setPreviewMeta] = useState<PreviewMeta | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [mountedPreviewUrls, setMountedPreviewUrls] = useState<string[]>([]);
  const loadedPreviewUrls = useRef(new Set<string>());
  const activePreviewUrlRef = useRef<string | null>(null);

  const queuePreviewMount = useCallback((url: string) => {
    setMountedPreviewUrls((prev) => (prev.includes(url) ? prev : [...prev, url]));
  }, []);

  const markPreviewLoaded = useCallback((url: string) => {
    loadedPreviewUrls.current.add(url);
    if (activePreviewUrlRef.current === url) {
      setPreviewLoading(false);
    }
  }, []);

  const openLivePreview = useCallback(
    (meta: PreviewMeta) => {
      queuePreviewMount(meta.url);
      activePreviewUrlRef.current = meta.url;
      setPreviewMeta(meta);
      setPreviewOpen(true);
      setPreviewLoading(!loadedPreviewUrls.current.has(meta.url));
    },
    [queuePreviewMount],
  );

  useEffect(() => {
    return scheduleIdleWork(() => {
      const current = projects[currentIndex];
      if (current.link && current.link !== "#" && !current.privatePreview) {
        queuePreviewMount(current.link);
      }
    });
  }, [currentIndex, queuePreviewMount]);

  useEffect(() => {
    const nodes: HTMLLinkElement[] = [];
    for (const origin of PUBLIC_PREVIEW_ORIGINS) {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = origin;
      link.crossOrigin = "";
      document.head.appendChild(link);
      nodes.push(link);
    }
    return () => nodes.forEach((node) => node.remove());
  }, []);

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
            Product work, private business dashboards, and concept websites across AI, SaaS, commerce, hospitality, and editorial design.
          </p>
        </div>

        <div className="relative">
          <div
            ref={sliderRef}
            className="glass-card relative mx-auto flex h-[17.5rem] w-full max-w-4xl flex-col overflow-hidden border border-gray-800 bg-black p-4 text-white grayscale sm:p-5 md:h-[19.5rem] md:p-6"
          >
            <span className="absolute top-2 right-4 text-4xl font-bold text-white/10 sm:top-4 sm:right-6 sm:text-6xl md:text-8xl">
              {String(currentIndex + 1).padStart(2, "0")}
            </span>

            <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto">
              <h3 className="mb-1.5 text-lg font-bold sm:text-xl md:mb-2 md:text-2xl">
                {project.title}
              </h3>
              <p className="line-clamp-3 max-w-2xl text-sm leading-snug text-gray-300 md:text-base">
                {project.description}
              </p>

              {project.statusNote && (
                <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                  {project.statusNote}
                </p>
              )}

              {project.loginEmail && project.loginPassword && (
                <div className="mt-2 max-w-xl shrink-0 rounded-xl border border-white/10 bg-white/[0.04] p-2.5 sm:p-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/90">
                      Demo login
                    </p>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-gray-300">
                      {project.accessRole}
                    </span>
                  </div>
                  <dl className="grid gap-2 text-xs sm:grid-cols-[78px_1fr] sm:gap-x-3">
                    <dt className="text-gray-500">Email</dt>
                    <dd className="break-all font-mono text-gray-200">{project.loginEmail}</dd>
                    <dt className="text-gray-500">Password</dt>
                    <dd className="break-all font-mono text-gray-200">{project.loginPassword}</dd>
                  </dl>
                </div>
              )}

              <div className="mt-auto flex flex-wrap items-end justify-between gap-1.5 pt-3 md:gap-2 md:pt-3">
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
                {project.link && project.link !== "#" && project.privatePreview && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-medium text-white transition hover:bg-primary/80"
                  >
                    {project.cta || "Open private preview"}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {project.link && project.link !== "#" && !project.privatePreview && (
                  <Button
                    onClick={() =>
                      openLivePreview({
                        url: project.link,
                        title: project.title,
                        cta: project.cta || "View Project",
                      })
                    }
                    className="px-3 py-1 text-xs sm:text-sm rounded-full bg-white/30 backdrop-blur-md border border-white/40 shadow-md text-primary hover:bg-primary/80 hover:text-white transition-all ml-2"
                    style={{ minWidth: "70px" }}
                  >
                    Live Link
                  </Button>
                )}
              </div>
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
                  aria-label={`Show project ${i + 1}: ${projects[i].title}`}
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

      {(previewOpen || mountedPreviewUrls.length > 0) &&
        createPortal(
          <>
            {previewOpen && (
              <button
                type="button"
                aria-label="Close preview"
                className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm"
                onClick={() => setPreviewOpen(false)}
              />
            )}
            <div
              role="dialog"
              aria-modal={previewOpen}
              aria-hidden={!previewOpen}
              aria-label={previewMeta?.title ?? "Project preview"}
              className={cn(
                "fixed z-[210] flex max-w-5xl flex-col overflow-hidden border border-white/10 bg-black/80 backdrop-blur-xl",
                previewOpen
                  ? "left-1/2 top-1/2 h-[90vh] w-[95vw] -translate-x-1/2 -translate-y-1/2"
                  : "pointer-events-none left-0 top-0 h-[720px] w-[1280px] -translate-x-full opacity-0",
              )}
            >
              <div
                className={cn(
                  "relative flex items-center justify-between border-b border-white/10 bg-black/40 p-4",
                  !previewOpen && "hidden",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </div>
                {previewMeta && (
                  <a
                    href={previewMeta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:text-white"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {previewMeta.cta}
                  </a>
                )}
                <button
                  type="button"
                  className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
                  onClick={() => setPreviewOpen(false)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </button>
              </div>

              <div className="relative min-h-0 flex-1 bg-white">
                {previewOpen && previewLoading && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90">
                    <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
                    <p className="font-mono text-sm text-primary/60">
                      Establishing secure connection...
                    </p>
                  </div>
                )}
                {mountedPreviewUrls.map((url) => {
                  const meta = PUBLIC_PREVIEW_PROJECTS.find((p) => p.link === url);
                  return (
                    <iframe
                      key={url}
                      src={url}
                      title={meta?.title ?? "Project preview"}
                      className={cn(
                        "absolute inset-0 h-full w-full border-none",
                        previewMeta?.url === url
                          ? "z-10"
                          : "pointer-events-none invisible z-0",
                      )}
                      onLoad={() => markPreviewLoaded(url)}
                      allowFullScreen
                    />
                  );
                })}
              </div>
            </div>
          </>,
          document.body,
        )}
    </div>
  );
};

export default ProjectSlider;
