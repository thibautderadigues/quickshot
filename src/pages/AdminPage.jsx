import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStats, excludeFromTracking } from '../lib/analytics';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin';

const fonts = {
  title: '"Neue Regrade", sans-serif',
  body: '"DM Sans", sans-serif',
};

function StatCard({ label, value, sub, icon }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-white/40 text-sm" style={{ fontFamily: fonts.body, fontWeight: 400 }}>{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <span className="text-3xl text-white" style={{ fontFamily: fonts.title, fontWeight: 600 }}>{value}</span>
      {sub && <span className="text-xs text-white/30" style={{ fontFamily: fonts.body }}>{sub}</span>}
    </div>
  );
}

function MiniChart({ data }) {
  const maxVal = Math.max(...data.map((d) => d.visits + d.uploads + d.exports), 1);

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
      <h3 className="text-white/40 text-sm mb-4" style={{ fontFamily: fonts.body, fontWeight: 400 }}>Last 30 days</h3>
      <div className="flex items-end gap-[3px] h-32">
        {data.map((d) => {
          const total = d.visits + d.uploads + d.exports;
          const h = Math.max((total / maxVal) * 100, 2);
          return (
            <div key={d.date} className="flex-1 flex flex-col items-center justify-end h-full group relative">
              <div
                className="w-full rounded-sm bg-[#FFAA01]/80 hover:bg-[#FFAA01] transition-colors cursor-default min-h-[2px]"
                style={{ height: `${h}%` }}
              />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10" style={{ fontFamily: fonts.body }}>
                {d.date.slice(5)} — {total} events
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EventRow({ event }) {
  const typeColors = {
    visit: 'bg-blue-500/20 text-blue-400',
    upload: 'bg-green-500/20 text-green-400',
    export: 'bg-purple-500/20 text-purple-400',
  };

  const time = new Date(event.created_at);
  const relative = getRelativeTime(time);

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
      <span className={`text-[11px] px-2 py-0.5 rounded-full ${typeColors[event.type] || 'bg-white/10 text-white/50'}`} style={{ fontFamily: fonts.body, fontWeight: 500 }}>
        {event.type}
      </span>
      <span className="text-white/20 text-xs flex-1 truncate" style={{ fontFamily: fonts.body }}>
        {event.user_agent?.slice(0, 60)}
      </span>
      <span className="text-white/30 text-xs shrink-0" style={{ fontFamily: fonts.body }}>{relative}</span>
    </div>
  );
}

function getRelativeTime(date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('qs_admin', '1');
      excludeFromTracking();
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <h1 className="text-2xl text-white mb-1" style={{ fontFamily: fonts.title, fontWeight: 600 }}>QuickShot Admin</h1>
        <p className="text-white/40 text-sm mb-8" style={{ fontFamily: fonts.body }}>Enter the admin password to continue.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className={`w-full bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-4 py-3 text-white placeholder-white/30 outline-none focus:border-[#FFAA01]/50 transition-colors`}
          style={{ fontFamily: fonts.body }}
        />
        <button
          type="submit"
          className="w-full mt-4 bg-[#FFAA01] hover:bg-[#ffb92e] text-black h-[44px] rounded-lg transition-colors"
          style={{ fontFamily: fonts.title, fontWeight: 600, fontSize: '15px' }}
        >
          Log in
        </button>
        {error && <p className="text-red-400 text-sm mt-3 text-center" style={{ fontFamily: fonts.body }}>Wrong password</p>}
      </form>
    </div>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('qs_admin') === '1');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getStats();
      if (!data) {
        setError('Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
      } else {
        setStats(data);
        setError(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchData();
  }, [authed, fetchData]);

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FFAA01] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="text-xl text-white mb-3" style={{ fontFamily: fonts.title, fontWeight: 600 }}>Configuration needed</h1>
          <p className="text-white/50 text-sm mb-6" style={{ fontFamily: fonts.body }}>{error}</p>
          <button onClick={() => navigate('/')} className="text-[#FFAA01] text-sm hover:underline" style={{ fontFamily: fonts.body }}>
            ← Back to app
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg" style={{ fontFamily: fonts.title, fontWeight: 600 }}>QuickShot Admin</h1>
          <span className="text-[11px] bg-[#FFAA01]/10 text-[#FFAA01] px-2 py-0.5 rounded-full" style={{ fontFamily: fonts.body, fontWeight: 500 }}>analytics</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchData}
            className="text-white/40 hover:text-white transition-colors text-sm"
            style={{ fontFamily: fonts.body }}
          >
            Refresh
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-white/40 hover:text-white transition-colors text-sm"
            style={{ fontFamily: fonts.body }}
          >
            ← App
          </button>
          <button
            onClick={() => { sessionStorage.removeItem('qs_admin'); setAuthed(false); }}
            className="text-white/40 hover:text-red-400 transition-colors text-sm"
            style={{ fontFamily: fonts.body }}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total visits" value={stats.totalVisits} sub={`${stats.todayVisits} today`} icon="👁" />
          <StatCard label="Uploads" value={stats.totalUploads} sub={`${stats.todayUploads} today`} icon="📤" />
          <StatCard label="Exports" value={stats.totalExports} sub={`${stats.todayExports} today`} icon="🖼" />
          <StatCard label="Conversion" value={stats.totalVisits ? `${Math.round((stats.totalExports / stats.totalVisits) * 100)}%` : '—'} sub="visits → exports" icon="📊" />
        </div>

        <MiniChart data={stats.daily} />

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
          <h3 className="text-white/40 text-sm mb-3" style={{ fontFamily: fonts.body, fontWeight: 400 }}>Recent events</h3>
          {stats.recent.length === 0 ? (
            <p className="text-white/20 text-sm py-4 text-center" style={{ fontFamily: fonts.body }}>No events yet</p>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {stats.recent.map((ev) => (
                <EventRow key={ev.id} event={ev} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
