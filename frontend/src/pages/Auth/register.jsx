import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/authSlice';
import Swal from 'sweetalert2';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.auth);

    const [data, setData] = useState({
        fullname: '',
        email: '',
        password: '',
        age: '',
        phoneNumber: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(registerUser(data));
        
        if (result.type === 'auth/register/fulfilled') {
            Swal.fire({
                title: 'Success!',
                text: 'Account created successfully! Please login.',
                icon: 'success',
                confirmButtonColor: '#3b82f6',
                timer: 2000
            }).then(() => {
                navigate('/login');
            });
        }
    };

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
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
                    }}>Create Account</h2>
                    <p style={{ color: '#6b7280' }}>Join our fleet management system</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input 
                        type="text" 
                        placeholder='Full Name' 
                        name="fullname" 
                        value={data.fullname} 
                        onChange={handleChange} 
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
                        type="email" 
                        placeholder='Email' 
                        name="email" 
                        value={data.email} 
                        onChange={handleChange} 
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
                        placeholder='Password' 
                        name="password" 
                        value={data.password} 
                        onChange={handleChange} 
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
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <input 
                            type="number" 
                            placeholder='Age' 
                            name="age" 
                            value={data.age} 
                            onChange={handleChange} 
                            required 
                            style={{
                                flex: '1',
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
                            type="text" 
                            placeholder='Phone' 
                            name="phoneNumber" 
                            value={data.phoneNumber} 
                            onChange={handleChange} 
                            style={{
                                flex: '1',
                                padding: '12px 16px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
        
                    <button 
                        type='submit' 
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
                        {isLoading ? 'Creating Account...' : 'Create Account'}
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
                        Already have an account?{' '}
                        <span 
                            onClick={() => navigate('/login')}
                            style={{
                                color: '#3b82f6',
                                cursor: 'pointer',
                                fontWeight: '600',
                                textDecoration: 'underline'
                            }}
                        >
                            Sign in
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;