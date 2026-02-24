import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        image: '',
        summary: '',
        content: ''
    });

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (res.ok) {
                    // Check if user owns the post
                    if (data.authorId !== user.id && user.role !== 'ADMIN') {
                        toast.error('You can only edit your own posts');
                        navigate('/my-posts');
                        return;
                    }
                    setFormData({
                        title: data.title,
                        category: data.category,
                        image: data.image,
                        summary: data.summary,
                        content: data.content
                    });
                } else {
                    toast.error(data.message || 'Failed to fetch post');
                    navigate('/my-posts');
                }
            } catch (err) {
                console.error('Error fetching post:', err);
                toast.error('Something went wrong');
                navigate('/my-posts');
            } finally {
                setLoading(false);
            }
        };

        if (token && id) fetchPost();
    }, [token, id, navigate, user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                const message = user.role === 'ADMIN'
                    ? 'Post updated successfully!'
                    : 'Post updated and submitted for approval!';
                toast.success(message);
                navigate('/my-posts');
            } else {
                toast.error(data.message || 'Failed to update post');
            }
        } catch (err) {
            console.error('Error updating post:', err);
            toast.error('Something went wrong. Please try again.');
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '16px',
        background: 'rgba(0,0,0,0.2)',
        border: '1px solid var(--glass-border)',
        borderRadius: '12px',
        color: '#fff',
        fontSize: '1rem',
        marginBottom: '20px',
        fontFamily: 'inherit',
        transition: '0.3s'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '10px',
        color: 'var(--text-muted)',
        fontSize: '0.9rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    };

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '150px', textAlign: 'center' }}>
                Loading post...
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '50px', paddingBottom: '100px', maxWidth: '800px' }}>
            <div className="glass" style={{
                padding: '50px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--glass-border)'
            }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '40px', textAlign: 'center', fontWeight: '800' }}>
                    Edit <span className="text-gradient">Post</span>
                </h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label style={labelStyle}>Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            style={inputStyle}
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter an engaging title..."
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: '20px' }}>
                        <div>
                            <label style={labelStyle}>Category</label>
                            <input type="text" name="category" placeholder="e.g. Analysis" required style={inputStyle} value={formData.category} onChange={handleChange} />
                        </div>
                        <div>
                            <label style={labelStyle}>Image URL</label>
                            <input type="text" name="image" placeholder="https://..." style={inputStyle} value={formData.image} onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Summary</label>
                        <input type="text" name="summary" required style={inputStyle} value={formData.summary} onChange={handleChange} placeholder="Short description for the card preview..." />
                    </div>

                    <div>
                        <label style={labelStyle}>Content</label>
                        <textarea
                            name="content"
                            rows="10"
                            required
                            style={{ ...inputStyle, resize: 'vertical', minHeight: '200px' }}
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Write your story here..."
                        ></textarea>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '16px' }}>
                            Update Post
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/my-posts')}
                            className="btn-secondary"
                            style={{ flex: 1, padding: '16px' }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPost;
