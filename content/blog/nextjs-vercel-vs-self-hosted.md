---
title: "Deploying Next.js: Vercel vs Self Hosted in Production"
date: "2026-02-07"
excerpt: "An honest production comparison of Vercel and self hosting Next.js: what you get, what you give up, and how to decide based on your real constraints."
category: "DevOps"
tags: ["nextjs", "vercel", "self-hosting", "deployment"]
slug: "nextjs-vercel-vs-self-hosted"
draft: false
---

Deploying Next.js comes down to a fork in the road: run it on Vercel, the platform built by the team that builds the framework, or self host it on your own infrastructure. Both are fully viable in production. The choice is not about which is better in the abstract but about which set of tradeoffs matches your constraints. Having shipped both ways, here is the honest comparison without the marketing on either side.

## What Vercel actually gives you

Vercel's value is that the platform understands Next.js natively, so the framework's features work with zero configuration. Server Components, streaming, image optimization, the routing model, edge middleware, and incremental static regeneration all just work, because the platform was co designed with the framework. You push your code, and the infrastructure decisions, what runs at the edge, what runs in a serverless function, how caching works, are made for you correctly.

The second thing you get is the operational surface disappearing. There are no servers to patch, no autoscaling to configure, no CDN to wire up, no build pipeline to maintain. For a small team or a solo developer, the time this saves is not a rounding error. It is the difference between shipping product and running infrastructure.

> Vercel is not selling hosting. It is selling the disappearance of infrastructure work, and for teams whose scarce resource is engineering time, that is often the entire decision.

There is a third benefit that is easy to undervalue until you have lived without it: preview deployments and the surrounding workflow. Every branch gets a live, shareable URL automatically, which changes how teams review work. A designer can click a link and see the actual change running, a stakeholder can try the feature before it merges, and bugs get caught in a real environment rather than in someone's description of it. Reproducing this yourself is possible but it is real engineering, and the polished version Vercel provides out of the box removes a surprising amount of friction from the everyday loop of building and reviewing.

## What you give up

The tradeoffs are real. Cost is the one people feel first: usage based pricing that is generous at small scale can become significant at high traffic, and certain workloads, particularly heavy image optimization or large bandwidth, drive it up. You are also accepting a degree of platform coupling. Most of Next.js is portable, but the path of least resistance leans on platform conveniences, and migrating away later takes effort proportional to how much you leaned in.

You also give up some control. You do not choose the underlying compute, you work within the platform's execution model, and when something behaves unexpectedly you are debugging through the platform's abstractions rather than your own servers. For most teams this is a fair trade. For teams with strict requirements about where compute runs or deep custom infrastructure needs, it can be a wall.

The cost dynamic deserves a concrete shape, because the surprise is usually not the base price but the way certain workloads scale. Image optimization is the classic example: a content heavy site serving many large images to many visitors can run up optimization and bandwidth costs that dwarf the compute. The fix is not necessarily to leave the platform but to understand the cost drivers, serve appropriately sized images, cache aggressively, and offload the heaviest media to a dedicated service if the numbers justify it. The point is that usage based pricing rewards understanding your own traffic shape. Teams that get a surprising bill are usually teams that never modeled which dimension of usage would dominate as they grew.

## What self hosting gives you

Self hosting Next.js, whether on a container platform, a virtual machine, or a managed Node host, gives you control and cost predictability. You own the compute, so you can place it where you need it, size it how you want, and reason about its cost as a fixed line rather than a usage meter. At sustained high traffic, self hosting is frequently cheaper, because you are paying for capacity rather than per request.

You also get to keep everything in one operational world. If your organization already runs infrastructure, has a platform team, and has compliance requirements about where and how things run, self hosting lets Next.js live alongside the rest of your systems under the same controls and the same observability you already operate.

Next.js supports this directly with a standalone output mode that produces a minimal, self contained server bundle suited to containers.

```js
// next.config.js
module.exports = {
  output: "standalone",
};
```

This emits a server you can run with `node server.js` inside a slim container image, copying only the files the app needs at runtime.

