---
title: "Building an Accessible Command Palette from Scratch"
date: "2026-04-14"
excerpt: "A command palette is a focus and keyboard problem before it is a search problem. How to build one that screen readers and keyboards handle correctly."
category: "Accessibility"
tags: ["accessibility", "command-palette", "keyboard-navigation", "aria"]
slug: "building-accessible-command-palette"
draft: false
---

The command palette has become a signature interaction of well crafted web apps. Press a shortcut, a dialog appears, you type, and you navigate the whole product with the keyboard. It looks simple, which is exactly why so many implementations are quietly broken for keyboard and screen reader users. A command palette is a focus management and keyboard problem first, and a search problem second.

## The accessibility contract

Before writing a line of filtering logic, get the semantics right. A command palette is a modal dialog containing a combobox that controls a list of options. That sentence maps directly onto ARIA roles, and getting the roles right is most of the battle.

The container is a dialog. The input is a combobox that owns the list via `aria-controls` and announces the active option via `aria-activedescendant`. The results are a listbox of options. Screen readers understand this pattern, so honoring it means assistive technology describes the palette correctly without custom announcements.

It is worth pausing on why the role choice matters so much. Assistive technology ships with built in expectations for known patterns. When you tell a screen reader that an element is a combobox controlling a listbox, the user's software already knows how to describe it, what keys to expect, and how to announce changes. Invent your own structure with generic `div` elements and you are now responsible for reimplementing all of that behavior by hand, and you will get some of it wrong. Leaning on the established pattern is not just less code, it is borrowing decades of accumulated assistive technology behavior for free.

> The hardest part of a command palette is not search. It is making sure that focus, the active option, and the announced state never disagree with each other.

## Focus management is the foundation

When the palette opens, focus must move into the input. When it closes, focus must return to wherever it was before, or the user is dumped at the top of the page with no idea where they are. While it is open, focus must be trapped inside the dialog so Tab does not wander into the page behind it.

```tsx
useEffect(() => {
  if (!open) return;
  const previouslyFocused = document.activeElement as HTMLElement | null;
  inputRef.current?.focus();
  return () => previouslyFocused?.focus();
}, [open]);
```

This captures the previously focused element on open and restores it on close. It is a small effect that fixes one of the most common and most disorienting bugs in custom dialogs.

The focus restoration detail is more subtle than it first appears. Capturing `document.activeElement` at open time works when the palette is triggered from a focused element, but you also need to handle the case where the trigger element no longer exists when the palette closes, perhaps because the action the user selected navigated away or removed it from the DOM. The optional chaining in the cleanup guards against calling `focus` on a node that is gone, but in a navigation heavy app you may also want a sensible fallback, such as focusing the main landmark, so the user is never stranded.

Focus trapping deserves its own care. While the dialog is open, Tab and Shift Tab should cycle within the dialog and never reach the page behind it. The robust way to achieve this is to render the palette in a way that makes the rest of the page inert, either with the `inert` attribute on the background content or by managing a focus trap that loops focus at the first and last focusable elements. Skipping this is the difference between a dialog that feels solid and one where a Tab quietly drops the user into the page underneath, where they can interact with content they cannot see.

## The roving active option pattern

Here is the subtle part. In a command palette, keyboard focus stays in the input the entire time, because the user is typing. The arrow keys do not move DOM focus. Instead they move a virtual highlight through the list, and you tell assistive technology which option is active using `aria-activedescendant` on the input.

```tsx
<input
  role="combobox"
  aria-expanded={results.length > 0}
  aria-controls="cmd-listbox"
  aria-activedescendant={activeId}
  onKeyDown={onKeyDown}
/>
<ul role="listbox" id="cmd-listbox">
  {results.map((item, i) => (
    <li
      key={item.id}
      id={`cmd-option-${item.id}`}
      role="option"
      aria-selected={i === activeIndex}
    >
      {item.label}
    </li>
  ))}
</ul>
```

The input keeps focus, `aria-activedescendant` points at the highlighted option's id, and `aria-selected` marks it visually and semantically. A screen reader announces the active option as the user arrows through, even though DOM focus never left the input.

The reason this pattern exists rather than moving real focus to each option is that the user is still typing. If you moved DOM focus into the list on every arrow press, the input would lose focus and keystrokes would stop reaching it. The active descendant pattern lets you keep the text cursor in the input while a separate, virtual cursor moves through the options. The one rule you must never break is that the id in `aria-activedescendant` must always point at a real, currently rendered option. When the results change because the user typed another character, the active id has to be reconciled to a valid option, or the screen reader announces nothing.

