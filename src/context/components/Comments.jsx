import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Comments = ({ postId, comments = [], onCommentAdded }) => {
    const { token } = useAuth();
    const [text, setText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text })
            });
            const newComment = await res.json();
            if (res.ok) {
                onCommentAdded(newComment);
                setText('');
                toast.success('Comment added successfully!');
            } else {
                toast.error(newComment.message || 'Failed to add comment');
            }
        } catch (err) {
            console.error('Error adding comment:', err);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="glass-card" style={{ padding: '30px', marginTop: '40px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Comments ({comments.length})</h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Join the discussion..."
                    rows="3"
                    style={{
                        width: '100%',
                        padding: '15px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        marginBottom: '10px'
                    }}
                />
                <button type="submit" className="btn" disabled={submitting}>
                    {submitting ? 'Posting...' : 'Post Comment'}
                </button>
            </form>

            {/* Comment List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {comments.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No comments yet. Be the first!</p>}
                {comments.slice().reverse().map(comment => (
                    <div key={comment.id} style={{
                        borderBottom: '1px solid var(--glass-border)',
                        paddingBottom: '15px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <span style={{ fontWeight: '600', color: 'var(--accent)' }}>{comment.author?.email || 'Anonymous'}</span>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{comment.date}</span>
                        </div>
                        <p style={{ lineHeight: '1.5' }}>{comment.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Comments;
