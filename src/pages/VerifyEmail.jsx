import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (otp.length !== 6) {
            setError('OTP must be 6 digits');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/verify-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });

            const data = await res.json();

            if (res.ok) {
                if (!data.token) {
                    toast.error('Verification failed: no token received');
                    setLoading(false);
                    return;
                }
                // Auto-login with the returned token
                login(data.token);
                toast.success('Email verified successfully! Welcome to HoopScoop!');
                navigate('/home');
            } else {
                const errorMsg = data.message || 'Verification failed';
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (err) {
            const errorMsg = 'Something went wrong. Please try again.';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!email) {
            toast.error('Email not found. Please sign up again.');
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/resend-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('New OTP sent to your email!');
                setOtp(''); // Clear current OTP input
                setError('');
            } else {
                toast.error(data.message || 'Failed to resend OTP');
            }
        } catch (err) {
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
        fontSize: '1.5rem',
        textAlign: 'center',
        letterSpacing: '0.5rem',
        fontFamily: 'inherit',
        transition: '0.3s',
        fontWeight: '600'
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
                    marginBottom: '20px',
                    textAlign: 'center',
                    fontWeight: '800'
                }}>
                    Verify Your <span className="text-gradient">Email</span>
                </h2>

                <p style={{
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    marginBottom: '30px',
                    fontSize: '0.95rem'
                }}>
                    We sent a 6-digit code to<br />
                    <strong style={{ color: 'var(--primary)' }}>{email}</strong>
                </p>

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
                        <label style={{
                            display: 'block',
                            marginBottom: '10px',
                            color: 'var(--text-muted)',
                            textAlign: 'center'
                        }}>
                            Enter OTP
                        </label>
                        <input
                            type="text"
                            name="otp"
                            required
                            maxLength="6"
                            pattern="[0-9]{6}"
                            style={inputStyle}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            placeholder="000000"
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '20px', padding: '16px' }}
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Verify Email'}
                    </button>

                    <p style={{
                        marginTop: '20px',
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '0.9rem'
                    }}>
                        Didn't receive the code?{' '}
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--primary)',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                fontSize: '0.9rem'
                            }}
                        >
                            Resend OTP
                        </button>
                    </p>

                    <p style={{
                        marginTop: '10px',
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '0.9rem'
                    }}>
                        Wrong email? <Link to="/signup" style={{ color: 'var(--primary)' }}>Sign up again</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default VerifyEmail;
