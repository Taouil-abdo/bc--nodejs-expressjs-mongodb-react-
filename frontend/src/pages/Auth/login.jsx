import { useState } from 'react';
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
    const { error, isLoading } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(data));
    };

    const handleInputData = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };


    return(

        <div>
            <div>
                <div className='headerLogin'>
                    <h2>Login</h2>
                </div>
                <div className=''>
                    <form onSubmit={handleSubmit}>
                        <input type="email" placeholder="Email" name='email' value={data.email} onChange={handleInputData} required />
                        <input type="password" placeholder="Password" name='password' value={data.password} onChange={handleInputData} required />
                        <button type="submit" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
                    </form>
                    {error && <p style={{color:'red'}} >{error}</p>}
                </div>
                <div>
                    <span>{error}</span>
                </div>
                <div className='footer'>
                    <p>Don't have an account? <span onClick={() => navigate('/register')} style={{cursor: 'pointer', color: 'blue'}}>Register</span></p>
                </div>
            </div>
        </div>
    )

} 

export default Login;
