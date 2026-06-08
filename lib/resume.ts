/**
 * SINGLE SOURCE OF TRUTH for all site content derived from Arqam Tahir's resume.
 * Every fact, metric, date, and role below comes directly from the resume.
 * Do NOT invent experience. Items needing real-world data carry a `TODO` note.
 */

export const profile = {
  name: "Arqam Tahir",
  firstName: "Arqam",
  titles: [
    "Senior Software Engineer",
    "Full Stack Developer",
    "MERN / MEAN Stack",
  ],
  tagline: "Building high-performance web applications that scale.",
  subtagline:
    "Specializing in React, Next.js, TypeScript, Vue, Node.js, cloud infrastructure, SEO optimization, and modern product engineering.",
  summary:
    "Results-driven Senior Software Engineer with 5+ years of experience architecting and delivering scalable, high-performance web applications across travel-tech, hospitality, e-commerce, and SaaS platforms. Expert in full-stack JavaScript using the MERN and MEAN stacks, with a consistent record of measurable impact: sub-3s LCP, 100/100 Lighthouse SEO, and 40%+ faster component delivery.",
  location: "Lahore, Pakistan",
  relocation: "Open to relocation - UAE / KSA / Qatar",
  remote: "Remote-ready across EST, CET, GST, and PKT time zones",
  email: "muhammadarqam920@gmail.com",
  phone: "+92 300 6161806",
  experienceYears: "5+",
  availability:
    "Currently available for consulting, freelance projects, and full-time opportunities.",
  currentRole: "Senior Software Engineer @ Nice2Stay",
  // TODO: replace with a polished, designed PDF résumé export when available.
  resumeUrl: "/Arqam_Tahir_Resume.docx",
  links: {
    linkedin: "https://linkedin.com/in/arqam-tahir",
    github: "https://github.com/arqamtahir",
    email: "mailto:muhammadarqam920@gmail.com",
  },
} as const;

/** Animated counters - every value is from the resume. */
export type Metric = { label: string; value: number; prefix?: string; suffix?: string };
export const metrics: Metric[] = [
  { label: "Years of experience", value: 5, suffix: "+" },
  { label: "Lighthouse SEO score", value: 100, suffix: "/100" },
  { label: "Largest Contentful Paint", value: 3, prefix: "<", suffix: "s" },
  { label: "Faster component delivery", value: 40, suffix: "%+" },
  { label: "Language markets supported", value: 5, suffix: "+" },
  { label: "Uptime on booking flows", value: 99, suffix: "%+" },
  { label: "Production platforms shipped", value: 3, suffix: "" },
] as const;

export const skills = {
  Languages: ["JavaScript (ES6+)", "TypeScript", "Python", "HTML5", "CSS3", "SCSS"],
  Frontend: [
    "React.js", "Next.js", "Angular", "Vue.js", "Nuxt.js", "Redux", "Zustand",
    "React Query", "TanStack Query", "Pinia", "Framer Motion", "Material UI",
    "Tailwind CSS", "Ant Design", "Mantine UI", "Bootstrap",
  ],
  Backend: [
    "Node.js", "Express.js", "NestJS", "Django", "FastAPI", "REST APIs",
    "GraphQL", "tRPC", "Microservices", "WebSockets", "JWT", "OAuth 2.0",
    "Zod", "Prisma ORM",
  ],
  Databases: ["MongoDB", "PostgreSQL", "MySQL", "Sequelize ORM", "Mongoose", "Redis"],
  "Cloud & DevOps": [
    "AWS (EC2, S3, Lambda, RDS, IAM, ECR, ECS, Amplify, CloudFront)", "Docker",
    "CI/CD", "GitHub Actions", "Nginx", "Vercel", "Netlify", "Terraform",
  ],
  "AI / LLMs": [
    "OpenAI API", "LangChain", "RAG", "Vector Databases", "LLM Integration",
    "Prompt Engineering", "AI-Powered Features",
  ],
  Architecture: [
    "System Design", "Microservices", "MVC", "RESTful API Design", "SSR", "SSG",
    "Component-Driven Design", "i18n", "L10n", "Technical Leadership", "Mentoring",
  ],
  "Testing & QA": [
    "Jest", "Cypress", "Playwright", "React Testing Library", "Unit Testing",
    "Integration Testing", "E2E Testing", "Lighthouse Audits",
  ],
  "Tools & Collab": [
    "Git", "GitHub", "Bitbucket", "Docker", "Jira", "ClickUp", "Trello",
    "Notion", "Slack", "Figma",
  ],
} as const;

