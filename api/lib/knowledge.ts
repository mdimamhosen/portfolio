export interface KnowledgeChunk {
  id: string;
  title: string;
  content: string;
  category: string;
}

export const KNOWLEDGE_CHUNKS: KnowledgeChunk[] = [
  {
    id: 'identity',
    title: 'About Md. Imam Hosen',
    category: 'profile',
    content: `Md. Imam Hosen is a Software Engineer specializing in AI agent systems, full-stack development, and web automation. He builds intelligent, scalable systems across web applications, backend systems, and cloud infrastructure. He bridges innovative AI solutions with production-ready applications. Stats: 2+ years experience, 50+ projects delivered, 100% client satisfaction. Location: Barishal Sadar, Bangladesh. Email: mimam22.cse@bu.ac.bd. Phone/WhatsApp: +8801733570761. Upwork: https://www.upwork.com/freelancers/~01639e45e2f6ee7185 (Md Imam H.). Focus areas: AI & Automation, Web & Backend, DevOps & Cloud.`,
  },
  {
    id: 'hero-focus',
    title: 'Professional Focus Areas',
    category: 'profile',
    content: `Imam focuses on: building intelligent AI agents that automate complex workflows; developing scalable modern web applications with React, Next.js and Go; designing scalable backends with Go, Node.js and PostgreSQL; integrating LLMs and custom AI models into production systems; creating real-time applications with WebSocket and Socket.io.`,
  },
  {
    id: 'cohost',
    title: 'CoHost Venture',
    category: 'venture',
    content: `CoHost is Imam's venture where he is Co-Founder & Team Lead. CoHost is a full event management and ticketing platform for organizers, vendors, and attendees. Pillars: Ticketing & Management (create events, sell tickets, track everything); Local Discovery (hyper-local feeds for events happening now/this weekend); Vendor Ecosystem (tools for vendors and organizers across music, nightlife, sports); Curated Experiences (concerts, festivals, food, tech, family, gaming, nightlife).`,
  },
  {
    id: 'exp-hashthink',
    title: 'Experience at Hashthink Technologies',
    category: 'experience',
    content: `Software Engineer at Hashthink Technologies, Canada (Remote), March 2026 - May 2026. Technologies: RAG Systems, LangChain, Twilio API, Socket.io, Redis, CRM Integration, AI Agents. Highlights: Engineered advanced Retrieval-Augmented Generation (RAG) pipelines and LLM-powered multi-agent systems using LangChain; designed real-time communication modules, webhook endpoints, and live chat with Twilio and Socket.io; integrated custom CRM pipelines with autonomous AI agents for lead classification and routing.`,
  },
  {
    id: 'exp-rixotech',
    title: 'Experience at RixoTech',
    category: 'experience',
    content: `Full Stack Engineer at RixoTech (Remote), January 2025 - December 2025. Technologies: React, Next.js, Node.js, Go, Redis, Socket.io, PostgreSQL, Docker, AWS. Highlights: Architected and deployed full-stack web apps with Redis caching and Socket.io live updates; built scalable microservices and RESTful APIs in Go and Node.js with optimized PostgreSQL schemas; streamlined deployments with Docker, AWS, and CI/CD pipelines.`,
  },
  {
    id: 'skills-frontend',
    title: 'Frontend Skills',
    category: 'skills',
    content: `Frontend skills: HTML5, CSS3, Tailwind CSS, TypeScript, JavaScript (ES6+), React, Next.js, Redux Toolkit, Zustand, Shadcn UI, Framer Motion.`,
  },
  {
    id: 'skills-backend',
    title: 'Backend & API Skills',
    category: 'skills',
    content: `Backend & APIs: Node.js, Express.js, Nest.js, Go (Golang), REST APIs, FastAPI, Python, GraphQL, WebSockets, Socket.io, Nodemailer.`,
  },
  {
    id: 'skills-cloud',
    title: 'Database & Cloud Skills',
    category: 'skills',
    content: `Database & Cloud: PostgreSQL, MongoDB, Redis, Prisma ORM, Mongoose, RTK Query, AWS, Docker, Git/GitHub, CI/CD Pipelines.`,
  },
  {
    id: 'skills-ai',
    title: 'AI & Integration Skills',
    category: 'skills',
    content: `AI & Integrations: LangChain, LlamaIndex, AI Agents, RAG Pipelines, Vector Databases, HubSpot CRM, Salesforce CRM, Square Integration, Twilio API, Stripe API.`,
  },
  {
    id: 'expertise',
    title: 'Core Expertise Areas',
    category: 'skills',
    content: `Expertise: API & System Integration — robust secure RESTful APIs and real-time WebSocket flows; AI Agent Systems — autonomous agents that reason, plan, and execute complex tasks; Full-Stack Architecture — cloud-native with AWS, Docker, Go, and scalable microservices.`,
  },
  {
    id: 'project-clientserve',
    title: 'Project: ClientServe AI',
    category: 'projects',
    content: `ClientServe AI — autonomous AI customer service agent system built at Hashthink Technologies. Uses RAG to handle voice, SMS, and chat interactions 24/7. Tech: AI Agents, RAG, LLMs, Vector DB. Live: https://clientserve.ai/`,
  },
  {
    id: 'project-apeiro',
    title: 'Project: Apeiro',
    category: 'projects',
    content: `Apeiro — brand-experience platform worked on at RixoTech. Rebuilt checkout system and launch campaign, increasing conversions by 38%. Tech: Next.js, React, TailwindCSS, CRO. Live: https://apeiro.ca/`,
  },
  {
    id: 'project-protiniyoto',
    title: 'Project: Protiniyoto',
    category: 'projects',
    content: `Protiniyoto — fully-featured e-commerce platform in Bangladesh for gadgets, smart watches, accessories, and home appliances. Tech: Next.js, React, TailwindCSS, E-commerce. Live: https://protiniyoto.com/`,
  },
  {
    id: 'project-greenbasket',
    title: 'Project: GreenBasket',
    category: 'projects',
    content: `GreenBasket — multi-vendor marketplace for fresh organic produce delivery. Tech: Next.js, TailwindCSS, Supabase, Framer Motion. Live: https://greenbasket-six.vercel.app/`,
  },
  {
    id: 'project-leafcare',
    title: 'Project: LeafCare AI',
    category: 'projects',
    content: `LeafCare AI — AI-based tree disease detection platform for farmers and researchers. Tech: Next.js, TensorFlow, TailwindCSS, AI. Live: https://leafcareai-ruddy.vercel.app/`,
  },
  {
    id: 'project-trelux',
    title: 'Project: TreLux',
    category: 'projects',
    content: `TreLux — e-commerce men's shopping website with modern UI and seamless checkout. Tech: React, Node.js, MongoDB, Stripe. Live: https://trelux.vercel.app/`,
  },
  {
    id: 'project-educoder',
    title: 'Project: EduCoder',
    category: 'projects',
    content: `EduCoder — e-learning platform connecting students and instructors with course management tools. Tech: Next.js, Supabase, TailwindCSS. Live: https://edu-coder.vercel.app/`,
  },
  {
    id: 'project-reviewhub',
    title: 'Project: ReviewHub',
    category: 'projects',
    content: `ReviewHub — product review platform for exploring and contributing premium interactive reviews. Tech: React, Node.js, MongoDB. Live: https://assignment-9-client-iota.vercel.app/`,
  },
  {
    id: 'project-butrace',
    title: 'Project: BU-Trace',
    category: 'projects',
    content: `BU-Trace — realtime bus tracking system for University of Barishal. Tech: React Native, Firebase, Map APIs.`,
  },
  {
    id: 'automation',
    title: 'Automation Capabilities',
    category: 'automation',
    content: `Automation workflow: Data Collection (scraping & API integration) → AI Processing (intelligent data transformation) → Workflow Automation (CRM & system integration) → Delivery (real-time notifications & reports). Stats: 50+ workflows built, 100+ tasks automated, 99.9% uptime, 24/7 monitoring.`,
  },
  {
    id: 'ai-agents',
    title: 'AI Agent Capabilities',
    category: 'ai',
    content: `AI agent work includes: Autonomous Agents (self-operating AI systems); Multi-Agent Systems (orchestrating agents on complex tasks); Agentic Workflows (AI-powered adaptive workflows); RAG Systems (retrieval-augmented generation); LLM Integration (GPT-4, Claude, open-source models); Prompt Engineering for reliable AI behavior.`,
  },
  {
    id: 'contact',
    title: 'How to Contact',
    category: 'contact',
    content: `To contact Md. Imam Hosen: Email mimam22.cse@bu.ac.bd, Phone/WhatsApp +8801733570761, Location Barishal Sadar Bangladesh, Upwork profile https://www.upwork.com/freelancers/~01639e45e2f6ee7185. He is open to project proposals, collaboration, and freelance work.`,
  },
];

export function getChunkText(chunk: KnowledgeChunk): string {
  return `${chunk.title}\n${chunk.content}`;
}
