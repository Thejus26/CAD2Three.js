export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('ServiceWorker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('ServiceWorker registration failed:', err);
        });
    });
  }
}