The standalone output is genuinely well suited to a container workflow, and it is worth understanding what it does. Rather than requiring your entire `node_modules` in the runtime image, it traces exactly which files the server actually needs and copies only those into a self contained folder. The result is a much smaller image, which means faster deploys, faster cold starts when a container spins up, and a smaller surface to secure. A typical setup builds the app, copies the standalone output and the static assets into a slim base image, and runs the server. Pair it with a process manager or an orchestrator that handles restarts and health checks, and you have a production server that behaves like any other containerized Node service your team already knows how to operate.

## What self hosting costs you

The cost is that the features Vercel gives for free become your responsibility. Image optimization needs a configured optimizer or an external image service. Incremental static regeneration and the framework's caching need a shared cache when you run multiple instances, or revalidation behaves inconsistently across them. Edge middleware that ran globally on Vercel now runs wherever your servers run, which changes its latency characteristics. None of this is insurmountable, but it is work, and it is ongoing work, not a one time setup.

You are also now responsible for the things platforms quietly handle: scaling under load, zero downtime deploys, patching, certificate management, and the on call burden when something breaks at an inconvenient hour. If you have a team that does this already, the marginal cost is low. If you do not, you are taking on a second job alongside building the product.

The shared cache requirement is the sharpest edge and the one most likely to bite a team that does not plan for it. When you run a single instance, the framework's cache lives in that instance's memory and everything is consistent. The moment you scale to multiple instances behind a load balancer, each instance has its own cache, so a page revalidated on one instance is still stale on the others, and users see different versions depending on which instance they hit. The fix is to configure a shared cache backend that all instances read and write, so revalidation is consistent across the fleet. This is a known, solved problem, but it is one you have to know exists before you scale horizontally, because the symptom, inconsistent stale content, is confusing if you do not know to look for it.

## How to actually decide

The decision sequence that cuts through the noise starts with your team. If your scarce resource is engineering time and you do not already run infrastructure, Vercel almost always wins, because it converts an infrastructure project into a deploy command. If you already operate infrastructure, have a platform team, or have requirements about compute location and compliance, self hosting fits into a world you already run.

Then consider scale and cost. At modest and bursty traffic, the platform's pricing is usually a non issue and its convenience is a clear win. At sustained high traffic with heavy bandwidth or image workloads, model the cost honestly, because self hosting can become materially cheaper and that saving can justify the operational work.

Finally, consider how much of the framework's advanced behavior you depend on. The more you rely on streaming, edge middleware, and the caching model, the more you benefit from running where those features are zero configuration, and the more you pay in setup to reproduce them yourself.

A pattern worth naming is that the right answer can change over the life of a product, and that is fine. Many teams are best served starting on the platform, where the goal is to find product fit without spending engineering time on infrastructure, and then revisiting the decision once traffic is large and predictable enough that owning the compute pays off. Treating the choice as reversible rather than permanent removes a lot of the anxiety from it. Keep your usage of platform specific conveniences modest enough that a future migration is a project rather than a rewrite, and you preserve the option to move when the constraints actually change.

## Practical takeaways

- Start from your team's scarce resource. If it is engineering time and you do not already run infrastructure, the platform usually wins by turning ops into a deploy command.
- Value the preview deployment and review workflow honestly. Reproducing it yourself is real engineering.
- Model your cost drivers, especially image optimization and bandwidth, because usage based pricing rewards understanding the shape of your own traffic.
- If you self host, use the standalone output for small, fast container images, and plan for a shared cache before you scale to multiple instances.
- Know that self hosting makes image optimization, caching consistency, and edge behavior your responsibility, and budget ongoing operational time, not a one time setup.
- Treat the decision as reversible. Start where it lets you move fastest, keep platform coupling modest, and revisit when traffic is large and predictable.

## The honest conclusion

There is no universally correct answer, and anyone who gives you one is selling something. Vercel is the right default for teams who want to spend their time on product and let infrastructure disappear. Self hosting is the right call for teams who already run infrastructure, operate at a scale where owning the compute pays off, or have requirements that demand control. Decide on your real constraints, team capacity, scale, cost, and control, rather than on which option sounds more sophisticated, and you will land in the right place.
