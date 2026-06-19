# Solar Build Notes

Observations, friction points, and workarounds encountered while building a marketing homepage on Solar. Intended as feedback for the framework repo.

---

## What worked well

- **Scaffold is solid.** `npm create solarbuild@latest` produces a complete, runnable starting point with the full design system already wired into `index.html`. The ambient effects (stars, orb, orbit ring) are a nice touch that sets the tone immediately.
- **`h()` is readable.** The nested-array syntax reads close to actual HTML structure, especially for layout-heavy components. Much less noisy than nested `createElement()` calls.
- **Registry-based component resolution.** Being able to reference a component by name string in `h()` after importing it once is clean. It removes the need for prop drilling imports through every usage site.
- **No build step.** Serving static files and seeing changes on refresh is genuinely fast for iteration.

---

## Issues and friction points

### 1. Sub-components don't get reconciler instances

**What happened:** In `h()`, when a component name is resolved from the registry, it is called directly and its result (a vnode) is returned inline. The component is never registered as an instance in the reconciler's `instances` map.

**Consequence:** `useState`, `useMemo`, `useResource`, and any other hooks **will not work** inside a component that is composed via `h()`. Hooks depend on `setCurrentComponent()` being called by `renderInstance()` in the reconciler — that only happens for the root component passed to `mountComponent()`. Any child component resolved through `h()` runs its render function with no active component context, so hooks silently fail or throw.

**Workaround used:** All stateful logic was kept in the root `HomePage` component. All child components (`Nav`, `Hero`, `Features`, etc.) are purely presentational with no hooks.

**Suggested fix:** When h() resolves a component from the registry, it could spawn a child reconciler instance rather than calling the render function directly. Alternatively, document clearly that hooks are only valid in root-mounted components and that composed components must be stateless.

---

### 2. No way to render HTML strings (no `innerHTML` / `dangerouslySetInnerHTML`)

**What happened:** Needed to render a syntax-highlighted code block. In React this would use `dangerouslySetInnerHTML`. Solar's `createElement` and `applyProps` have no equivalent — there's no prop that sets `innerHTML` on a DOM node.

**Consequence:** Had to render the code example as plain text inside `<pre>` instead of HTML with syntax-highlighting spans. Visual quality is reduced.

**Workaround used:** Passed the code as a plain string child to `['pre', { class: 'code-block__pre' }, code]`. The renderer correctly creates a text node.

**Suggested fix:** Add an `innerHTML` prop (or `dangerouslySetInnerHTML` à la React) in `applyProps` for cases where raw HTML rendering is genuinely needed. Could be gated behind a naming convention that signals intent.

---

### 3. `style` prop behavior is inconsistent

**What happened:** `applyProps` handles `style` as an object via `Object.assign(el.style, v)`, but if `style` is passed as a string it falls through to `el.setAttribute('style', v)`. Both paths work at runtime, but the split is implicit and undocumented.

**Example:** `style: 'background:#ff5f57'` (string) and `style: { background: '#ff5f57' }` (object) both produce correct output through different code paths.

**Suggested fix:** Either normalize style to always accept both forms explicitly (document both), or throw a clear error if a string is passed so authors know to use the object form.

---

### 4. Passing children through `h()` to a component requires an explicit prop declaration

**What happened:** In `h()`, children are forwarded as `{ children: [...] }` when present. However, `defineComponent` runs prop validation via `validateProps` on every call. If a component's prop schema doesn't declare `children`, passing child nodes through `h()` may either be silently dropped or cause a validation error depending on the strictness of `validateProps`.

**Workaround used:** Avoided passing children through the registry resolution path entirely — all content was passed as explicit named props or rendered inline within each component's own `render()`.

**Suggested fix:** Either auto-allow `children` as a reserved prop that bypasses schema validation, or document the requirement to declare `children` explicitly in the schema when slot-style composition is needed.

---

### 5. Template literal escaping in code strings

**Minor DX issue.** When a component needs to display source code that itself contains template literals (e.g. a code example component), escaping is required when using a template literal to define the string:

```js
// Requires escaping the inner backtick and ${}
const code = `return h(['button', { class: \`btn btn--\${variant}\` }, label])`
```

This is a JavaScript language limitation, not a Solar bug. However, it came up when building `CodeExample.js` and is worth noting in Solar's docs if a "display code" pattern is part of the intended use case. Using a plain string literal avoids it entirely.

---

## Missing from the docs

- **No mention of the hooks-in-child-components limitation.** This is the most consequential constraint for anyone building a non-trivial app and should be called out explicitly in the component model docs.
- **No canonical pattern for passing children / slots.** React has `children`, Vue has `<slot>` — Solar has no documented equivalent. The `h()` implementation passes children as a prop but it's not surfaced anywhere in the guide.
- **`h()` vs `createElement()` trade-offs aren't described.** The guide introduces both but doesn't say when to prefer one over the other.

---

## Summary

Solar's foundation is genuinely interesting — the registry, structured errors, and no-build philosophy are well-suited for AI-generated code. The main gap for building real pages is that stateful composition (hooks in child components) doesn't work in the current architecture. For purely presentational UIs it holds up well.
