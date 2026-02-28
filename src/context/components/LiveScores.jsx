import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

const POLL_INTERVAL_MS = 60_000;
// Base ms per game chip for dynamic scroll speed (~8s per chip, min 20s, max 80s)
const SCROLL_MS_PER_CHIP = 8_000;
const SCROLL_MIN_MS = 20_000;
const SCROLL_MAX_MS = 80_000;

/* ─── Static styles (extracted outside component to avoid re-creation) ─── */

const S = {
  wrapper: {
    background: 'rgba(8, 8, 10, 0.82)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255, 71, 71, 0.1)',
    height: '36px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
  },
  nbaLink: {
    flexShrink: 0,
    padding: '0 14px',
    fontSize: '0.65rem',
    fontWeight: '800',
    letterSpacing: '1.5px',
    color: '#ff4747',
    borderRight: '1px solid rgba(255,71,71,0.15)',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255,71,71,0.06)',
    textDecoration: 'none',
    transition: 'background 0.2s ease',
    cursor: 'pointer',
  },
  tickerArea: { flex: 1, overflow: 'hidden', padding: '0 12px' },
  emptyText: { fontSize: '0.75rem', color: '#555' },
  lastUpdated: {
    flexShrink: 0,
    padding: '0 12px',
    fontSize: '0.65rem',
    color: '#444',
    borderLeft: '1px solid rgba(255,255,255,0.05)',
    whiteSpace: 'nowrap',
  },
  // chip base
  chipBase: {
    display: 'inline-flex',
    flexShrink: 0,
    alignItems: 'center',
    gap: '10px',
    padding: '5px 14px',
    borderRadius: '30px',
    whiteSpace: 'nowrap',
  },
  liveBadgeWrap: { display: 'flex', alignItems: 'center', gap: '5px' },
  liveDot: {
    width: '7px', height: '7px', borderRadius: '50%',
    background: '#ff4747', boxShadow: '0 0 6px rgba(255,71,71,0.8)',
    animation: 'livePulse 1.4s ease-in-out infinite',
    display: 'inline-block', flexShrink: 0,
  },
  liveBadgeText: { fontSize: '0.65rem', fontWeight: '800', color: '#ff4747', letterSpacing: '0.8px' },
  finalBadgeText: { fontSize: '0.65rem', fontWeight: '700', color: '#888899', letterSpacing: '0.8px' },
  teamText: { fontSize: '0.82rem', fontWeight: '600', color: '#fff' },
  atText: { fontSize: '0.75rem', color: '#888899' },
  clockText: { fontSize: '0.7rem', color: '#888899' },
};

/* ─── helpers ──────────────────────────────────────────────── */

function formatClock(period, clock) {
  if (!period) return '';
  const q = period <= 4 ? `Q${period}` : `OT${period - 4}`;
  return clock ? `${q} · ${clock}` : q;
}

function formatKickoff(datetimeStr) {
  if (!datetimeStr) return '';
  try {
    return new Date(datetimeStr).toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit',
      timeZone: 'America/New_York', hour12: true,
    }) + ' ET';
  } catch { return ''; }
}

function formatLastUpdated(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true,
    });
  } catch { return ''; }
}

function calcScrollDuration(chipCount) {
  const ms = chipCount * SCROLL_MS_PER_CHIP;
  return Math.min(SCROLL_MAX_MS, Math.max(SCROLL_MIN_MS, ms));
}

/* ─── GameChip ─────────────────────────────────────────────── */

