// Hide the preloader once the page is fully loaded or after a fallback timeout.
// Only show on first visit during the session.
(function(){
  const preloader = document.getElementById('preloader');
  if(!preloader) return;

  // Check if this is the first visit.
  // We still want to show the preloader on a full reload (e.g. Ctrl+F5), but not on normal in-site navigation.
  // Determine navigation type via PerformanceNavigationTiming when available.
  let navType = 'navigate';
  try {
    if (performance.getEntriesByType) {
      const entries = performance.getEntriesByType('navigation');
      if (entries && entries[0] && entries[0].type) navType = entries[0].type; // 'navigate' | 'reload' | 'back_forward' | 'prerender'
    } else if (performance.navigation && typeof performance.navigation.type === 'number') {
      // fallback: 1 === reload
      navType = performance.navigation.type === 1 ? 'reload' : (performance.navigation.type === 2 ? 'back_forward' : 'navigate');
    }
  } catch (e) {
    // ignore and default to 'navigate'
  }

  // If we've already shown the preloader in this tab/session, skip it — unless this load is a reload.
  if (sessionStorage.getItem('hasVisited')) {
    if (navType !== 'reload') {
      preloader.remove();
      return;
    }
    // else: it's a reload -> run the preloader again
  }
  sessionStorage.setItem('hasVisited', 'true');

  // Configuration: change these values if you want a different experience
  const MIN_VISIBLE_MS = 4000; // minimum time the loader is visible (ms) — changed to 4 per user request
  const MAX_FALLBACK_MS = 30000; // hard stop fallback (ms)

  const startedAt = Date.now();

  function removeAfterFade() {
    // remove from DOM after the CSS fade transition so it doesn't block interactions
    setTimeout(() => preloader.remove(), 600);
  }

  function hidePreloaderNow() {
    // set aria-hidden to allow CSS transition to fade the overlay
    preloader.setAttribute('aria-hidden', 'true');
    removeAfterFade();
  }

  function scheduleHide() {
    const elapsed = Date.now() - startedAt;
    const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
    // schedule hide after remaining time (or immediately if elapsed >= MIN_VISIBLE_MS)
    setTimeout(hidePreloaderNow, wait);
  }

  // If the page is already loaded (cached), still respect the minimum visible time
  if (document.readyState === 'complete') {
    scheduleHide();
  } else {
    window.addEventListener('load', scheduleHide, { once: true });
  }

  // Hard fallback: ensure the loader never stays longer than MAX_FALLBACK_MS
  setTimeout(hidePreloaderNow, MAX_FALLBACK_MS);
})();