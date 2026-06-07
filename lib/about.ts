/**
 * Synthesized narrative voice for the About page.
 *
 * IMPORTANT: This file contains NO new facts. Every concrete claim (roles,
 * dates, metrics, projects, technologies) lives in `lib/resume.ts` and remains
 * the single source of truth. The content here is an *interpretation* of that
 * real work — engineering philosophy and working style inferred from shipped
 * outcomes. No fabricated leadership scope, team sizes, client stories, or
 * architecture ownership beyond what the resume already attributes.
 */

/** Engineering philosophy — each principle is anchored to a real, resume-backed result. */
export const principles = [
  {
    title: "Engineering decisions are product decisions.",
    body: "I don't separate “the code” from “the product.” A date picker, a filter, a render strategy — each one moves a real number. Rebuilding Nice2Stay's booking interface wasn't about cleaner components; it was about turning more searches into bookings.",
  },
  {
    title: "Performance is the experience, not a finish line.",
    body: "Speed is the first thing a user feels and the last thing most teams budget for. A sub-3-second LCP and a 100/100 Lighthouse score aren't trophies — they're the difference between a product that feels considered and one that feels heavy.",
  },
  {
    title: "Architecture should age well.",
    body: "Most cost in software arrives later, as change. Decomposing a monolithic frontend into a modular component system cut feature delivery by 40%+ — not because it was elegant, but because the next person could move quickly and safely.",
  },
  {
    title: "SEO is product infrastructure.",
    body: "Discoverability is a feature with compounding returns. Treating SSR, structured markup, and Core Web Vitals as architecture — not an afterthought — is how a rebuilt platform earns organic traffic instead of buying it.",
  },
  {
    title: "Build for everyone, everywhere.",
    body: "Real products cross languages, scripts, and devices. Internationalized routing and full right-to-left support across 5+ markets taught me that inclusivity is an engineering constraint you design for early, or pay for forever.",
  },
  {
    title: "Reliability is a form of respect.",
    body: "When a booking flow fails, you've failed someone's plans. Error boundaries, retry logic, and 99%+ uptime on critical endpoints are how I show users — quietly — that the system was built to hold.",
  },
] as const;

/** What I solve best — outcome framings mapped to real projects. */
export const strengths = [
  {
    outcome: "Performance-critical SaaS",
    body: "Booking and discovery platforms where milliseconds and Core Web Vitals decide whether users convert or leave.",
    proof: "Nice2Stay",
    slug: "nice2stay",
  },
  {
    outcome: "Legacy modernization",
    body: "Taking a constrained, aging codebase and rebuilding it into a fast, SEO-first platform without losing the business underneath.",
    proof: "Hotel Weekend",
    slug: "hotel-weekend",
  },
  {
    outcome: "Zero-to-one full-stack products",
    body: "Owning a build end-to-end — database design, APIs, third-party integrations, deployment — until it runs reliably in production.",
    proof: "StayWithLumina",
    slug: "staywithlumina",
  },
  {
    outcome: "Internationalized platforms",
    body: "Multi-market products with localized routing, content, and right-to-left layouts treated as first-class, not bolted on.",
    proof: "Nice2Stay",
    slug: "nice2stay",
  },
  {
    outcome: "Scalable frontend systems",
    body: "Component architectures that let a team ship consistent, high-quality UI faster as the product grows in surface area.",
    proof: "Nice2Stay",
    slug: "nice2stay",
  },
] as const;

/** Working style — how it feels to collaborate. */
export const workingStyle = [
  {
    title: "I take ownership end-to-end.",
    body: "From the database to the last animation, I'd rather understand the whole system than hand off the parts I don't enjoy. Accountability doesn't fragment well.",
  },
  {
    title: "I communicate in outcomes.",
    body: "Stakeholders care about conversion, speed, and reach — not framework names. Working remote-first across time zones, I translate technical work into the language of the people relying on it.",
  },
  {
    title: "I iterate against real signals.",
    body: "Opinions start the conversation; metrics, audits, and user behavior end it. I'd rather measure than argue.",
  },
  {
    title: "I leave systems better than I found them.",
    body: "Refactoring, documentation, and mentoring aren't side quests — they're how the work keeps paying off after I've moved on.",
  },
] as const;

/** Career journey — progression, not a flat timeline. Facts mirror lib/resume.ts. */
export const journey = [
  {
    period: "2021 – 2022",
    company: "Wisdom Coders",
    role: "Associate Software Engineer",
    arc: "Foundations",
    body: "Shipped frontends across 5+ multi-client projects in agile sprints. This is where the fundamentals set in — clean, maintainable code, performance tuning, and the discipline of delivering on a timeline.",
  },
  {
    period: "2022 – 2023",
    company: "StayWithLumina",
    role: "Full Stack Engineer (MERN)",
    arc: "Owning the whole stack",
    body: "Built a vacation-rental platform from database to deployment, integrating the Guesty PMS API with error boundaries and retry logic for 99%+ uptime. The first time I owned a product's reliability end-to-end.",
  },
  {
    period: "2023",
    company: "Hotel Weekend",
    role: "Software Engineer",
    arc: "Modernizing systems",
    body: "Rebuilt a legacy travel platform from the ground up on Nuxt and Vue 3 into an SEO-first discovery engine — near-perfect Lighthouse scores, better rankings, richer browsing. Learning to transform, not just create.",
  },
  {
    period: "2023 – Present",
    company: "Nice2Stay",
    role: "Senior Software Engineer",
    arc: "Senior scope",
    body: "Leading a full frontend revamp: a perfect Lighthouse SEO score, sub-3s LCP, a modular architecture that sped delivery by 40%+, and internationalization across 5+ markets with RTL. Architecture, performance, and product reach as one remit.",
  },
] as const;

/** Beyond the resume — truthful technical curiosities (drawn from real skills). */
export const curiosities = [
  {
    title: "AI-assisted product features",
    body: "Where LLMs, RAG, and vector search genuinely improve a product — not where they're bolted on for a press release.",
  },
  {
    title: "System design & architecture",
    body: "The quiet decisions — boundaries, data flow, caching — that decide whether a product stays fast and flexible at scale.",
  },
  {
    title: "Interface craft & motion",
    body: "The small details — easing, rhythm, restraint — that make an interface feel considered rather than assembled.",
  },
] as const;