## Keyboard handling that feels right

The keyboard contract users expect is specific. Arrow down and up move the active option and should wrap or clamp predictably. Enter activates the current option. Escape closes the palette. Home and End jump to the first and last options. Typing filters. Handle these explicitly, and remember to call `preventDefault` on the arrow keys so the input cursor does not also move.

```tsx
function onKeyDown(e: React.KeyboardEvent) {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    setActiveIndex((i) => Math.min(i + 1, results.length - 1));
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    setActiveIndex((i) => Math.max(i - 1, 0));
  } else if (e.key === "Enter") {
    e.preventDefault();
    results[activeIndex]?.action();
  } else if (e.key === "Escape") {
    setOpen(false);
  }
}
```

A few edge cases separate a palette that feels right from one that feels almost right. When the result set changes as the user types, the active index should reset to the first result rather than pointing at whatever index it held before, which may now be a different command or out of range. When there are no results, Enter should do nothing rather than throw, which the optional chaining above handles. And the clamp versus wrap decision is a real product choice: clamping at the ends, as shown here, feels predictable in a short list, while wrapping from the last item back to the first can feel slicker in a long one. Pick one and apply it consistently, because an inconsistent edge feels like a bug even when it is intentional.

## Do not forget the open shortcut

The palette is usually opened with a chord. Register it globally, but be a considerate citizen. Do not hijack the shortcut when the user is typing in another input, and make sure there is also a visible, clickable way to open the palette for users who do not know the chord or cannot perform it.

The considerate citizen point is not optional. A global key handler that fires while the user is typing in a search field or composing in a text area will swallow keystrokes and feel hostile. Guard the handler by checking whether the active element is an editable field before acting. And remember that a keyboard chord is an enhancement, not the only door. Some users navigate with a switch device or voice control and cannot press a two key combination at all, which is why a visible button that opens the same palette is a requirement, not a nicety.

## Announcing results to screen readers

When results change as the user types, a screen reader user benefits from knowing how many results there are. A polite live region that announces the result count keeps them oriented without being noisy.

```tsx
<div role="status" aria-live="polite" className="sr-only">
  {results.length} results
</div>
```

The `aria-live="polite"` setting means the announcement waits for a pause rather than interrupting, which is the right level of urgency for a result count. Resist the urge to make this assertive, which would interrupt the user on every keystroke and turn a helpful cue into a barrage. Politeness is correct here precisely because the result count is useful context, not an emergency.

## The reduced motion and visual layer

Finally, honor reduced motion preferences for the open and close animation, ensure the active option has a visible highlight with sufficient contrast, and make sure the highlight scrolls into view as the user arrows past the visible area. A keyboard user navigating to an option that is highlighted but off screen is lost in the same way a mouse user would be if the selection were invisible.

The scroll into view detail catches many implementations. As the active index moves past the bottom of the visible list, the highlighted option needs to scroll into the viewport, or the user is arrowing toward a selection they cannot see. Calling `scrollIntoView` with a block nearest option on the active element whenever the index changes keeps the highlight visible without jarring jumps. And the contrast requirement is not just about the highlight color looking nice. The active option's styling has to meet contrast minimums against both its background and the surrounding options, because a highlight that is technically present but visually faint fails the users who need it most.

## Practical takeaways

- Get the roles right first: a dialog containing a combobox that controls a listbox of options. The pattern buys you correct assistive technology behavior for free.
- Move focus into the input on open, trap it inside the dialog, and restore it to the trigger on close, with a sensible fallback if the trigger is gone.
- Keep DOM focus in the input and move a virtual highlight with `aria-activedescendant`, always pointing it at a real, currently rendered option.
- Handle the full keyboard contract explicitly, reset the active index when results change, and call `preventDefault` on the arrow keys.
- Guard the global open shortcut against firing while the user types elsewhere, and always provide a visible button as an alternative door.
- Announce the result count politely, keep the active option scrolled into view, and meet contrast minimums for the highlight.

## The lesson

A command palette is a showcase of whether a team treats accessibility as structural or cosmetic. Get the dialog semantics, focus trapping, focus restoration, and the active descendant pattern right, and the palette works for everyone with no special cases. Skip them, and you ship a feature that looks impressive in a demo and excludes a meaningful slice of your users the moment they reach for the keyboard.
