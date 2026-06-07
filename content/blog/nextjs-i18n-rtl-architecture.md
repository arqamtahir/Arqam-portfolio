---
title: "i18n Architecture in Next.js for RTL and Multi Locale Apps"
date: "2026-04-02"
excerpt: "Designing internationalization in the App Router: locale routing, message loading, and getting right to left layout correct from the start."
category: "Architecture"
tags: ["i18n", "rtl", "app-router", "localization"]
slug: "nextjs-i18n-rtl-architecture"
draft: false
---

Internationalization is one of those features that is cheap to add early and brutally expensive to retrofit. The difference is architectural. If locale is a first class concept in your routing and layout from the start, supporting a new language is a content task. If it is bolted on later, every hardcoded string and every left aligned assumption becomes a bug. This is especially true for right to left languages, which expose layout assumptions you did not know you had.

## Locale as a routing concern

In the App Router, the clean approach is to make locale a segment of the URL. A dynamic `[locale]` segment at the root means every page knows its locale from the route, and the URL itself is shareable and crawlable per language.

```
app/
  [locale]/
    layout.tsx
    page.tsx
    blog/
      page.tsx
```

The locale segment gives each language a distinct, indexable URL space, which matters for SEO because search engines can serve the right language version and understand the relationship between them through `hreflang` annotations.

```tsx
export async function generateStaticParams() {
  return ["en", "ar", "fr"].map((locale) => ({ locale }));
}
```

Pre generating the locales you support keeps the localized pages static and fast, rather than computing them per request.

The alternative approaches are worth knowing so you can see why the path segment wins for most apps. Some teams put the locale in a subdomain or a separate domain entirely, which is heavier infrastructure but can matter for strong regional separation. Others store the locale only in a cookie and serve different content at the same URL, which is the approach to avoid, because a single URL serving different languages is invisible to search engines and unshareable, since a link does not carry the language. The path segment threads the needle: it is lightweight, every language gets a real distinct URL, and the routing reads the locale from the request without any hidden state. For the large majority of applications it is the right default.

## Loading messages without bloating the bundle

The naive approach ships every translation to every user. That wastes bandwidth and grows with each new language. The better pattern loads only the active locale's messages, and on the server where possible, so translation data does not bloat the client bundle.

```tsx
async function getMessages(locale: string) {
  return (await import(`@/messages/${locale}.json`)).default;
}

export default async function LocaleLayout({ params, children }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  return (
    <html lang={locale} dir={dirForLocale(locale)}>
      <body>
        <IntlProvider messages={messages} locale={locale}>
          {children}
        </IntlProvider>
      </body>
    </html>
  );
}
```

Notice two things on the `html` element: `lang` is set so assistive technology and search engines know the language, and `dir` is set so the entire document flips for right to left locales. Those two attributes are the foundation everything else builds on.

There is a further optimization that matters once you have many translation keys: most of your strings are used by Server Components and never need to reach the client at all. If you render translated content on the server, those messages are baked into the HTML and the client never downloads them. Only the strings used by interactive Client Components, error messages on a form, labels that change on click, need to ship to the browser, and you can scope those to the components that use them rather than shipping the whole message file. The default of loading one big message object into a client provider is fine to start, but as the catalog grows, pushing translation to the server and shipping only the interactive strings keeps the client bundle from growing linearly with your content.

## Right to left is a layout discipline, not a CSS hack

The mistake teams make with right to left support is treating it as a per component override. The durable approach is to write direction agnostic CSS from the start using logical properties. Instead of `margin-left`, use `margin-inline-start`. Instead of `left`, use `inset-inline-start`. These properties resolve to the correct physical side based on the document direction automatically.

```css
.card {
  padding-inline-start: 1rem;
  border-inline-start: 2px solid var(--accent);
  text-align: start;
}
```

When `dir` flips to right to left, this card's padding, border, and text alignment all move to the correct side with no media query and no direction specific class. Logical properties are the single highest leverage habit for making a codebase bidirectional, because they make the right thing the default.

> The goal is a codebase where supporting a right to left language requires changing the `dir` attribute and nothing else. Every place you wrote a physical direction is a place that goal leaks.

The leaks are sneakier than just margins and padding, and it helps to know where they hide. Absolute positioning with `left` and `right` needs to become `inset-inline-start` and `inset-inline-end`. Flexbox and grid generally flow correctly because they already follow the writing direction, but a `flex-direction: row` with manually placed children can surprise you. Icons that imply direction, a back arrow, a next chevron, a send button, need to be mirrored, which a transform or a logical mirroring utility can handle. Box shadows and gradients with a horizontal offset point the wrong way after a flip. And border radius on one side, a card rounded only on its leading corners, needs logical corner properties. The discipline is the same everywhere: anywhere you named a physical side, you have written a bug that only appears in the other direction.

