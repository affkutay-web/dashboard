// api.js  –-  GitHub-Pages compatible
// -----------------------------------------------------------
// 1.  If USE_REAL_API is false (default) we return mock numbers.
// 2.  When you deploy a real /api/cuttly-stats route somewhere,
//     set USE_REAL_API = true  and change API_ENDPOINT below.
// -----------------------------------------------------------
(function (global) {
  'use strict';

  const USE_REAL_API   = true;           // << flip when ready
  const API_ENDPOINT   = '/api/cuttly-stats'; // or 'https://my-vercel.app/api/cuttly-stats'

  /* ---------------------------------------------------------
   * Mock data helper
   * --------------------------------------------------------- */
  function getMockStats() {
    return {
      total   : Math.floor(Math.random() * 10000) + 1000,
      daily   : Math.floor(Math.random() * 500)   + 50,
      yesterday:Math.floor(Math.random() * 400)   + 40,
      weekly  : Math.floor(Math.random() * 3000)  + 500,
      monthly : Math.floor(Math.random() * 10000) + 2000,
      allTime : Math.floor(Math.random() * 15000) + 3000,
      trend   : Array.from({ length: 7 }, function () {
                  return Math.floor(Math.random() * 200) + 50;
                })
    };
  }

  /* ---------------------------------------------------------
   * Real API caller
   * --------------------------------------------------------- */
  async function fetchRealStats(shortLink) {
    const url = API_ENDPOINT + '?short=' + encodeURIComponent(shortLink);
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network error – ' + res.status);
    return await res.json();   // should match the mock shape
  }

  /* ---------------------------------------------------------
   * Public function – same signature as before
   * --------------------------------------------------------- */
  global.fetchLinkAnalytics = async function (shortLink) {
    try {
      if (USE_REAL_API) {
        return await fetchRealStats(shortLink);
      }
      // else: mock path
      await new Promise(function (r) { setTimeout(r, 400); }); // tiny delay
      return getMockStats();
    } catch (err) {
      console.warn('fetchLinkAnalytics() – ', err);
      // graceful fallback
      return getMockStats();
    }
  };

})(window);
