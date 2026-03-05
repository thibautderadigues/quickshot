import { supabase } from './supabase';

function isExcluded() {
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return true;
  if (localStorage.getItem('qs_no_track') === '1') return true;
  return false;
}

export function excludeFromTracking() {
  localStorage.setItem('qs_no_track', '1');
}

export async function trackEvent(type, metadata = {}) {
  if (!supabase || isExcluded()) return;

  try {
    await supabase.from('events').insert({
      type,
      metadata,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
    });
  } catch {
    // Silently fail — tracking should never break the app
  }
}

export async function getStats() {
  if (!supabase) return null;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [totalsRes, todayRes, dailyRes, recentRes] = await Promise.all([
    supabase.from('events').select('type', { count: 'exact', head: false }),
    supabase.from('events').select('type', { count: 'exact', head: false }).gte('created_at', todayStart),
    supabase.from('events').select('type, created_at').gte('created_at', thirtyDaysAgo).order('created_at', { ascending: true }),
    supabase.from('events').select('*').order('created_at', { ascending: false }).limit(50),
  ]);

  const countByType = (rows, type) => rows?.filter((r) => r.type === type).length || 0;

  const totals = totalsRes.data || [];
  const todayData = todayRes.data || [];
  const dailyData = dailyRes.data || [];

  const dailyMap = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    dailyMap[key] = { date: key, visits: 0, uploads: 0, exports: 0 };
  }
  dailyData.forEach((ev) => {
    const key = ev.created_at.slice(0, 10);
    if (dailyMap[key]) {
      if (ev.type === 'visit') dailyMap[key].visits++;
      else if (ev.type === 'upload') dailyMap[key].uploads++;
      else if (ev.type === 'export') dailyMap[key].exports++;
    }
  });

  return {
    totalVisits: countByType(totals, 'visit'),
    totalUploads: countByType(totals, 'upload'),
    totalExports: countByType(totals, 'export'),
    todayVisits: countByType(todayData, 'visit'),
    todayUploads: countByType(todayData, 'upload'),
    todayExports: countByType(todayData, 'export'),
    daily: Object.values(dailyMap),
    recent: recentRes.data || [],
  };
}
