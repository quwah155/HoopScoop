import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

/* ─── helpers ───────────────────────────────────────────────── */

function toDateStr(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function todayET() {
    const now = new Date();
    const etOffset = -5 * 60;
    const local = now.getTimezoneOffset();
    return new Date(now.getTime() + (local + etOffset) * 60_000);
}

function addDays(dateStr, n) {
    const d = new Date(dateStr + 'T12:00:00'); // noon avoids DST edge
    d.setDate(d.getDate() + n);
    return toDateStr(d);
}

function friendlyDate(dateStr) {
    const today = toDateStr(todayET());
    const yesterday = addDays(today, -1);
    const tomorrow = addDays(today, 1);
    if (dateStr === today) return 'Today';
    if (dateStr === yesterday) return 'Yesterday';
    if (dateStr === tomorrow) return 'Tomorrow';
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatClock(period, clock) {
    if (!period) return '';
    const q = period <= 4 ? `Q${period}` : `OT${period - 4}`;
    return clock ? `${q} · ${clock}` : q;
}

function formatKickoff(datetimeStr) {
    if (!datetimeStr) return 'TBD';
    try {
        return new Date(datetimeStr).toLocaleTimeString('en-US', {
            hour: 'numeric', minute: '2-digit',
            timeZone: 'America/New_York', hour12: true,
        }) + ' ET';
    } catch { return 'TBD'; }
}

/* ─── single game card ──────────────────────────────────────── */

const GameCard = ({ game }) => {
    const isLive = game.status === 'live';
    const isFinal = game.status === 'final';
    const isUpcoming = game.status === 'upcoming';

    const homeWin = isFinal && game.homeScore > game.awayScore;
    const awayWin = isFinal && game.awayScore > game.homeScore;

    return (
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${isLive ? 'rgba(255,71,71,0.3)' : 'rgba(255,255,255,0.07)'}`,
            borderRadius: '16px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
            boxShadow: isLive ? '0 0 24px rgba(255,71,71,0.08)' : 'none',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Live accent strip */}
            {isLive && (
                <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: '3px', background: '#ff4747',
                    boxShadow: '0 0 12px rgba(255,71,71,0.6)',
                }} />
            )}

            {/* Away team */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                <span style={{
                    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                    fontWeight: awayWin ? '800' : '600',
                    color: awayWin ? '#fff' : isFinal ? '#aaa' : '#fff',
                    letterSpacing: '-0.3px',
                }}>
                    {game.awayTeam.abbreviation}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#555', fontWeight: 500 }}>
                    {game.awayTeam.name}
                </span>
            </div>

            {/* Score / status center */}
            <div style={{ textAlign: 'center', minWidth: '110px' }}>
                {isLive && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '6px' }}>
                        <span style={{
                            width: '7px', height: '7px', borderRadius: '50%',
                            background: '#ff4747', display: 'inline-block',
                            boxShadow: '0 0 6px rgba(255,71,71,0.9)',
                            animation: 'liveDot 1.4s ease-in-out infinite',
                        }} />
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#ff4747', letterSpacing: '1px' }}>LIVE</span>
                    </div>
                )}
                {isFinal && (
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#666', letterSpacing: '1px', marginBottom: '6px' }}>
                        FINAL
                    </div>
                )}
                {isUpcoming && (
                    <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '6px' }}>
                        {game.kickoff || 'TBD'}
                    </div>
                )}

                {/* score */}
                {(isLive || isFinal) ? (
                    <div style={{
                        fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
                        fontWeight: '800',
                        color: isLive ? '#f7e998' : '#fff',
                        letterSpacing: '-1px',
                        lineHeight: 1,
                    }}>
                        {game.awayScore} <span style={{ color: '#333', fontWeight: 400 }}>–</span> {game.homeScore}
                    </div>
                ) : (
                    <div style={{ fontSize: '1.4rem', color: '#333', fontWeight: 300 }}>vs</div>
                )}

                {/* quarter/clock */}
                {isLive && game.period && (
                    <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '6px' }}>
                        {formatClock(game.period, game.clock)}
                    </div>
                )}
            </div>

            {/* Home team */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <span style={{
                    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                    fontWeight: homeWin ? '800' : '600',
                    color: homeWin ? '#fff' : isFinal ? '#aaa' : '#fff',
                    letterSpacing: '-0.3px',
                }}>
                    {game.homeTeam.abbreviation}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#555', fontWeight: 500, textAlign: 'right' }}>
                    {game.homeTeam.name}
                </span>
            </div>
        </div>
    );
};

/* ─── section header ────────────────────────────────────────── */
const SectionLabel = ({ label, count, color = '#888' }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', marginTop: '32px' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '1.5px', color }}>{label}</span>
        <span style={{
            fontSize: '0.65rem', fontWeight: 700,
            background: 'rgba(255,255,255,0.06)',
            padding: '2px 8px', borderRadius: '20px', color: '#555',
        }}>{count}</span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
    </div>
);

/* ─── main page ─────────────────────────────────────────────── */

const Scores = () => {
    const today = toDateStr(todayET());
    const [date, setDate] = useState(today);
    const [scores, setScores] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchScores = useCallback(async (d) => {
        setLoading(true);
        setScores(null);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/live-scores?date=${d}`);
            const data = await res.json();
            if (res.ok) setScores(data);
        } catch (err) {
            console.error('Scores fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchScores(date);
    }, [date, fetchScores]);

    const allGames = scores
        ? [...(scores.live || []), ...(scores.final || []), ...(scores.upcoming || [])]
        : [];

    const isToday = date === today;

    return (
        <>
            <style>{`
                @keyframes liveDot {
                    0%, 100% { opacity: 1; box-shadow: 0 0 6px rgba(255,71,71,0.9); }
                    50%       { opacity: 0.4; box-shadow: 0 0 14px rgba(255,71,71,0.4); }
                }
                .game-card-wrap:hover > div {
                    background: rgba(255,255,255,0.05) !important;
                    transform: translateY(-2px);
                }
                .nav-day-btn:hover {
                    background: rgba(255,255,255,0.08) !important;
                    border-color: rgba(255,255,255,0.15) !important;
                }
            `}</style>

            <div className="container" style={{ paddingTop: '40px', paddingBottom: '100px', maxWidth: '760px' }}>

                {/* Page header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '6px' }}>
                        NBA <span className="text-gradient">Scores</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Game results, live scores &amp; upcoming matchups
                    </p>
                </div>

                {/* Date navigator */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '14px',
                    padding: '10px 16px',
                    marginBottom: '32px',
                    gap: '12px',
                }}>
                    {/* Prev */}
                    <button
                        className="nav-day-btn"
                        onClick={() => setDate(d => addDays(d, -1))}
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: '#fff',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            transition: 'all 0.3s ease',
                            display: 'flex', alignItems: 'center', gap: '6px',
                        }}
                    >
                        ← Prev
                    </button>

                    {/* Center — current date */}
                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{
                            fontSize: 'clamp(1rem, 3vw, 1.3rem)',
                            fontWeight: 800,
                            color: isToday ? '#f7e998' : '#fff',
                            letterSpacing: '-0.5px',
                        }}>
                            {friendlyDate(date)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#555', marginTop: '2px' }}>
                            {new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </div>
                    </div>

                    {/* Next */}
                    <button
                        className="nav-day-btn"
                        onClick={() => setDate(d => addDays(d, 1))}
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: '#fff',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            transition: 'all 0.3s ease',
                            display: 'flex', alignItems: 'center', gap: '6px',
                        }}
                    >
                        Next →
                    </button>
                </div>

                {/* Today shortcut (only show when not on today) */}
                {!isToday && (
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <button
                            onClick={() => setDate(today)}
                            style={{
                                background: 'rgba(255,71,71,0.1)',
                                border: '1px solid rgba(255,71,71,0.3)',
                                color: '#ff4747',
                                padding: '6px 20px',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                letterSpacing: '0.5px',
                            }}
                        >
                            ↩ Back to Today
                        </button>
                    </div>
                )}

                {/* Games */}
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} style={{
                                height: '88px',
                                background: 'rgba(255,255,255,0.02)',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                animation: 'pulse 1.5s ease-in-out infinite',
                                animationDelay: `${i * 0.1}s`,
                            }} />
                        ))}
                    </div>
                ) : allGames.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '80px 20px',
                        color: 'var(--text-muted)',
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏀</div>
                        <h3 style={{ marginBottom: '8px' }}>No games on {friendlyDate(date)}</h3>
                        <p style={{ fontSize: '0.9rem' }}>Try a different date</p>
                    </div>
                ) : (
                    <div>
                        {/* LIVE */}
                        {scores?.live?.length > 0 && (
                            <>
                                <SectionLabel label="LIVE NOW" count={scores.live.length} color="#ff4747" />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '8px' }}>
                                    {scores.live.map(g => (
                                        <div key={g.id} className="game-card-wrap">
                                            <GameCard game={g} />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* FINAL */}
                        {scores?.final?.length > 0 && (
                            <>
                                <SectionLabel label="FINAL" count={scores.final.length} color="#888" />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '8px' }}>
                                    {scores.final.map(g => (
                                        <div key={g.id} className="game-card-wrap">
                                            <GameCard game={g} />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* UPCOMING */}
                        {scores?.upcoming?.length > 0 && (
                            <>
                                <SectionLabel label="UPCOMING" count={scores.upcoming.length} color="#f7e998" />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {scores.upcoming.map(g => (
                                        <div key={g.id} className="game-card-wrap">
                                            <GameCard game={g} />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default Scores;
