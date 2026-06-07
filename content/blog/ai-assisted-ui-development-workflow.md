---
title: "An AI Assisted UI Development Workflow"
date: "2026-02-19"
excerpt: "Where AI coding tools genuinely accelerate frontend work, where they quietly cost you time, and how to build a workflow that keeps you in control."
category: "AI"
tags: ["ai-assisted-development", "developer-workflow", "frontend", "code-review"]
slug: "ai-assisted-ui-development-workflow"
draft: false
---

AI coding assistants have moved from novelty to daily tool for a lot of frontend engineers, including me. The honest picture is neither the hype nor the backlash. These tools genuinely accelerate some parts of UI work and quietly slow down others, and the difference between a workflow that compounds and one that creates a mess of plausible looking code is mostly about knowing which is which.

## Where the acceleration is real

The clearest win is the work that is well specified but tedious. Scaffolding a component with the props you describe, writing the boilerplate for a form with validation, converting a design into a first pass of markup and styles, generating the repetitive variants of a component. This is work where you know exactly what you want and the value is in not typing it. An assistant turns a paragraph of intent into a draft you refine.

The second real win is exploration. When you are unsure how an unfamiliar API works, or you want to see three approaches to a layout, an assistant gives you a fast, concrete starting point to react to. Reacting to a draft is often faster than starting from blank, even when you rewrite most of it, because the draft surfaces the decisions you need to make.

A third win, less talked about, is mechanical transformation. Converting a component from one styling approach to another, migrating a file from a deprecated API to its replacement, or applying the same refactor across twenty similar components is exactly the kind of pattern matching these tools do well. The work is well defined, the correct answer is checkable, and the tedium is real. This is where I see the most reliable time savings, because the task has a clear shape and a clear test.

> The tool is fastest when you already know what correct looks like and slowest when you are hoping it will decide for you. The judgment stays with you, and the typing moves to the machine.

## Where it quietly costs you

The failure mode is subtle, which is what makes it dangerous. The code an assistant produces is fluent. It looks right. It reads like code a competent engineer would write. That fluency is exactly why a wrong answer is expensive: a bug in confident looking code survives a casual review that a bug in obviously sketchy code would not.

The areas where I am most careful are anything involving state and effects, where a plausible looking `useEffect` can introduce a subtle dependency bug, anything involving security or authorization, where a confident answer can be confidently insecure, and anything involving accessibility, where generated markup often omits the roles and focus handling that make a component actually usable. In these areas the assistant accelerates writing the code and does nothing to guarantee the code is right, so the review burden is entirely on you.

There is a second, slower cost that is easy to miss in the moment. When you accept a large generated block that mostly works, you often inherit choices you would never have made yourself: a dependency you did not need, a pattern that does not match the rest of the codebase, an abstraction invented for a problem you do not have. Each of these is small, but they accumulate into a codebase that feels subtly incoherent, like it was written by a committee that never spoke to each other. Coherence is a real asset, and it erodes quietly when generation outpaces judgment.

## A workflow that keeps you in control

The structure that works for me treats the assistant as a fast junior pair, not an oracle. I describe the component precisely, including the props, the states, and the accessibility requirements, because a vague prompt produces vague code. I review the output as code, not as a result, reading it line by line the way I would review a colleague's pull request. And I keep the units small, because a tightly scoped generation is easy to verify and a sprawling one hides its mistakes.

```tsx
// Prompt with the contract explicit, then verify against it:
// "A Tabs component. Props: tabs (array of {id, label, content}),
//  defaultTab. Keyboard: arrow keys move focus, Enter activates,
//  roving tabindex. ARIA: role tablist, tab, tabpanel with aria-controls."
```

When the prompt carries the real requirements, the output is something you can check against a clear contract. When the prompt is do a tabs component, you get something that looks like tabs and silently skips the keyboard and ARIA work, and you may not notice until a user does.

There is a real world rhythm to this that is worth describing. For a new component I will often ask for the structure first, with no styling and no logic, just the props and the markup skeleton. I review that, correct the shape, and only then ask for the behavior, one concern at a time: the keyboard handling, then the ARIA wiring, then the styling. Each step is small enough that I can hold the whole thing in my head and verify it. The opposite approach, asking for the finished component in one shot, produces something impressive looking that takes longer to audit than it would have taken to write, because now I am reverse engineering decisions I did not make.

## Verification is the non negotiable part

The single habit that separates a healthy AI workflow from a harmful one is verification. Generated code is a hypothesis, and a hypothesis is not done until it is tested. For UI that means actually running it, checking it across viewports, testing it with the keyboard, and confirming it does what you intended rather than what it superficially appears to do. The time the assistant saved you in typing is partly meant to be reinvested in verifying, and a workflow that skips that step is borrowing reliability it will pay back with interest later.

For UI specifically, the verification checklist is concrete. Tab through the component with the keyboard alone and confirm focus is visible and logical. Resize from a narrow phone width to a wide desktop and watch for overflow and broken layout. Toggle a screen reader on the parts that carry meaning and confirm they announce. Check the disabled, loading, empty, and error states, because generated components are usually written for the happy path and silently omit the rest. None of this is glamorous, and all of it is where the bugs actually live.

## Keep your own understanding intact

There is a longer term risk worth naming. If you outsource not just the typing but the understanding, your own model of the codebase decays. The code in your repository is code you are responsible for, and you cannot be responsible for code you do not understand. I make a point of being able to explain every nontrivial piece the assistant produced, because the day it breaks in production, the assistant is not the one getting paged.

This is why I treat generated code that I do not fully understand as a signal to slow down rather than ship. If I cannot articulate why it works, I either dig until I can or I rewrite it in a way I can reason about. The goal is to move faster while staying the engineer who understands the system, not to become a person who pastes plausible code and hopes.

There is also a skills dimension that compounds over a career. The parts of the job you delegate are the parts you stop practicing. If you let the tool write every effect and every reducer, your own fluency with those patterns fades, and your ability to catch the tool's mistakes fades with it. The engineers who get the most from these tools are usually the ones who least need them, precisely because their judgment is sharp enough to steer. Protecting that judgment is part of the workflow, not separate from it.

## Practical takeaways

- Use the assistant for well specified, tedious, and checkable work: scaffolding, boilerplate, repetitive variants, and mechanical refactors across many files.
- Be most careful with state and effects, authorization, and accessibility, where fluent output can be confidently wrong.
- Write prompts that carry the real contract: props, states, keyboard behavior, and ARIA requirements. Vague prompts produce vague code.
- Build components in small steps you can hold in your head, rather than asking for the finished thing in one shot.
- Treat generated code as a hypothesis. Run it, keyboard test it, check every non happy path state, and resize across breakpoints before you trust it.
- Refuse to ship code you cannot explain. If you cannot articulate why it works, slow down or rewrite it.

## The honest bottom line

AI assistants are a real productivity gain for frontend work when used as an accelerator for well specified, verifiable tasks under an engineer who reviews and tests the output. They are a liability when used as a substitute for understanding, because their greatest strength, fluency, is also what lets their mistakes slip through. The workflow that wins is unglamorous: precise prompts, small units, line by line review, and real verification. Used that way, the tool makes you faster without making you sloppier, which is the only version of the trade worth taking.