/** Marquee groupings drawn from the real stack. */
export const techEcosystem = {
  Frontend: ["React", "Next.js", "Vue", "Nuxt", "Angular", "TypeScript", "Tailwind CSS", "Framer Motion"],
  Backend: ["Node.js", "Express", "NestJS", "Django", "FastAPI", "GraphQL", "tRPC", "Prisma"],
  Cloud: ["AWS EC2", "S3", "Lambda", "RDS", "CloudFront", "ECS", "Vercel", "Netlify"],
  AI: ["OpenAI API", "LangChain", "RAG", "Vector DBs"],
  DevOps: ["Docker", "GitHub Actions", "CI/CD", "Nginx", "Terraform"],
  Testing: ["Jest", "Cypress", "Playwright", "RTL"],
} as const;

export type Experience = {
  company: string;
  role: string;
  period: string;
  industry: string;
  location: string;
  impact: string[];
  tech: string[];
};

export const experience: Experience[] = [
  {
    company: "Nice2Stay",
    role: "Senior Software Engineer",
    period: "Apr 2023 – Present",
    industry: "Hospitality / Travel-Tech SaaS",
    location: "Remote",
    impact: [
      "Spearheaded the full frontend revamp using Vue.js and Nuxt.js, improving developer velocity by 40% through modular, reusable component design.",
      "Achieved a perfect 100/100 Lighthouse SEO score and reduced LCP to under 3 seconds via SSR, image optimization, lazy loading, and strategic caching.",
      "Engineered an intelligent booking interface with custom date pickers, dynamic availability filters, and real-time property data - lifting search-to-booking conversion.",
      "Implemented internationalized routing and multilingual (i18n/L10n) support across 5+ language markets, including RTL layout support.",
      "Decomposed monolithic components into a scalable architecture, cutting new-feature development time by 40%+.",
    ],
    tech: ["Vue.js", "Nuxt.js", "Node.js", "REST APIs", "i18n", "SSR"],
  },
  {
    company: "Hotel Weekend",
    role: "Software Engineer",
    period: "Aug 2023 – Present",
    industry: "Travel & Hospitality",
    location: "Remote",
    impact: [
      "Led the full redevelopment of Hotel-Weekend.com from the ground up using Nuxt.js and Vue 3, transforming a legacy codebase into a high-performance, SEO-optimized platform.",
      "Architected a dynamic destination and theme-based browsing system with curated property collections, increasing session duration.",
      "Implemented custom filters, lazy-loaded assets, and fully responsive layouts across iOS, Android, and desktop.",
      "Delivered near-perfect Lighthouse performance and SEO scores, contributing to improved SERP rankings and organic traffic.",
    ],
    tech: ["Nuxt.js", "Vue 3", "SSR", "Tailwind CSS"],
  },
  {
    company: "StayWithLumina",
    role: "Software Engineer (Full Stack - MERN)",
    period: "Jul 2022 – Jul 2023",
    industry: "Vacation Rental Platform",
    location: "Remote",
    impact: [
      "Architected and delivered the end-to-end full-stack build using Next.js, React, Node.js, and MongoDB - from database design to production deployment.",
      "Integrated Guesty's property management API to synchronize listings, real-time availability, reservations, and guest data, eliminating manual data entry.",
      "Implemented SSR, dynamic routing, and Framer Motion animations, boosting Core Web Vitals.",
      "Built custom booking workflows and availability-aware filters, reducing booking abandonment.",
      "Ensured API reliability through error boundaries and retry logic - achieving 99%+ uptime for critical booking flows.",
    ],
    tech: ["Next.js", "React", "Node.js", "MongoDB", "Guesty API", "Framer Motion"],
  },
  {
    company: "Wisdom Coders",
    role: "Associate Software Engineer",
    period: "Mar 2021 – Apr 2022",
    industry: "Software Consultancy",
    location: "Lahore, Pakistan",
    impact: [
      "Contributed to 5+ multi-client web application projects, delivering responsive frontends using React and JavaScript within agile sprints.",
      "Translated complex client requirements into clean, maintainable frontend solutions, consistently meeting delivery timelines.",
      "Performed performance tuning and cross-platform responsiveness improvements on client-facing applications.",
      "Adopted Git, testing workflows, and CI/CD practices, reducing integration issues.",
    ],
    tech: ["React", "JavaScript", "Git", "CI/CD"],
  },
];

