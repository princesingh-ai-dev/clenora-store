## 2026-05-11 - [DOM XSS via localStorage]
**Vulnerability:** The application stored cart data in `localStorage` and blindly injected values directly into `innerHTML` using template strings, causing a DOM-based Cross-Site Scripting (XSS) vulnerability.
**Learning:** Even data originating from local storage should never be trusted, as it can be tampered with by an attacker (or compromised via a previous XSS).
**Prevention:** Always use safe methods like `textContent` or robust sanitization (e.g., `escapeHTML`) before injecting data into the DOM.
