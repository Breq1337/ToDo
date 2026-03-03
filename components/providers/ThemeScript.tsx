/**
 * Inline script to set theme class before paint to avoid flash.
 */

export function ThemeScript() {
  const script = `
    (function() {
      var theme = localStorage.getItem('todogreen-theme');
      var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var value = theme === 'dark' || theme === 'light' ? theme : (systemDark ? 'dark' : 'light');
      document.documentElement.classList.add(value);
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