export type ProjectCategory = "Full Stack" | "Frontend" | "SaaS" | "Performance" | "SEO" | "AI";

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  category: ProjectCategory[];
  year: string;
  role: string;
  stack: string[];
  challenge: string;
  solution: string;
  results: string[];
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "nice2stay",
    name: "Nice2Stay",
    tagline: "Vacation rental booking platform rebuilt for speed and global reach.",
    category: ["Frontend", "SaaS", "Performance", "SEO"],
    year: "2023",
    role: "Senior Software Engineer",
    stack: ["Vue.js", "Nuxt.js", "Node.js", "REST APIs", "i18n", "SSR"],
    challenge:
      "A hospitality SaaS platform needed a complete frontend overhaul to improve performance, organic discoverability, and the booking experience across multiple language markets.",
    solution:
      "Rebuilt the end-to-end frontend architecture with Vue.js and Nuxt.js - introducing SSR, a modular component system, i18n routing with RTL support, and an intelligent booking UI with custom date pickers and real-time availability.",
    results: [
      "100/100 Lighthouse SEO score",
      "LCP reduced to under 3 seconds",
      "40% faster feature development",
      "i18n across 5+ language markets with RTL support",
    ],
    featured: true,
  },
  {
    slug: "staywithlumina",
    name: "StayWithLumina",
    tagline: "Full-stack short-term rental platform built from scratch.",
    category: ["Full Stack", "SaaS", "Performance"],
    year: "2022",
    role: "Full Stack Engineer (MERN)",
    stack: ["Next.js", "React", "Node.js", "MongoDB", "Guesty API", "Framer Motion"],
    challenge:
      "A short-term vacation rental business needed a production-grade platform - from database design to deployment - with reliable real-time syncing against an external property management system.",
    solution:
      "Delivered a full-stack MERN platform featuring SSR, dynamic routing, Framer Motion animations, custom multi-step booking workflows, and a Guesty PMS API integration with robust error boundaries and retry logic.",
    results: [
      "99%+ uptime on booking-critical endpoints",
      "Near-perfect Core Web Vitals scores",
      "Automated listing/availability sync via Guesty API",
      "Reduced booking abandonment with availability-aware filters",
    ],
    featured: true,
  },
  {
    slug: "hotel-weekend",
    name: "Hotel Weekend",
    tagline: "Legacy travel platform reborn as an SEO-first discovery engine.",
    category: ["Frontend", "Performance", "SEO"],
    year: "2023",
    role: "Software Engineer",
    stack: ["Nuxt.js", "Vue 3", "SSR", "Tailwind CSS"],
    challenge:
      "Hotel-Weekend.com ran on a legacy codebase that limited performance, SEO, and the ability to surface curated travel content to users.",
    solution:
      "Redeveloped the platform from the ground up with Nuxt.js and Vue 3 - adding a dynamic destination and theme-based discovery system, curated filters, lazy-loaded assets, and fully responsive layouts.",
    results: [
      "Near-perfect Lighthouse performance & SEO",
      "Improved SERP rankings and organic traffic",
      "Higher session duration via content-rich browsing",
      "Cross-device compatibility (iOS, Android, desktop)",
    ],
    featured: true,
  },
];

/**
 * Long-form case-study content for project detail pages.
 * STRICTLY derived from the resume - no fabricated infrastructure, metrics,
 * clients, or claims. Architecture layers only name technologies the resume
 * explicitly attributes to each project.
 */
export type ArchitectureLayer = {
  label: string;
  role: string;
  tech: string[];
};

export type PerfStat = {
  label: string;
  value: string;
  detail: string;
};

export type Challenge = {
  title: string;
  body: string;
};

export type CaseStudy = {
  slug: string;
  summary: string;
  problem: string[];
  solution: string[];
  architecture: ArchitectureLayer[];
  challenges: Challenge[];
  performance: PerfStat[];
  learnings: string[];
};

