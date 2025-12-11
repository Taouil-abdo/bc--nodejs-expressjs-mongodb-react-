import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/authSlice';



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
        dispatch(registerUser(data));
    };

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    return (
        <>

        <div>
            <div className='header'>

            </div>
            <div className='register'>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder='Full Name' name="fullname" value={data.fullname} onChange={handleChange} required />
                    <input type="email" placeholder='Email' name="email" value={data.email} onChange={handleChange} required />
                    <input type="password" placeholder='Password' name="password" value={data.password} onChange={handleChange} required />
                    <input type="number" placeholder='Age' name="age" value={data.age} onChange={handleChange} required />
                    <input type="text" placeholder='Phone Number' name="phoneNumber" value={data.phoneNumber} onChange={handleChange} />
                    <button type='submit' disabled={isLoading}>{isLoading ? 'Registering...' : 'Register'}</button>
                </form>
                {error && <p style={{color: 'red'}}>{error}</p>}

            </div>
            <div>
                <p>Already have an account? <span onClick={() => navigate('/login')}>Login</span></p>
            </div>
        </div>
        
        </>
    )

}

export default Register;