const GameChip = ({ game }) => {
  const isLive = game.status === 'live';
  const isFinal = game.status === 'final';

  const chipStyle = {
    ...S.chipBase,
    background: isLive ? 'rgba(255,71,71,0.08)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${isLive ? 'rgba(255,71,71,0.25)' : 'rgba(255,255,255,0.07)'}`,
  };
  const scoreStyle = {
    fontSize: '0.82rem', fontWeight: '700',
    color: isLive ? '#f7e998' : '#ccc',
  };

  return (
    <div style={chipStyle}>
      {isLive && (
        <span style={S.liveBadgeWrap}>
          <span style={S.liveDot} />
          <span style={S.liveBadgeText}>LIVE</span>
        </span>
      )}
      {isFinal && <span style={S.finalBadgeText}>FINAL</span>}

      <span style={S.teamText}>{game.awayTeam.abbreviation}</span>

      {(isLive || isFinal) ? (
        <span style={scoreStyle}>{game.awayScore} – {game.homeScore}</span>
      ) : (
        <span style={S.atText}>@</span>
      )}

      <span style={S.teamText}>{game.homeTeam.abbreviation}</span>

      {isLive && game.period && (
        <span style={S.clockText}>{formatClock(game.period, game.clock)}</span>
      )}
      {game.status === 'upcoming' && (
        <span style={S.clockText}>{game.kickoff || 'TBD'}</span>
      )}
    </div>
  );
};

/* ─── LiveScores ───────────────────────────────────────────── */

const LiveScores = () => {
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);
  const abortRef = useRef(null);  // AbortController ref

  // ── fetch with abort support ────────────────────────────────
  const fetchScores = useCallback(async () => {
    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    const { signal } = abortRef.current;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/live-scores`,
        { signal }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setScores(data);
    } catch (err) {
      if (err.name === 'AbortError') return; // unmounted — ignore cleanly
      console.error('LiveScores fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── polling with Page Visibility API ───────────────────────
  useEffect(() => {
    fetchScores();

    const startInterval = () => {
      intervalRef.current = setInterval(fetchScores, POLL_INTERVAL_MS);
    };

    const stopInterval = () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopInterval();          // tab hidden → stop wasting invocations
      } else {
        fetchScores();           // tab visible again → fetch immediately
        startInterval();         // then resume normal polling
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    startInterval();

    return () => {
      stopInterval();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Abort any pending fetch on unmount
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchScores]);

  // ── derived data ────────────────────────────────────────────
  const allGames = scores
    ? [...(scores.live || []), ...(scores.final || []), ...(scores.upcoming || [])]
    : [];
  const hasGames = allGames.length > 0;

  // Dynamic scroll duration: ms proportional to chip count
  const scrollDuration = `${calcScrollDuration(allGames.length)}ms`;

  return (
    <>
      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px rgba(255,71,71,0.8); }
          50%       { opacity: 0.5; box-shadow: 0 0 12px rgba(255,71,71,0.4); }
        }
        @keyframes tickerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          display: flex;
          gap: 12px;
          width: max-content;
          animation: tickerScroll var(--scroll-dur, 40s) linear infinite;
        }
        .ticker-track:hover { animation-play-state: paused; }
        .nba-link:hover { background: rgba(255,71,71,0.14) !important; }
      `}</style>

      <div style={S.wrapper}>
        {/* NBA label → /scores */}
        <Link
          to="/scores"
          className="nba-link"
          style={S.nbaLink}
        >
          NBA ↗
        </Link>

        {/* Scrolling ticker */}
        <div style={S.tickerArea}>
          {loading ? (
            <span style={S.emptyText}>Loading scores…</span>
          ) : !hasGames ? (
            <span style={S.emptyText}>No games scheduled today</span>
          ) : (
            /* Duplicate chips for seamless loop; duration set via CSS var */
            <div
              className="ticker-track"
              style={{ '--scroll-dur': scrollDuration }}
            >
              {allGames.map(g => <GameChip key={g.id} game={g} />)}
              {allGames.map(g => <GameChip key={`dup-${g.id}`} game={g} />)}
            </div>
          )}
        </div>

        {/* Last updated */}
        {scores?.lastUpdated && (
          <div style={S.lastUpdated}>↻ {formatLastUpdated(scores.lastUpdated)}</div>
        )}
      </div>
    </>
  );
};

export default LiveScores;
