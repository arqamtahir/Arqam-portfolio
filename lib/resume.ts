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
    "Specializing in React, Next.js, Vue, Node.js, cloud infrastructure, SEO optimization, and modern product engineering.",
  summary:
    "Results-driven Senior Software Engineer with 5+ years of experience architecting and delivering scalable, high-performance web applications across travel-tech, hospitality, e-commerce, and SaaS platforms. Expert in full-stack JavaScript using the MERN and MEAN stacks, with a consistent record of measurable impact: sub-3s LCP, 100/100 Lighthouse SEO, and 40%+ faster component delivery.",
  location: "Lahore, Pakistan",
  relocation: "Open to relocation — UAE / KSA / Qatar",
  remote: "Remote-ready across EST, CET, GST, and PKT time zones",
  email: "muhammadarqam920@gmail.com",
  phone: "+92 300 6161806",
  experienceYears: "5+",
  links: {
    linkedin: "https://linkedin.com/in/arqam-tahir",
    github: "https://github.com/arqamtahir",
    email: "mailto:muhammadarqam920@gmail.com",
  },
} as const;

/** Animated counters — every value is from the resume. */
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
      "Engineered an intelligent booking interface with custom date pickers, dynamic availability filters, and real-time property data — lifting search-to-booking conversion.",
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
    role: "Software Engineer (Full Stack — MERN)",
    period: "Jul 2022 – Jul 2023",
    industry: "Vacation Rental Platform",
    location: "Remote",
    impact: [
      "Architected and delivered the end-to-end full-stack build using Next.js, React, Node.js, and MongoDB — from database design to production deployment.",
      "Integrated Guesty's property management API to synchronize listings, real-time availability, reservations, and guest data, eliminating manual data entry.",
      "Implemented SSR, dynamic routing, and Framer Motion animations, boosting Core Web Vitals.",
      "Built custom booking workflows and availability-aware filters, reducing booking abandonment.",
      "Ensured API reliability through error boundaries and retry logic — achieving 99%+ uptime for critical booking flows.",
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
      "Rebuilt the end-to-end frontend architecture with Vue.js and Nuxt.js — introducing SSR, a modular component system, i18n routing with RTL support, and an intelligent booking UI with custom date pickers and real-time availability.",
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
      "A short-term vacation rental business needed a production-grade platform — from database design to deployment — with reliable real-time syncing against an external property management system.",
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
      "Redeveloped the platform from the ground up with Nuxt.js and Vue 3 — adding a dynamic destination and theme-based discovery system, curated filters, lazy-loaded assets, and fully responsive layouts.",
    results: [
      "Near-perfect Lighthouse performance & SEO",
      "Improved SERP rankings and organic traffic",
      "Higher session duration via content-rich browsing",
      "Cross-device compatibility (iOS, Android, desktop)",
    ],
    featured: true,
  },
];

/** Services framed for the five target audiences (freelance, consulting, full-time, startup, brand). Derived from real skill areas. */
export const services = [
  { title: "Full Stack Development", description: "End-to-end product builds across the MERN and MEAN stacks, from database design to production deployment." },
  { title: "SaaS Development", description: "Scalable, multi-tenant-ready web applications with SSR/SSG, real-time data, and third-party API integrations." },
  { title: "Technical Consulting", description: "Architecture reviews, frontend modernization, and engineering guidance for teams and founders." },
  { title: "Performance Optimization", description: "Core Web Vitals tuning — sub-3s LCP, image/font strategy, caching, and bundle reduction." },
  { title: "SEO Engineering", description: "Technical SEO that earns 100/100 Lighthouse scores: SSR, structured data, i18n routing, and crawlability." },
  { title: "Cloud Integration", description: "AWS infrastructure (EC2, S3, Lambda, RDS, ECS, CloudFront), Docker, and CI/CD pipelines." },
  { title: "AI Features", description: "OpenAI, LangChain, and RAG-powered features integrated into production products." },
  { title: "Product Architecture", description: "System design, component-driven design systems, internationalization, and technical leadership." },
];

export const expertise = [
  { title: "Frontend Engineering", description: "React, Next.js, Vue, Nuxt — component-driven systems that ship pixel-perfect, accessible UI." },
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
    a: "Full-stack web applications and SaaS products — primarily in React/Next.js and Vue/Nuxt — spanning greenfield builds, frontend modernizations, performance/SEO engagements, and AI feature integration.",
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
    a: "Yes — I've shipped i18n/L10n across 5+ language markets including full right-to-left (RTL) layout support.",
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
