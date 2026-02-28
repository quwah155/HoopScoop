import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import StatusBadge from '../context/components/StatusBadge';

const MyPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyPosts = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/user/my-posts`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    setPosts(data);
                } else {
                    toast.error(data.message || 'Failed to fetch posts');
                }
            } catch (err) {
                console.error('Error fetching posts:', err);
                toast.error('Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchMyPosts();
    }, [token]);

    const handleEdit = (id) => navigate(`/edit/${id}`);

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '150px', textAlign: 'center' }}>
                Loading your posts...
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '50px', paddingBottom: '100px' }}>
            <h1 style={{ fontSize: 'clamp(1.6rem, 6vw, 2.5rem)', marginBottom: '32px' }}>
                My <span className="text-gradient">Posts</span>
            </h1>

            {posts.length === 0 ? (
                <div className="glass" style={{
                    padding: 'clamp(24px, 8vw, 60px) clamp(16px, 6vw, 40px)',
                    textAlign: 'center',
                    borderRadius: 'var(--radius-lg)'
                }}>
                    <h3 style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: 'clamp(0.95rem, 4vw, 1.2rem)' }}>
                        You haven't created any posts yet
                    </h3>
                    <button
                        onClick={() => navigate('/create')}
                        className="btn btn-primary"
                        style={{ marginTop: '16px' }}
                    >
                        Create Your First Post
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {posts.map(post => (
                        <div key={post.id} className="glass" style={{
                            padding: 'clamp(14px, 4vw, 28px)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--glass-border)',
                        }}>
                            {/* Post image — full width, fluid height */}
                            {post.image && (
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    style={{
                                        width: '100%',
                                        height: 'clamp(130px, 28vw, 180px)',
                                        objectFit: 'cover',
                                        borderRadius: 'var(--radius-md)',
                                        marginBottom: '14px',
                                        display: 'block'
                                    }}
                                />
                            )}

                            {/* Status + date row */}
                            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                                <StatusBadge status={post.status} />
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    {new Date(post.updatedAt).toLocaleDateString()}
                                </span>
                            </div>

                            {/* Title */}
                            <h3 style={{
                                fontSize: 'clamp(1rem, 4vw, 1.4rem)',
                                marginBottom: '8px',
                                wordBreak: 'break-word',
                                lineHeight: '1.3'
                            }}>
                                {post.title}
                            </h3>

                            {/* Summary */}
                            <p style={{
                                color: 'var(--text-muted)',
                                marginBottom: '16px',
                                lineHeight: '1.6',
                                fontSize: 'clamp(0.85rem, 3vw, 0.95rem)',
                                wordBreak: 'break-word'
                            }}>
                                {post.summary}
                            </p>

                            {/* Action buttons — wrap naturally */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                <button
                                    onClick={() => handleEdit(post.id)}
                                    className="btn-secondary"
                                    style={{ padding: '8px 18px', fontSize: '0.875rem', borderRadius: '8px' }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => navigate(`/post/${post.id}`)}
                                    className="btn-secondary"
                                    style={{ padding: '8px 18px', fontSize: '0.875rem', borderRadius: '8px' }}
                                >
                                    View
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPosts;
