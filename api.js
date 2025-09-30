/*  api.js  –  GitHub-Pages edition  (NO mock)  */
(function (global) {
  'use strict';

  // 1.  your Vercel function (or any backend) that talks to Cuttly
  const STATS_ENDPOINT = 'https://dashboard-xi-peach.vercel.app/api/cuttly-stats';

  // 2.  public helper – same signature as before
  global.fetchLinkAnalytics = async function (shortLink) {
    console.log('[api] requesting real stats for', shortLink);

    try {
      const url = STATS_ENDPOINT + '?short=' + encodeURIComponent(shortLink);
      const res = await fetch(url, { method: 'GET' });

      if (!res.ok) throw new Error('HTTP ' + res.status);
      const payload = await res.json();

      console.log('[api] Cuttly raw answer', payload);

      // 3.  guarantee the shape the UI expects
      return {
        total   : payload.total   ?? 0,
        daily   : payload.daily   ?? 0,
        yesterday:payload.yesterday?? 0,
        weekly  : payload.weekly  ?? 0,
        monthly : payload.monthly ?? 0,
        allTime : payload.allTime ?? 0,
        trend   : payload.trend   ?? []
      };
    } catch (err) {
      console.error('[api] live fetch failed – using zero fallback', err);
      return { total: 0, daily: 0, yesterday: 0, weekly: 0, monthly: 0, allTime: 0, trend: [] };
    }
  };
})(window);