export const caseStudies: Record<string, CaseStudy> = {
  nice2stay: {
    slug: "nice2stay",
    summary:
      "As Senior Software Engineer at Nice2Stay, I led a complete frontend revamp of a hospitality SaaS booking platform - rebuilding it on Vue.js and Nuxt.js to achieve a perfect Lighthouse SEO score, sub-3-second LCP, and internationalized reach across 5+ language markets.",
    problem: [
      "The existing frontend held back performance, organic discoverability, and the booking experience across multiple language markets.",
      "Monolithic components slowed feature delivery and made it hard to ship consistent, high-quality UI at the pace the business needed.",
      "International guests needed first-class, localized experiences - including right-to-left layouts - that the platform could not yet provide.",
    ],
    solution: [
      "Spearheaded a full frontend revamp using Vue.js and Nuxt.js, introducing server-side rendering for fast first paints and SEO-ready markup.",
      "Built a modular, reusable component system that decomposed monolithic UI and cut new-feature development time by 40%+.",
      "Engineered an intelligent booking interface with custom date pickers, dynamic availability filters, and real-time property data to lift search-to-booking conversion.",
      "Implemented internationalized routing and multilingual (i18n/L10n) support across 5+ language markets, including full RTL layout support.",
      "Tuned performance with image optimization, lazy loading, and strategic caching to reach a 100/100 Lighthouse SEO score and sub-3s LCP.",
    ],
    architecture: [
      {
        label: "Presentation",
        role: "Server-rendered UI & booking experience",
        tech: ["Vue.js", "Nuxt.js", "SSR"],
      },
      {
        label: "Internationalization",
        role: "i18n routing, localization & RTL layouts",
        tech: ["i18n", "L10n", "RTL"],
      },
      {
        label: "Data & APIs",
        role: "Real-time property & availability data",
        tech: ["Node.js", "REST APIs"],
      },
      {
        label: "Delivery & performance",
        role: "Image optimization, lazy loading & caching",
        tech: ["Caching", "Lazy loading", "Image optimization"],
      },
    ],
    challenges: [
      {
        title: "Decomposing a monolithic frontend",
        body: "Breaking tightly coupled components into a scalable, reusable architecture without disrupting the live booking flow - ultimately cutting feature delivery time by 40%+.",
      },
      {
        title: "SEO at SSR scale",
        body: "Reaching a perfect 100/100 Lighthouse SEO score required SSR, semantic markup, and careful asset strategy across a content-rich, multi-market site.",
      },
      {
        title: "Multilingual & RTL correctness",
        body: "Supporting 5+ language markets meant internationalized routing and full right-to-left layout support without forking the component system.",
      },
    ],
    performance: [
      { label: "Lighthouse SEO", value: "100/100", detail: "Perfect score on a production hospitality platform." },
      { label: "Largest Contentful Paint", value: "<3s", detail: "Via SSR, image optimization, lazy loading & caching." },
      { label: "Feature delivery", value: "40%+ faster", detail: "Through modular, reusable component design." },
      { label: "Language markets", value: "5+", detail: "Internationalized routing with RTL support." },
    ],
    learnings: [
      "SSR and a disciplined asset strategy are what turn a fast framework into a perfect Lighthouse score in production.",
      "Investing early in a modular component system compounds - it paid back as 40%+ faster feature delivery.",
      "Internationalization and RTL are architecture decisions, not afterthoughts; baking them into routing kept the system clean.",
    ],
  },
  staywithlumina: {
    slug: "staywithlumina",
    summary:
      "I architected and delivered StayWithLumina end-to-end as the full-stack (MERN) engineer - from database design to production deployment - integrating Guesty's property management API for real-time listing and reservation sync, and hardening booking-critical flows to 99%+ uptime.",
    problem: [
      "A short-term vacation rental business needed a production-grade platform built from the ground up - database design through deployment.",
      "Listings, availability, reservations, and guest data had to stay reliably in sync with an external property management system, eliminating manual data entry.",
      "Booking-critical endpoints needed to stay reliable under real traffic to avoid lost reservations and abandonment.",
    ],
    solution: [
      "Architected and delivered the full-stack build with Next.js, React, Node.js, and MongoDB - owning everything from data modeling to production deployment.",
      "Integrated Guesty's property management API to synchronize listings, real-time availability, reservations, and guest data automatically.",
      "Implemented SSR, dynamic routing, and Framer Motion animations to boost Core Web Vitals and the feel of the product.",
      "Built custom multi-step booking workflows and availability-aware filters to reduce booking abandonment.",
      "Ensured API reliability through error boundaries and retry logic - achieving 99%+ uptime on critical booking flows.",
    ],
    architecture: [
      {
        label: "Presentation",
        role: "Server-rendered UI, routing & motion",
        tech: ["Next.js", "React", "SSR", "Framer Motion"],
      },
      {
        label: "Application & API",
        role: "Booking workflows & business logic",
        tech: ["Node.js", "REST APIs"],
      },
      {
        label: "Database",
        role: "Listings, reservations & guest data",
        tech: ["MongoDB"],
      },
      {
        label: "Third-party integration",
        role: "Real-time property management sync",
        tech: ["Guesty PMS API"],
      },
    ],
    challenges: [
      {
        title: "Reliable third-party sync",
        body: "Keeping listings, availability, and reservations consistent with Guesty's API in real time - without manual data entry - demanded careful integration and reconciliation.",
      },
      {
        title: "Resilience on booking flows",
        body: "Booking endpoints can't fail silently. Error boundaries and retry logic were essential to reach 99%+ uptime on the paths that earn revenue.",
      },
      {
        title: "Owning the full stack solo",
        body: "Designing the data model, API, and UI as one coherent system - from MongoDB schema to deployed product - while keeping Core Web Vitals strong.",
      },
    ],
    performance: [
      { label: "Booking-flow uptime", value: "99%+", detail: "Via error boundaries and retry logic on critical endpoints." },
      { label: "Core Web Vitals", value: "Near-perfect", detail: "Through SSR, dynamic routing & optimized motion." },
      { label: "PMS sync", value: "Automated", detail: "Listings & availability synced via the Guesty API." },
      { label: "Booking abandonment", value: "Reduced", detail: "With availability-aware filters and multi-step flows." },
    ],
    learnings: [
      "A resilient integration layer - retries and error boundaries - is what separates a demo from a 99%+ uptime booking system.",
      "Owning the stack end-to-end lets the data model, API, and UI evolve together instead of fighting each other.",
      "Motion and SSR can coexist with strong Core Web Vitals when animation is applied deliberately, not decoratively.",
    ],
  },
  "hotel-weekend": {
    slug: "hotel-weekend",
    summary:
      "I led the full redevelopment of Hotel-Weekend.com from the ground up on Nuxt.js and Vue 3 - transforming a legacy codebase into a high-performance, SEO-first discovery platform with a dynamic destination and theme-based browsing system, and near-perfect Lighthouse scores.",
    problem: [
      "Hotel-Weekend.com ran on a legacy codebase that capped performance, SEO, and the ability to surface curated travel content.",
      "Users needed a richer way to discover stays - by destination and theme - rather than a flat, slow catalog.",
      "The experience had to be fast and fully responsive across iOS, Android, and desktop to compete for organic traffic.",
    ],
    solution: [
      "Rebuilt the platform from the ground up with Nuxt.js and Vue 3, replacing the legacy codebase with a high-performance, SEO-optimized foundation.",
      "Architected a dynamic destination and theme-based browsing system with curated property collections to increase session duration.",
      "Implemented custom filters, lazy-loaded assets, and fully responsive layouts across iOS, Android, and desktop.",
      "Delivered near-perfect Lighthouse performance and SEO, contributing to improved SERP rankings and organic traffic.",
    ],
    architecture: [
      {
        label: "Presentation",
        role: "Server-rendered, responsive UI",
        tech: ["Nuxt.js", "Vue 3", "SSR", "Tailwind CSS"],
      },
      {
        label: "Discovery system",
        role: "Destination & theme-based browsing",
        tech: ["Curated collections", "Custom filters"],
      },
      {
        label: "Delivery & performance",
        role: "Lazy-loaded assets & responsive layouts",
        tech: ["Lazy loading", "Responsive design"],
      },
    ],
    challenges: [
      {
        title: "Rebuilding without losing SEO equity",
        body: "Replacing a legacy codebase from the ground up while improving - not jeopardizing - SERP rankings and organic traffic required an SEO-first rebuild.",
      },
      {
        title: "Designing for discovery",
        body: "A destination and theme-based browsing system with curated collections had to make exploration effortless and increase session duration.",
      },
      {
        title: "Cross-device performance",
        body: "Near-perfect Lighthouse scores had to hold across iOS, Android, and desktop with lazy-loaded assets and fully responsive layouts.",
      },
    ],
    performance: [
      { label: "Lighthouse", value: "Near-perfect", detail: "Performance & SEO on the rebuilt platform." },
      { label: "Organic traffic", value: "Improved", detail: "Through better SERP rankings post-rebuild." },
      { label: "Session duration", value: "Higher", detail: "Via content-rich, theme-based browsing." },
      { label: "Devices", value: "iOS · Android · Desktop", detail: "Fully responsive across platforms." },
    ],
    learnings: [
      "A ground-up rebuild is the moment to make SEO structural - it's far cheaper than retrofitting it later.",
      "Discovery UX (destinations, themes, curation) drives engagement metrics as much as raw performance does.",
      "Lazy loading and responsive layouts are non-negotiable for holding Lighthouse scores across real devices.",
    ],
  },
};

