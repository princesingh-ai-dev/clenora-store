## 2024-05-24 - [CRITICAL] Prevent DOM XSS from LocalStorage and Handle Array Bypass

**Vulnerability:**
- Cross-Site Scripting (XSS) via `localStorage` data injection. Cart data cached in `localStorage` was rendered in the DOM (`updateCartDisplay`, `renderOrderSummary`) without proper sanitization. Since `localStorage` data can be manipulated by malicious users (or other subdomains), injecting it directly into `innerHTML` allows arbitrary execution of JavaScript.
- Event handlers in JavaScript using unescaped variables like `onclick="removeFromCart('${item.id}')"` allowed attackers to inject code by breaking out of quotes.
- Array bypass in custom HTML escaping: if an array object is passed to `String.prototype.replace()`, it can evaluate differently and evade sanitization logic.

**Learning:**
- The project used inline event handlers that accept untrusted variables. Browsers unescape HTML entities inside element attributes before JS execution, re-opening XSS vectors.
- Custom HTML sanitizers are susceptible to bypasses (e.g. array payloads) if not explicitly typed or casted to a primitive string before replacement operations.
- `localStorage` must be treated as completely untrusted input, equivalent to query parameters or headers.

**Prevention:**
- Implemented `escapeHTML(str)` function that explicitly casts input (`String(str)`) before performing sanitization replacements to prevent array bypasses.
- Applied `escapeHTML` to all `localStorage` variables before dynamically injecting them into the DOM via `innerHTML`.
- Replaced inline event handlers (`onclick`) with Event Delegation on the container (`cartItemsContainer`), passing IDs through DOM `data-*` attributes (`data-id`, `data-change`) which are then handled natively by JavaScript, eliminating string-breaking attribute injections.
- Explicitly compared DOM attributes (which are strings) with model IDs (which could be numbers) by casting them (`String(item.id) === String(id)`).
