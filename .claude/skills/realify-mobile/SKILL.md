---
name: realify-mobile
description: Use this skill whenever making mobile responsive changes in the Realify project. Apply only mobile-specific improvements without affecting the desktop UI.
---

# Realify Mobile Responsiveness

## Purpose

This skill ensures that all mobile responsiveness changes are implemented safely while preserving the existing desktop experience.

---

# Rules

- Never change desktop UI.
- Use Tailwind responsive classes (`sm:`, `md:`, `lg:`).
- Preserve dark mode.
- Avoid duplicate JSX.
- Prefer reusable components.
- Keep spacing consistent.

---

# Responsive Guidelines

## Responsive Classes

Always use Tailwind responsive utilities.

Examples:

```jsx
sm:
md:
lg:
```

Do not replace desktop classes unless absolutely necessary.

---

## Layout

Prefer responsive layouts instead of creating separate components.

Example:

```jsx
flex-col sm:flex-row
```

instead of duplicating JSX.

---

## Width

Prefer responsive widths.

Example:

```jsx
w-full sm:w-auto
```

Avoid fixed widths whenever possible.

---

## Scroll Handling

For tables, filters, tabs, or horizontally overflowing content, use:

```jsx
overflow-x-auto
```

instead of breaking layouts or shrinking content.

---

## Component Reusability

- Reuse existing components whenever possible.
- Avoid creating duplicate layouts.
- Keep code clean and maintainable.

---

## Dark Mode

Ensure every mobile change also works correctly in dark mode.

Never remove or break existing dark mode classes.

---

# Before Finishing

Always verify:

- Desktop is unchanged.
- Mobile looks better.
- Dark mode still works.
- No duplicated code.

---

# Expected Behaviour

Whenever asked to:

- Fix mobile responsiveness
- Improve mobile layout
- Make a page responsive
- Fix overflow issues
- Improve tablet/mobile experience

Follow all rules in this skill automatically while keeping the desktop experience exactly the same.