/** Audience segmentation for who I work with. */
export const audiences = [
  "Founders",
  "Startups",
  "Agencies",
  "Product Teams",
  "Employers",
] as const;

/**
 * Services framed as outcomes, not capabilities.
 * Derived strictly from real skills and delivered results.
 */
export type Service = {
  outcome: string;
  value: string;
  included: string[];
  audiences: string[];
  cta: string;
  featured?: boolean;
};

export const services: Service[] = [
  {
    outcome: "Build and launch production-ready SaaS products",
    value:
      "End-to-end MERN/MEAN builds - from database design to deployment - shipped as scalable, maintainable products, not prototypes.",
    included: [
      "Full-stack architecture & data modeling",
      "SSR/SSG, real-time data & API integrations",
      "Component-driven design system",
      "Production deployment on AWS / Vercel",
    ],
    audiences: ["Founders", "Startups"],
    cta: "Start a build",
    featured: true,
  },
  {
    outcome: "Make slow products fast and discoverable",
    value:
      "Performance and SEO engineering that has earned 100/100 Lighthouse scores and sub-3s LCP on production platforms.",
    included: [
      "Core Web Vitals & LCP optimization",
      "Technical SEO & structured data",
      "Caching, image & font strategy",
      "Lighthouse audits with measurable gains",
    ],
    audiences: ["Product Teams", "Agencies"],
    cta: "Audit my site",
  },
  {
    outcome: "Modernize and rescue legacy frontends",
    value:
      "Decompose monolithic codebases into modular, reusable architecture - cutting feature delivery time by 40%+.",
    included: [
      "Frontend re-architecture (React / Vue)",
      "Design-system & component library work",
      "Incremental migration strategy",
      "Developer-velocity improvements",
    ],
    audiences: ["Product Teams", "Agencies"],
    cta: "Plan a rebuild",
  },
  {
    outcome: "Reach global markets with i18n & RTL",
    value:
      "Internationalized, localized platforms shipped across 5+ language markets, including full right-to-left support.",
    included: [
      "i18n routing & localization (L10n)",
      "RTL layout support",
      "Region-aware UX & content",
      "Multilingual SEO",
    ],
    audiences: ["Founders", "Startups"],
    cta: "Go international",
  },
  {
    outcome: "Add a senior engineer to your team",
    value:
      "Full-time or embedded engineering with technical leadership, mentoring, and a track record of shipping at scale.",
    included: [
      "Full-stack feature delivery",
      "Architecture & code review",
      "Mentoring & best practices",
      "Cross-functional collaboration",
    ],
    audiences: ["Employers", "Product Teams"],
    cta: "Let's talk",
  },
  {
    outcome: "Integrate AI features that ship",
    value:
      "OpenAI, LangChain, and RAG-powered features integrated into real products with vector search and prompt engineering.",
    included: [
      "LLM & OpenAI API integration",
      "RAG & vector databases",
      "Prompt engineering",
      "AI-powered product features",
    ],
    audiences: ["Founders", "Startups"],
    cta: "Explore AI",
  },
];

