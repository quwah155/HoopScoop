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
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
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

    const handleEdit = (id) => {
        navigate(`/edit/${id}`);
    };

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '150px', textAlign: 'center' }}>
                Loading your posts...
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '50px', paddingBottom: '100px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>
                My <span className="text-gradient">Posts</span>
            </h1>

            {posts.length === 0 ? (
                <div className="glass" style={{
                    padding: '60px 40px',
                    textAlign: 'center',
                    borderRadius: 'var(--radius-lg)'
                }}>
                    <h3 style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
                        You haven't created any posts yet
                    </h3>
                    <button
                        onClick={() => navigate('/create')}
                        className="btn btn-primary"
                        style={{ marginTop: '20px' }}
                    >
                        Create Your First Post
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {posts.map(post => (
                        <div key={post.id} className="glass" style={{
                            padding: '30px',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--glass-border)',
                            display: 'flex',
                            gap: '20px',
                            alignItems: 'start'
                        }}>
                            {post.image && (
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    style={{
                                        width: '200px',
                                        height: '120px',
                                        objectFit: 'cover',
                                        borderRadius: 'var(--radius-md)'
                                    }}
                                />
                            )}
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                    <StatusBadge status={post.status} />
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        {new Date(post.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{post.title}</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.6' }}>
                                    {post.summary}
                                </p>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => handleEdit(post.id)}
                                        className="btn-secondary"
                                        style={{ padding: '8px 20px', fontSize: '0.9rem' }}
                                    >
                                        Edit Post
                                    </button>
                                    <button
                                        onClick={() => navigate(`/post/${post.id}`)}
                                        className="btn-secondary"
                                        style={{ padding: '8px 20px', fontSize: '0.9rem' }}
                                    >
                                        View
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPosts;
