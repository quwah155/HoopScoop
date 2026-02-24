import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '60px 20px'
        }}>
            <h1 style={{
                fontSize: 'clamp(2rem, 8vw, 4rem)',
                fontWeight: '900',
                lineHeight: '1.1',
                marginBottom: '20px',
                maxWidth: '800px',
                wordBreak: 'break-word'
            }}>
                THE ULTIMATE <br />
                <span className="text-gradient">BASKETBALL INSIDER</span>
            </h1>

            <p style={{
                fontSize: 'clamp(0.95rem, 3vw, 1.2rem)',
                color: 'var(--text-muted)',
                marginBottom: '40px',
                maxWidth: '600px',
                padding: '0 8px'
            }}>
                Join thousands of hoop heads getting deep analysis, highlight breakdowns, and exclusive stories.
                <span style={{ color: '#fff' }}> Sign up to access premium content.</span>
            </p>

            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                justifyContent: 'center'
            }}>
                <Link to="/signup" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
                    Join the Squad
                </Link>
                <Link to="/login" style={{
                    padding: '14px 32px',
                    fontSize: '1rem',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '50px',
                    color: '#fff',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    Login
                </Link>
            </div>

            {/* Ambient Background Elements */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '10%',
                width: 'clamp(150px, 30vw, 300px)',
                height: 'clamp(150px, 30vw, 300px)',
                background: 'radial-gradient(circle, rgba(196, 244, 52, 0.1) 0%, rgba(0,0,0,0) 70%)',
                zIndex: -1,
                pointerEvents: 'none'
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '20%',
                right: '10%',
                width: 'clamp(200px, 35vw, 400px)',
                height: 'clamp(200px, 35vw, 400px)',
                background: 'radial-gradient(circle, rgba(181, 56, 255, 0.1) 0%, rgba(0,0,0,0) 70%)',
                zIndex: -1,
                pointerEvents: 'none'
            }}></div>
        </div>
    );
};

export default Landing;