/**
 * Testimonials - PLACEHOLDER / TODO.
 * No quotes are fabricated. Replace `quote`, `author`, and `role` with real,
 * approved testimonials. Set `placeholder: false` to display a card.
 */
export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  placeholder: boolean;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "TODO: Add a real, approved client or colleague testimonial here. Quotes will not be fabricated.",
    author: "TODO - Name",
    role: "TODO - Role, Company",
    placeholder: true,
  },
  {
    quote:
      "TODO: Add a second real testimonial. Reach out to a past collaborator from Nice2Stay, StayWithLumina, or Hotel Weekend.",
    author: "TODO - Name",
    role: "TODO - Role, Company",
    placeholder: true,
  },
];

export const expertise = [
  { title: "Frontend Engineering", description: "React, Next.js, Vue, Nuxt - component-driven systems that ship pixel-perfect, accessible UI." },
  { title: "Backend Engineering", description: "Node.js, Express, NestJS, REST/GraphQL APIs, and resilient integration strategies." },
  { title: "Cloud & DevOps", description: "AWS, Docker, GitHub Actions, and CI/CD pipelines for reliable, repeatable deploys." },
  { title: "AI Integrations", description: "OpenAI, LangChain, RAG, and vector databases woven into real product features." },
  { title: "Performance Optimization", description: "Sub-3s LCP and strong Core Web Vitals through SSR, caching, and asset strategy." },
  { title: "SEO Engineering", description: "100/100 Lighthouse SEO via structured data, SSR, and i18n-aware routing." },
  { title: "Architecture", description: "System design, microservices, and component-driven design at scale." },
  { title: "Internationalization", description: "i18n/L10n across 5+ language markets, including full RTL support." },
];

