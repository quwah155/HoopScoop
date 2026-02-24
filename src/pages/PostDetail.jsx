import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Comments from '../context/components/Comments';

const PostDetail = () => {
    const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/posts/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.status === 401 || res.status === 403) {
                    navigate('/login');
                    return null;
                }
                return res.json();
            })
            .then(data => data && setPost(data))
            .catch(err => console.error('Error fetching post:', err));
    }, [id, token, navigate]);

    const handleLike = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${id}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.status === 401 || res.status === 403) {
                toast.error('Please login to like posts');
                navigate('/login');
                return;
            }
            const data = await res.json();
            setPost(prev => ({ ...prev, likes: data.likes }));
            toast.success(data.liked ? 'Post liked! ♥' : 'Like removed');
        } catch (err) {
            console.error('Error liking post:', err);
            toast.error('Failed to like post. Please try again.');
        }
    };

    const handleCommentAdded = (newComment) => {
        setPost(prev => ({
            ...prev,
            comments: prev.comments ? [...prev.comments, newComment] : [newComment]
        }));
    };

    if (!post) {
        return <div className="container" style={{ paddingTop: '150px', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '100px', maxWidth: '900px' }}>
            <Link to="/" className="btn-secondary" style={{
                padding: '8px 16px',
                borderRadius: '50px',
                fontSize: '0.9rem',
                marginBottom: '30px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none'
            }}>
                &larr; Back to Home
            </Link>

            <div className="glass" style={{
                padding: 'clamp(16px, 5vw, 40px)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--glass-border)',
                background: 'rgba(20, 20, 22, 0.4)'
            }}>
                <span style={{
                    color: 'var(--primary)',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    fontSize: '0.9rem',
                    letterSpacing: '1px'
                }}>
                    {post.category || 'News'}
                </span>
                <h1 style={{
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    marginTop: '15px',
                    lineHeight: '1.1',
                    fontWeight: '800'
                }}>
                    {post.title}
                </h1>

                <div style={{
                    margin: '30px 0',
                    padding: '20px 0',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#333' }}></div>
                        <div>
                            <div style={{ fontWeight: '600' }}>{post.author?.email || 'HoopScoop Admin'}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Just now'}
                            </div>
                        </div>
                    </div>

                    <button onClick={handleLike} className="btn-secondary" style={{
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        padding: '8px 16px',
                        borderRadius: '20px'
                    }}>
                        <span style={{ color: 'var(--secondary)' }}>♥</span> {post.likes || 0} Likes
                    </button>
                </div>

                <img
                    src={post.image}
                    alt={post.title}
                    style={{
                        width: '100%',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '40px',
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)'
                    }}
                />

                <div style={{
                    lineHeight: '1.8',
                    fontSize: '1.15rem',
                    whiteSpace: 'pre-wrap',
                    color: '#e0e0e0',
                    fontFamily: 'serif'
                }}>
                    {post.content}
                </div>
            </div>

            <div style={{ marginTop: '60px' }}>
                <Comments postId={post.id} comments={post.comments} onCommentAdded={handleCommentAdded} />
            </div>
        </div>
    );
};

export default PostDetail;
