import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../store/authSlice';

const Login = () => {
    const [data, setData] = useState({
        email: '',
        password: ''
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error, isLoading, user, token } = useSelector((state) => state.auth);

    // Simple redirect after successful login
    useEffect(() => {
        if (token && user) {
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (user.role === 'driver') {
                navigate('/driver/dashboard');
            }
        }
    }, [token, user, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ ...data }));
    };

    const handleInputData = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        console.log(data);
    };
    

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                padding: '40px',
                width: '100%',
                maxWidth: '400px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h2 style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        marginBottom: '8px'
                    }}>Welcome Back</h2>
                    <p style={{ color: '#6b7280' }}>Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        name='email' 
                        value={data.email} 
                        onChange={handleInputData} 
                        required 
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                            transition: 'border-color 0.2s',
                            boxSizing: 'border-box'
                        }}
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        name='password' 
                        value={data.password} 
                        onChange={handleInputData} 
                        required 
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                            transition: 'border-color 0.2s',
                            boxSizing: 'border-box'
                        }}
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.2s',
                            marginTop: '8px'
                        }}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                
                {error && (
                    <div style={{
                        marginTop: '16px',
                        padding: '12px',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '8px',
                        color: '#dc2626',
                        fontSize: '14px'
                    }}>
                        {error}
                    </div>
                )}
                
                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>
                        Don't have an account?{' '}
                        <span 
                            onClick={() => navigate('/register')}
                            style={{
                                color: '#3b82f6',
                                cursor: 'pointer',
                                fontWeight: '600',
                                textDecoration: 'underline'
                            }}
                        >
                            Create account
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;