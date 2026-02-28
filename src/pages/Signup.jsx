import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Signup = () => {
    const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await res.json();

            if (res.ok) {
                // Registration successful - now verify email
                toast.success('Account created! Please check your email for the verification code.');
                // Navigate to verify-email page with email in state
                navigate('/verify-email', { state: { email: formData.email } });
            } else {
                const errorMsg = data.message || 'Registration failed';
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (err) {
            const errorMsg = 'Something went wrong. Please try again.';
            setError(errorMsg);
            toast.error(errorMsg);
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

    return (
        <div className="container" style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '80px'
        }}>
            <div className="glass" style={{
                padding: 'clamp(20px, 7vw, 50px)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--glass-border)',
                width: '100%',
                maxWidth: '450px'
            }}>
                <h2 style={{
                    fontSize: 'clamp(1.4rem, 6vw, 2rem)',
                    marginBottom: '24px',
                    textAlign: 'center',
                    fontWeight: '800'
                }}>
                    Create <span className="text-gradient">Account</span>
                </h2>

                {error && <div style={{
                    background: 'rgba(255, 50, 50, 0.1)',
                    color: '#ff5e5e',
                    padding: '10px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    textAlign: 'center',
                    fontSize: '0.9rem'
                }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)' }}>Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            style={inputStyle}
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email address"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)' }}>Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            style={inputStyle}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password (min 6 chars)"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)' }}>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            required
                            style={inputStyle}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px', padding: '16px' }}>
                        Sign Up
                    </button>

                    <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
