const SkeletonCard = () => {
    return (
        <div className="glass" style={{
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--glass-border)',
            height: '100%',
            opacity: 0.7
        }}>
            {/* Image Placeholder */}
            <div className="skeleton-pulse" style={{
                width: '100%',
                height: '250px',
                background: 'rgba(255, 255, 255, 0.05)'
            }}></div>

            <div style={{ padding: '25px' }}>
                {/* Category Placeholder */}
                <div className="skeleton-pulse" style={{
                    width: '80px',
                    height: '20px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    marginBottom: '15px'
                }}></div>

                {/* Title Placeholder */}
                <div className="skeleton-pulse" style={{
                    width: '90%',
                    height: '28px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    marginBottom: '10px'
                }}></div>
                <div className="skeleton-pulse" style={{
                    width: '60%',
                    height: '28px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    marginBottom: '20px'
                }}></div>

                {/* Summary Placeholder */}
                <div className="skeleton-pulse" style={{
                    width: '100%',
                    height: '16px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    marginBottom: '8px'
                }}></div>
                <div className="skeleton-pulse" style={{
                    width: '80%',
                    height: '16px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.05)'
                }}></div>
            </div>

            <style>{`
                @keyframes pulse {
                    0% { opacity: 0.5; }
                    50% { opacity: 0.8; }
                    100% { opacity: 0.5; }
                }
                .skeleton-pulse {
                    animation: pulse 1.5s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default SkeletonCard;
