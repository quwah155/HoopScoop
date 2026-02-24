import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CreatePost = () => {
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        image: '',
        summary: '',
        content: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                // Different message based on user role
                const message = user.role === 'ADMIN'
                    ? 'Post published successfully!'
                    : 'Post submitted for approval!';
                toast.success(message);
                navigate('/my-posts');
            } else {
                toast.error(data.message || 'Failed to create post');
            }
        } catch (err) {
            console.error('Error creating post:', err);
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

    return (
        <div className="container" style={{ paddingTop: '50px', paddingBottom: '100px', maxWidth: '800px' }}>
            <div className="glass" style={{
                padding: '50px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--glass-border)'
            }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '40px', textAlign: 'center', fontWeight: '800' }}>
                    Create New <span className="text-gradient">Post</span>
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

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px', padding: '16px' }}>
                        Publish Post
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
