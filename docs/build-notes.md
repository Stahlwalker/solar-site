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

### 5. Third-party library integration requires manual timing

**What happened:** Needed syntax highlighting via Prism.js. Solar has no package manager integration or import map support — external libraries must be loaded via `<script>` CDN tags in `index.html`.

**Consequence:** Two timing problems arise:
1. The CDN `<script>` must load before Solar's module scripts run, so it needs to appear earlier in the HTML.
2. `Prism.highlightAll()` must be called *after* Solar mounts and the DOM is populated. Since Solar renders synchronously in `mountComponent()`, a second `<script type="module">` placed after the main module works — module scripts execute in document order, so it fires after the first one completes.

```html
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js" data-manual></script>
<script type="module" src="./main.js"></script>
<script type="module">
  if (window.Prism) Prism.highlightAll()
</script>
```

**Suggested fix:** Document this CDN + post-mount timing pattern. If Solar ever makes `mountComponent()` async, this pattern breaks and would need a callback or promise-based hook.

---

### 6. No `<head>` / meta management from components

**What happened:** Page title, `<meta>` description, Open Graph tags, and favicons can only be set statically in `index.html`. There is no equivalent of Next.js's `<Head>` or React Helmet — no way for a component to update the document head.

**Consequence:** For a single-page marketing site this is fine. For a multi-page app or any site that needs dynamic titles or OG tags per route, this is a hard blocker.

**Suggested fix:** A lightweight `setMeta({ title, description })` utility, or document the workaround (direct `document.title` assignment in a component's `onMount`).

---

### 7. No built-in router

**What happened:** Building even a two-page site (home + about) would require either separate HTML files or a hash-based router built from scratch. There is no `<Link>`, no `useRouter`, and no route-based component mounting built into Solar.

**Consequence:** Not a blocker for a single-page site, but means Solar doesn't scale to multi-page apps without significant additional work.

**Suggested fix:** Even a minimal hash router (`#/about` → mount `AboutPage`) would make Solar viable for small multi-page sites without needing a full framework on top.

---

### 8. Scaffold creates a subdirectory, not the project root

**What happened:** Running `npm create solarbuild@latest my-site` creates files inside `my-site/`, not at the repo root. When deploying to GitHub Pages (which can only serve from `/` or `/docs`), all files had to be manually moved up to the repo root.

```bash
git mv my-site/index.html index.html
git mv my-site/components components
# etc.
```

**Suggested fix:** Either document this deployment gotcha explicitly, or offer a `--root` flag that scaffolds into the current directory. Most static hosts (GitHub Pages, Netlify, Cloudflare Pages) expect the site at the repo root or a single configurable folder.

---

### 9. Template literal escaping in code strings

**Minor DX issue.** When a component needs to display source code that itself contains template literals (e.g. a code example component), escaping is required when using a template literal to define the string:

```js
// Requires escaping the inner backtick and ${}
const code = `return h(['button', { class: \`btn btn--\${variant}\` }, label])`
```

This is a JavaScript language limitation, not a Solar bug. However, it came up when building `CodeExample.js` and is worth noting in Solar's docs if a "display code" pattern is part of the intended use case. Using a plain string literal avoids it entirely.

---

### 10. No portal / teleport mechanism

**What happened:** Building a rich hero section required several layers that exist outside the component tree: a star-field canvas, an ambient orb glow, a dot-grid overlay, and floating decorative chips. In React or Vue these would typically be rendered via a portal (`ReactDOM.createPortal`, Vue's `<Teleport>`) so a component can place DOM nodes anywhere in the document — a modal root, fixed overlay, `<body>` etc.

**Consequence:** All ambient effects had to be written as raw HTML and `<script>` tags directly in `index.html`, as siblings to `#app`. They can't be encapsulated in Solar components because there's no way for a component to render outside its parent subtree. This breaks the "everything is a component" model for any visually layered UI.

**Workaround used:** Placed `<canvas class="stars">`, `.orb`, `.dot-grid`, and `.float-chip` elements as direct children of `<body>`, above `#app`, with `position: fixed` and `z-index` layering.

**Suggested fix:** A `mountPortal(component, domNode)` utility that mounts a Solar component into an arbitrary DOM target would cover most cases. Even just documenting the raw-HTML-alongside-`#app` pattern would help.

---

### 11. No `onMount` lifecycle for sub-components

**What happened:** The star-field canvas needed to start a `requestAnimationFrame` loop after the DOM was ready. Normally this would go in an `onMount` hook. But as documented in issue #1, hooks don't work in sub-components. Even for the root component, there's no documented `onMount` equivalent — `mountComponent()` is synchronous and returns nothing.

**Consequence:** DOM-dependent initialization (canvas setup, third-party widget attachment, scroll listeners) can't be done from within any component. Everything has to live in a separate `<script>` tag that runs after `mountComponent()`.

**Workaround used:** Placed the canvas animation script in a plain `<script>` block before the module scripts. Since Solar mounts synchronously, the order `<script>` → `<script type="module" src="main.js">` → `<script type="module">Prism.highlightAll()</script>` guarantees correct sequencing.

**Suggested fix:** `mountComponent()` could accept an `{ onMount }` option, or return a handle with a `.onMount(fn)` callback. This would give root components a clean place to run post-render DOM work and remove the need for out-of-band `<script>` tags.

---

### 12. Ambient / visual-layer components aren't feasible

**Practical summary of issues #1, #10, and #11 combined.** When building a marketing page with a star field, animated orb, dot grid, and floating chips, none of these could be Solar components. The combination of no portals, no `onMount`, and no canvas/animation APIs meant the entire visual layer lived outside Solar. For a framework positioned as the UI layer for AI-generated code, this is a meaningful gap — AI agents generating visually rich UIs will hit this wall immediately.

---

## Missing from the docs

- **No mention of the hooks-in-child-components limitation.** This is the most consequential constraint for anyone building a non-trivial app and should be called out explicitly in the component model docs.
- **No canonical pattern for passing children / slots.** React has `children`, Vue has `<slot>` — Solar has no documented equivalent. The `h()` implementation passes children as a prop but it's not surfaced anywhere in the guide.
- **`h()` vs `createElement()` trade-offs aren't described.** The guide introduces both but doesn't say when to prefer one over the other.
- **No third-party library integration guide.** The CDN loading + post-mount timing pattern is non-obvious and should be documented with an example.
- **No deployment guide.** GitHub Pages, Netlify, Cloudflare Pages all have different folder expectations. The scaffold subdirectory issue should be called out.
- **No meta/head management documented.** Even a note that `document.title` must be set manually in `onMount` would help.
- **No mention of portal or teleport patterns.** Fixed overlays, modals, and ambient background layers all need to live outside `#app`. This should be documented.
- **No `onMount` / post-render hook documented.** Canvas setup, scroll listeners, third-party widget attachment — all common real-world needs — require a post-mount callback that currently doesn't exist or isn't documented.

---

## Summary

Solar's foundation is genuinely interesting — the registry, structured errors, and no-build philosophy are well-suited for AI-generated code. For purely presentational, single-page UIs it holds up well. The main gaps for real-world use are: stateful composition (hooks in child components don't work), no portal mechanism, no `onMount` lifecycle, no router, no head management, and some friction around third-party library integration and deployment setup. The practical consequence is that any visually rich UI — ambient effects, canvas, fixed overlays — ends up living entirely outside Solar's component system. None of these are architectural blockers — they're missing primitives that are straightforward to add.
