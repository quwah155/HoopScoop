const Hero = () => {
    return (
        <div style={{
            padding: 'clamp(60px, 12vw, 120px) 20px clamp(40px, 8vw, 80px)',
            textAlign: 'center',
            maxWidth: '1000px',
            margin: '0 auto'
        }}>
            <div style={{
                display: 'inline-block',
                padding: '6px 16px',
                background: 'rgba(255, 71, 71, 0.1)',
                color: 'var(--primary)',
                borderRadius: '30px',
                fontSize: 'clamp(0.75rem, 2.5vw, 0.9rem)',
                fontWeight: '600',
                marginBottom: '20px',
                border: '1px solid rgba(255, 71, 71, 0.3)'
            }}>
                🏀 The #1 Basketball Community
            </div>
            <h1 style={{
                fontSize: 'clamp(2rem, 7vw, 5rem)',
                lineHeight: '1.05',
                marginBottom: '24px',
                fontWeight: '800'
            }}>
                Where the Game <br />
                <span className="text-gradient">Never Stops.</span>
            </h1>
            <p style={{
                fontSize: 'clamp(0.95rem, 3vw, 1.2rem)',
                color: 'var(--text-muted)',
                marginBottom: '40px',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto',
                padding: '0 8px'
            }}>
                Dive into deep analysis, breaking news, and the culture of basketball.
                From the hardwood to the blacktop.
            </p>
            <a href="#latest" className="btn btn-primary btn-glow">
                Read Latest Stories
            </a>
        </div>
    );
};

export default Hero;
