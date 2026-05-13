## 2024-05-13 - [Fix] DOM XSS in LocalStorage to innerHTML Rendering
**Vulnerability:** A critical DOM-based Cross-Site Scripting (XSS) vulnerability existed where cart data retrieved from `localStorage` was mapped directly into string templates and injected into the DOM via `innerHTML` without HTML entity escaping. This allowed malicious payloads injected into `localStorage` (via local access or another vector) to execute arbitrary JavaScript.
**Learning:** It is extremely dangerous to pass unsanitized variables into inline HTML event handlers (e.g., `onclick="..."`) because the browser unescapes HTML entities *before* JavaScript evaluates them. Simply escaping HTML isn't enough if the variable goes into an `onclick` attribute. Furthermore, when writing custom sanitization functions, the input must explicitly be cast to a string to prevent array-based bypasses (where `typeof str === 'object'` evaluates true but fails string methods).
**Prevention:**
1. Always escape variables before injecting them into `innerHTML`.
2. Avoid inline `onclick` handlers. Use `data-*` attributes and attach listeners via event delegation (e.g., `.addEventListener('click', ...)`).
3. Explicitly typecast inputs to `String()` when implementing custom security utilities to prevent object/array bypass exploits.
