import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LiveScores from './LiveScores';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <nav className="glass" style={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                padding: '16px 0',
                transition: 'background 0.3s'
            }}>
                <div className="container" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {/* Logo */}
                    <Link to="/" style={{
                        fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
                        fontWeight: 800,
                        letterSpacing: '-1px',
                        flexShrink: 0
                    }}>
                        HOOP<span className="text-gradient">SCOOP</span>
                    </Link>

                    {/* Desktop nav links */}
                    <div className="nav-menu">
                        <Link to={user ? "/home" : "/"} style={{ fontWeight: 600, fontSize: '1rem', opacity: 0.8 }}>
                            Home
                        </Link>

                        {user ? (
                            <>
                                <Link to="/create" style={{ fontWeight: 600, fontSize: '1rem', opacity: 0.8 }}>
                                    Create Post
                                </Link>
                                <Link to="/my-posts" style={{ fontWeight: 600, fontSize: '1rem', opacity: 0.8 }}>
                                    My Posts
                                </Link>
                                {user.role === 'ADMIN' && (
                                    <Link to="/admin/dashboard" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                                        Admin Dashboard
                                    </Link>
                                )}
                                <button onClick={handleLogout} style={{
                                    background: 'transparent',
                                    border: '1px solid var(--glass-border)',
                                    color: '#aaa',
                                    padding: '8px 20px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontFamily: 'inherit'
                                }}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="btn btn-primary" style={{ padding: '8px 24px', fontSize: '0.9rem' }}>
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Hamburger (mobile only) */}
                    <button
                        className="hamburger"
                        aria-label="Toggle menu"
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen(o => !o)}
                    >
                        <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
                        <span style={{ opacity: menuOpen ? 0 : 1 }} />
                        <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
                    </button>
                </div>
            </nav>

            {/* Live scores ticker strip */}
            <LiveScores />

            {/* Mobile overlay backdrop */}
            {menuOpen && (
                <div
                    className="mobile-overlay"
                    onClick={() => setMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Mobile slide-in drawer */}
            <div className={`mobile-menu${menuOpen ? ' open' : ''}`} role="dialog" aria-label="Navigation menu">
                <Link to={user ? "/home" : "/"}>Home</Link>

                {user ? (
                    <>
                        <Link to="/create">Create Post</Link>
                        <Link to="/my-posts">My Posts</Link>
                        {user.role === 'ADMIN' && (
                            <Link to="/admin/dashboard" style={{ color: 'var(--primary)' }}>
                                Admin Dashboard
                            </Link>
                        )}
                        <button onClick={handleLogout} style={{ color: '#ff6b6b' }}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup" style={{ color: 'var(--primary)' }}>Sign Up</Link>
                    </>
                )}
            </div>
        </>
    );
};

export default Navbar;