## Formatting is part of localization

Translation is only half the job. Numbers, dates, currencies, and plurals differ by locale in ways that are easy to get subtly wrong. Lean on the platform's `Intl` APIs rather than hand rolling formatters, because they encode an enormous amount of locale specific knowledge you do not want to reimplement.

```ts
const formatted = new Intl.NumberFormat(locale, {
  style: "currency",
  currency: "USD",
}).format(amount);

const date = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(d);
```

Plurals deserve special care, because the simple English distinction between one and many does not hold in many languages. A proper message format with plural rules handles this correctly per locale instead of producing grammatically broken strings.

The plural point is worth dwelling on, because it is where hand rolled internationalization most visibly fails. English has two plural forms, one and other, so developers instinctively write a ternary on whether a count equals one. Arabic has six plural categories. Polish has distinct forms for certain number ranges. Russian inflects differently depending on the last digit. A ternary that works in English produces grammatically wrong strings in all of these. The `Intl.PluralRules` API and message formats built on it know the rules for each locale and select the right form. The lesson generalizes: any place you are tempted to encode a grammatical rule yourself, assume your intuition is English shaped and reach for the platform API that already knows the rules for every locale.

## Detecting and respecting the user's locale

When a user arrives without a locale in the URL, you choose one for them. The respectful default is to read the `Accept-Language` header, match it against your supported locales, and redirect to the best fit, while always letting the user override and remembering that choice. Middleware is the right place for this, because it runs before the page and can redirect cleanly.

The nuance that earns goodwill is to never trap the user in your guess. Header based detection is a reasonable starting point, but it is a guess, and guesses are sometimes wrong. The person traveling abroad on a borrowed device, or the bilingual user who prefers your product in a different language than their system, both need an obvious way to switch and have that choice stick. Persist the explicit selection, in a cookie or the user's profile, and prefer it over the header on subsequent visits. The header decides the first impression for someone with no stated preference. The moment they state one, it should win, and it should keep winning.

## Testing the bidirectional layout

The discipline of logical properties only holds if someone checks it, because a single physical property slips in easily and goes unnoticed in the default direction. The cheapest safeguard is to run the app in a right to left locale regularly, not as a final pass but as part of normal development. A layout bug in right to left is almost always a place where a physical property was used, so the visual review doubles as a lint for the habit.

It helps to keep a representative right to left locale wired up from the first week of the project even before you have real translations for it, using pseudo localized strings if needed. A locale that exercises right to left layout and longer translated strings surfaces two of the most common internationalization bugs early: direction sensitive layout and text that overflows because the design was sized around short English copy. Both are far cheaper to fix while the components are young than after they have been copied into a dozen screens.

The longer text problem is as common as the direction problem and easier to forget. German compound words, French phrasing, and many other languages run noticeably longer than the equivalent English, and a button or label sized to fit the English string clips or wraps awkwardly when translated. Pseudo localization, which replaces English strings with longer accented versions during development, surfaces this before real translations exist. Designing components to tolerate text that is thirty to fifty percent longer than the English, with flexible widths and graceful wrapping, is far cheaper than discovering the overflow in twelve places after the translations land.

## Practical takeaways

- Put the locale in a path segment so every language gets a distinct, crawlable, shareable URL, and avoid serving different languages at the same URL behind a cookie.
- Load only the active locale's messages, push translation to Server Components where possible, and ship only the interactive strings to the client.
- Set `lang` and `dir` on the `html` element, and write all direction sensitive CSS with logical properties so a flip requires changing only `dir`.
- Hunt the leaks: absolute positioning, directional icons, offset shadows and gradients, and one sided radii all need logical equivalents.
- Format numbers, dates, currencies, and plurals through the `Intl` APIs rather than encoding locale rules yourself, because your intuition is English shaped.
- Detect locale from the header as a first guess, but let an explicit user choice override and persist.
- Wire up a right to left, longer text pseudo locale from week one and test in it during normal development, not as a final pass.

## The payoff

When locale lives in the route, messages load per language, layout uses logical properties, and formatting goes through `Intl`, adding a language becomes a content task: provide a translation file and add the locale to your list. That is the whole point of treating i18n as architecture. The expensive work happens once, in the structure, and every new market after that is cheap. The teams that get burned are the ones who treated the first language as the only language, and discovered every assumption baked into that choice the day they tried to add the second.
