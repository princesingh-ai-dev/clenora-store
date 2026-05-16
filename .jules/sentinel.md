## 2024-05-16 - [DOM-based XSS via LocalStorage and Inline Handlers]
**Vulnerability:** Untrusted user input stored in `localStorage` (like 'clenoraCart') was injected directly into the DOM (via `innerHTML` and inline `onclick` handlers) in `updateCartDisplay`. Also, any `escapeHTML` logic could be bypassed using an Array payload if no string casting was applied.
**Learning:** Even if data seems safe since it comes from the app itself, values extracted from `localStorage` can be modified by the user or malicious scripts. Using inline event handlers combined with template literals exacerbates this risk because the browser unescapes HTML entities *before* executing the JS. The JavaScript `typeof` check returns `object` for arrays, potentially bypassing sanitization logic that only applies string manipulation.
**Prevention:**
1. Always treat `localStorage` data as untrusted.
2. Explicitly cast variables to a string (e.g. `String(input)`) before applying HTML escaping to prevent array bypass attacks.
3. Use strict HTML entity escaping (`escapeHTML`) on dynamic properties injected into the DOM.
4. Avoid inline event handlers (like `onclick=...`); use `data-*` attributes and event delegation instead.
