import { Link } from 'react-router-dom';

const BlogCard = ({ post }) => {
    return (
        <Link to={`/post/${post.id}`} style={{ textDecoration: 'none' }}>
            <div className="card-hover" style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div style={{ height: '220px', overflow: 'hidden' }}>
                    <img
                        src={post.image || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80'}
                        alt={post.title}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s'
                        }}
                    />
                </div>
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{
                        color: 'var(--primary)',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        marginBottom: '10px',
                        display: 'block'
                    }}>
                        {post.category || 'News'}
                    </span>
                    <h3 style={{
                        fontSize: '1.4rem',
                        marginBottom: '10px',
                        lineHeight: '1.3',
                        color: 'var(--text-main)'
                    }}>
                        {post.title}
                    </h3>
                    <p style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.95rem',
                        marginBottom: '20px',
                        display: '-webkit-box',
                        WebkitLineClamp: '2',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {post.excerpt || post.summary}
                    </p>
                    <div style={{
                        marginTop: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#333' }}></div>
                        <span style={{ fontSize: '0.95rem', opacity: 0.7 }}>{post.author?.email || 'Anonymous'}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default BlogCard;