export const process = [
  { step: "Discover", description: "Understand the product, users, and constraints before a line of code." },
  { step: "Architect", description: "Design systems and data models that scale with the business." },
  { step: "Design", description: "Translate Figma into a pixel-perfect, accessible design system." },
  { step: "Build", description: "Ship modular, reusable components with velocity and quality." },
  { step: "Optimize", description: "Tune performance, SEO, and Core Web Vitals to production standards." },
  { step: "Deploy", description: "Automated CI/CD pipelines for safe, repeatable releases." },
  { step: "Scale", description: "Internationalize, monitor, and harden for global traffic." },
];

export const education = {
  degree: "Bachelor of Science in Computer Science",
  institution: "Government College University Lahore",
  location: "Lahore, Pakistan",
  period: "Jun 2018 – Sep 2022",
};

export const achievements = [
  "Achieved a perfect 100/100 Lighthouse SEO score on a production hospitality platform.",
  "Reduced Largest Contentful Paint to under 3 seconds on a high-traffic booking platform.",
  "Decreased component development time by 40%+ through systematic modularization.",
  "Delivered 3 production-grade travel/hospitality platforms as the primary full-stack engineer.",
  "Integrated the Guesty PMS API for real-time sync across listings, availability, and reservations.",
];

export const languages = [
  { name: "English", level: "Professional Working Proficiency" },
  { name: "Urdu", level: "Native" },
];

export const faqs = [
  {
    q: "What kind of projects do you take on?",
    a: "Full-stack web applications and SaaS products - primarily in React/Next.js and Vue/Nuxt - spanning greenfield builds, frontend modernizations, performance/SEO engagements, and AI feature integration.",
  },
  {
    q: "Are you available for freelance and consulting work?",
    a: "Yes. I work with founders and teams on full builds, technical consulting, architecture reviews, and performance/SEO optimization, alongside full-time and startup opportunities.",
  },
  {
    q: "Which time zones and locations do you work across?",
    a: "I'm remote-ready across EST, CET, GST, and PKT, and open to relocation in the UAE, KSA, and Qatar.",
  },
  {
    q: "What performance results can you deliver?",
    a: "On production platforms I've achieved 100/100 Lighthouse SEO, sub-3-second LCP, and 99%+ uptime on booking-critical flows through SSR, caching, and resilient API design.",
  },
  {
    q: "Do you build multilingual / international products?",
    a: "Yes - I've shipped i18n/L10n across 5+ language markets including full right-to-left (RTL) layout support.",
  },
];

export const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Playground", href: "/playground" },
  { label: "Contact", href: "/contact" },
];
