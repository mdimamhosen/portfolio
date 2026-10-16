import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { ArrowUpRight, Download, Github, Package, Lock, Sparkles } from "lucide-react";

type Category = "Products" | "SaaS" | "AI" | "Open source" | "Hackathons";

interface Item {
  name: string;
  tagline: string;
  tags: Category[];
  tech: string[];
  live?: string;
  code?: string;
  npm?: string;
  privateCode?: boolean;
}

// Every entry links to something live or public; private codebases show a lock instead of a source link.
const items: Item[] = [
  { name: "JEV Router", tagline: "One endpoint for every model, one CLI for every MCP. Zero-dependency router for Claude Code, Codex and Cursor.", tags: ["Products", "AI", "Open source"], tech: ["Node.js", "MCP", "CLI"], npm: "https://www.npmjs.com/package/jevrouter", code: "https://github.com/mdimamhosen/jev" },
  { name: "TokenOptimizer", tagline: "Cross-platform developer tool with analytics and optimisation insights for AI coding assistants.", tags: ["Products", "AI", "Open source"], tech: ["Rust", "CLI", "Analytics"], code: "https://github.com/mdimamhosen/TokenOptimizer" },
  { name: "CountryCity JS", tagline: "TypeScript package for country, state, city, flag, ISO, currency, phone-code and coordinate search data.", tags: ["Products", "Open source"], tech: ["TypeScript", "npm"], code: "https://github.com/mdimamhosen/countrywisecity" },
  { name: "React Notification Kit", tagline: "Lightweight React library for toasts, modals, alerts, confirmations and loading states.", tags: ["Products", "Open source"], tech: ["React", "TypeScript"], code: "https://github.com/mdimamhosen/react-notification-kit" },
  { name: "VisaVibe Platform", tagline: "Student-visa agency suite: public site, immigration & education portal, and an installments ledger for payments.", tags: ["SaaS"], tech: ["Next.js", "TypeScript", "Node.js"], live: "https://visavibeofficial.vercel.app", privateCode: true },
  { name: "VisaVibe Portal", tagline: "Visa management, institution referral network and student immigration processing system.", tags: ["SaaS"], tech: ["Next.js", "TypeScript"], live: "https://visa-vibe-portal-app.vercel.app", privateCode: true },
  { name: "VisaVibe Ledger", tagline: "Executive ledger and installments management system for VisaVibe.", tags: ["SaaS"], tech: ["Next.js", "TypeScript"], live: "https://visa-vibe-payment.vercel.app", privateCode: true },
  { name: "Finessionals Back Office", tagline: "Omnichannel content pipeline — ideate, create, publish, analyse — across many brands with one engine.", tags: ["SaaS", "AI", "Open source"], tech: ["Python", "Pipelines"], live: "https://temerarii-sandbox.vercel.app/finessionals", code: "https://github.com/mdimamhosen/temerarii-operator-kit" },
  { name: "SupportIQ", tagline: "Visual-first AI chat application for professional support teams with a NestJS/PostgreSQL backend.", tags: ["SaaS", "AI", "Open source"], tech: ["NestJS", "PostgreSQL", "LLMs"], code: "https://github.com/mdimamhosen/SupportIQ" },
  { name: "RoundtableAI", tagline: "Photo-retouching desk: clients get an AI first pass, then a human editor finishes it.", tags: ["SaaS", "AI", "Open source"], tech: ["NestJS", "Next.js", "AI"], code: "https://github.com/mdimamhosen/RoundtableAI" },
  { name: "LeafCare AI", tagline: "Detects plant diseases from leaf photos, recommends vegetables for your climate, guides rooftop farming. English & Bangla.", tags: ["SaaS", "AI"], tech: ["Next.js", "TensorFlow"], live: "https://leafcareai-ruddy.vercel.app", privateCode: true },
  { name: "AlgoraX", tagline: "AI, web and mobile development studio site built for performance and search.", tags: ["SaaS"], tech: ["Next.js", "TypeScript"], live: "https://algora-x.vercel.app", code: "https://github.com/mdimamhosen/AlgoraX" },
  { name: "CSE BU Bootcamp", tagline: "Practical engineering, competitive programming and research bootcamp platform for CSE, University of Barishal.", tags: ["SaaS"], tech: ["Next.js", "TypeScript"], live: "https://bucsebootcamp.vercel.app", privateCode: true },
  { name: "Melbourne Institute of Technology", tagline: "Institution website plus ResultHub, a student results portal with sign-in.", tags: ["SaaS"], tech: ["React Router", "TypeScript"], live: "https://melbourne-institute-of-technology.vercel.app", code: "https://github.com/mdimamhosen/MelbourneInstituteOfTechnology" },
  { name: "GreenBasket", tagline: "Multi-vendor marketplace for fresh, organic produce delivered to your door.", tags: ["SaaS"], tech: ["Next.js", "Supabase"], live: "https://greenbasket-six.vercel.app", privateCode: true },
  { name: "TreLux", tagline: "Premium men's fashion store with curated collections and seamless checkout.", tags: ["SaaS"], tech: ["React", "Node.js", "Stripe"], live: "https://trelux.vercel.app", privateCode: true },
  { name: "EduCoder", tagline: "Learning platform connecting students and tutors with course creation, enrolment and management.", tags: ["SaaS", "Open source"], tech: ["Next.js", "Supabase"], live: "https://edu-coder.vercel.app", code: "https://github.com/mdimamhosen/EduCoder" },
  { name: "HR Hub Pro", tagline: "HR management platform for teams and payroll workflows.", tags: ["SaaS", "Open source"], tech: ["React", "Firebase"], live: "https://hr-hub-pro.web.app/", code: "https://github.com/mdimamhosen/HRProHub" },
  { name: "LifeFlow", tagline: "Blood-donation platform connecting donors, recipients and volunteers with roles and donation management.", tags: ["SaaS", "Open source"], tech: ["React", "Node.js", "MongoDB"], live: "https://lifeflow-72f2b.firebaseapp.com/", code: "https://github.com/mdimamhosen/LifeFlow-Client" },
  { name: "ArtVista", tagline: "Multi-vendor marketplace for artworks.", tags: ["SaaS", "Open source"], tech: ["React", "Firebase"], live: "https://artvista-d1084.web.app/", code: "https://github.com/mdimamhosen/ArtVista_Client" },
  { name: "DocCare", tagline: "Book consultations with trusted healthcare professionals, any time.", tags: ["SaaS", "Open source"], tech: ["React", "Tailwind"], live: "https://doccare-7847e.firebaseapp.com/", code: "https://github.com/mdimamhosen/DocCare-Client" },
  { name: "StoryNest", tagline: "Book shop with auth, product management and SurjoPay payments.", tags: ["SaaS", "Open source"], tech: ["TypeScript", "Mongoose"], live: "https://srorynest-omega.vercel.app", code: "https://github.com/mdimamhosen/SroryNest-Client" },
  { name: "Teacher's Center", tagline: "Platform for teachers to share resources and connect.", tags: ["SaaS", "Open source"], tech: ["Next.js"], live: "https://teacherscenter.vercel.app", code: "https://github.com/mdimamhosen/Teacher-s-Center" },
  { name: "MAVIS Eye Disease", tagline: "Explainable deep learning for multi-class eye-disease classification.", tags: ["AI", "Open source"], tech: ["PyTorch", "Grad-CAM"], code: "https://github.com/mdimamhosen/MAVIS-EyeDisease" },
  { name: "ConversationalDB", tagline: "Ask your database in plain language; get SQL and answers back.", tags: ["AI", "Hackathons", "Open source"], tech: ["LLMs", "SQL"], code: "https://github.com/mdimamhosen/buet-hackathon" },
  { name: "Emergency Response Optimizer", tagline: "Country-scale backend that ingests incidents and allocates ambulances, hospitals and rescue teams, re-optimising live.", tags: ["Hackathons", "Open source"], tech: ["NestJS", "Optimisation"], code: "https://github.com/mdimamhosen/PSTUHackathon" },
  { name: "Relay Wallet", tagline: "Closed-loop peer-to-peer digital wallet (monorepo).", tags: ["Hackathons", "Open source"], tech: ["TypeScript", "Monorepo"], code: "https://github.com/mdimamhosen/PSTUFinalHackathon" },
  { name: "Mars Walk Planner", tagline: "Plan a walk on Mars from evidence, not guesswork. NASA Space Apps Challenge.", tags: ["Hackathons", "Open source"], tech: ["TypeScript", "NASA data"], code: "https://github.com/mdimamhosen/NASASpaceAPPChallenge" },
];

