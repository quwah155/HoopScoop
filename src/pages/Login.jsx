import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {   
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                if (!data.token) {
                    toast.error('Login failed: no token received');
                    return;
                }
                login(data.token);
                toast.success(`Welcome back!`);
                navigate('/home');
            } else {
                const errorMsg = data.message || 'Login failed';
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
                padding: '50px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--glass-border)',
                width: '100%',
                maxWidth: '450px'
            }}>
                <h2 style={{
                    fontSize: '2rem',
                    marginBottom: '30px',
                    textAlign: 'center',
                    fontWeight: '800'
                }}>
                    Welcome <span className="text-gradient">Back</span>
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
                            placeholder="Enter your password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px', padding: '16px' }}>
                        Login
                    </button>

                    <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)' }}>Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