const filters: ("All" | Category)[] = ["All", "Products", "SaaS", "AI", "Open source", "Hackathons"];

const Products = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const shown = useMemo(() => (filter === "All" ? items : items.filter((i) => i.tags.includes(filter))), [filter]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".prod-head", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, ease: "power4.out", scrollTrigger: { trigger: sectionRef.current, start: "top 65%" } });
      gsap.fromTo(".prod-hero", { opacity: 0, y: 50, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power4.out", scrollTrigger: { trigger: ".prod-hero", start: "top 85%" } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Re-animate cards whenever the filter changes.
  useEffect(() => {
    if (!gridRef.current) return;
    gsap.fromTo(gridRef.current.children, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: "power3.out" });
  }, [filter]);

  const count = (f: (typeof filters)[number]) => (f === "All" ? items.length : items.filter((i) => i.tags.includes(f)).length);

  return (
    <section ref={sectionRef} className="section-container py-32 px-6 relative">
      <div className="max-w-6xl mx-auto content-overlay">
        <p className="text-mono mb-4 opacity-60">Products / SaaS</p>
        <div className="prod-head mb-12">
          <h2 className="text-section">
            Things I've <span className="text-primary text-glow">shipped</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            Products, SaaS platforms, developer tools and AI systems — from a cross-platform file-transfer app in Rust to
            visa-agency suites in production.
          </p>
        </div>

        {/* Flagship product */}
        <div className="prod-hero relative overflow-hidden rounded-3xl mb-14 border border-primary/20 bg-background/70 backdrop-blur-md">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/15 via-cyan-500/10 to-violet-600/15" />
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-blue-600/20 blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
          <div className="relative grid lg:grid-cols-[1.2fr_1fr] gap-10 p-8 md:p-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-primary/15 text-primary mb-5">
                <Sparkles className="w-3.5 h-3.5" /> Flagship product · v0.1.0
              </span>
              <h3 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">DropBridge</h3>
              <p className="text-lg text-muted-foreground mb-6">
                AirDrop-style file sharing between Android, macOS, Windows and Linux. Direct over Wi-Fi, end-to-end encrypted
                with TLS 1.3, every file verified with BLAKE3, resumes after Wi-Fi drops. No account, no cloud.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {["Rust", "Tauri 2", "Kotlin · Compose", "UniFFI", "TLS 1.3", "mDNS"].map((t) => (
                  <span key={t} className="px-3 py-1 text-xs bg-muted rounded-full text-muted-foreground">{t}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="/DropBridge/" className="btn-primary inline-flex items-center gap-2">Visit website <ArrowUpRight className="w-4 h-4" /></a>
                <a href="https://github.com/mdimamhosen/DropBridge/releases/latest" className="btn-outline inline-flex items-center gap-2" target="_blank" rel="noreferrer"><Download className="w-4 h-4" /> Download</a>
                <a href="https://github.com/mdimamhosen/DropBridge" className="btn-outline inline-flex items-center gap-2" target="_blank" rel="noreferrer"><Github className="w-4 h-4" /> Source</a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["1.8 GB/s", "engine throughput"],
                ["4", "platforms, one core"],
                ["0", "servers touched"],
                ["43 MB", "RAM for a 10 GB file"],
              ].map(([v, l]) => (
                <div key={l} className="glass-card p-5 text-center hover:-translate-y-1 transition-transform">
                  <div className="text-2xl md:text-3xl font-bold text-primary">{v}</div>
                  <div className="text-xs text-muted-foreground mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Filter products">
          {filters.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                filter === f ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
              }`}
            >
              {f} <span className="opacity-60 ml-1">{count(f)}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {shown.map((p) => (
            <article key={p.name} className="group glass-card p-6 flex flex-col relative overflow-hidden hover:-translate-y-1 hover:border-primary/30 transition-all duration-300">
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/30 to-cyan-500/20 grid place-items-center font-bold text-primary">
                  {p.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
                <div className="flex gap-1.5 flex-wrap justify-end">
                  {p.tags.filter((t) => t !== "Open source").map((t) => (
                    <span key={t} className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{t}</span>
                  ))}
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{p.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">{p.tagline}</p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {p.tech.map((t) => (
                  <span key={t} className="px-2.5 py-0.5 text-xs bg-muted/60 rounded-full text-muted-foreground">{t}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 text-sm font-medium">
                {p.live && <a href={p.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">Live <ArrowUpRight className="w-3.5 h-3.5" /></a>}
                {p.npm && <a href={p.npm} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline"><Package className="w-3.5 h-3.5" /> npm</a>}
                {p.code && <a href={p.code} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"><Github className="w-3.5 h-3.5" /> Code</a>}
                {p.privateCode && <span className="inline-flex items-center gap-1 text-muted-foreground/70" title="Client / private codebase"><Lock className="w-3.5 h-3.5" /> Private code</span>}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a href="https://github.com/mdimamhosen?tab=repositories" target="_blank" rel="noreferrer" className="btn-outline inline-flex items-center gap-2">
            <Github className="w-4 h-4" /> All repositories
          </a>
        </div>
      </div>
    </section>
  );
};

export default Products;
