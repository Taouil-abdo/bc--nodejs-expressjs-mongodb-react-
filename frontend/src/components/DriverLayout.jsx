import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const DriverLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const menuItems = [
        { path: '/driver/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/driver/trips', label: 'My Trips', icon: '🚛' },
        { path: '/driver/profile', label: 'Profile', icon: '👤' }
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            {/* Sidebar */}
            <div style={{
                width: sidebarOpen ? '250px' : '70px',
                backgroundColor: '#1f2937',
                transition: 'width 0.3s',
                position: 'fixed',
                height: '100vh',
                zIndex: 1000
            }}>
                <div style={{ padding: '20px 15px', borderBottom: '1px solid #374151' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ 
                            width: '40px', 
                            height: '40px', 
                            backgroundColor: '#3b82f6', 
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold'
                        }}>
                            🚛
                        </div>
                        {sidebarOpen && (
                            <div>
                                <h3 style={{ color: 'white', margin: 0, fontSize: '16px' }}>Fleet Manager</h3>
                                <p style={{ color: '#9ca3af', margin: 0, fontSize: '12px' }}>Driver Portal</p>
                            </div>
                        )}
                    </div>
                </div>

                <nav style={{ padding: '20px 0' }}>
                    {menuItems.map((item) => (
                        <div
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                padding: '12px 20px',
                                cursor: 'pointer',
                                backgroundColor: location.pathname === item.path ? '#374151' : 'transparent',
                                borderRight: location.pathname === item.path ? '3px solid #3b82f6' : 'none',
                                transition: 'all 0.2s'
                            }}
                        >
                            <span style={{ fontSize: '20px' }}>{item.icon}</span>
                            {sidebarOpen && (
                                <span style={{ color: 'white', fontSize: '14px' }}>{item.label}</span>
                            )}
                        </div>
                    ))}
                </nav>

                <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px' }}>
                    <div
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            padding: '12px 0',
                            cursor: 'pointer',
                            color: '#ef4444',
                            fontSize: '14px'
                        }}
                    >
                        <span style={{ fontSize: '20px' }}>🚪</span>
                        {sidebarOpen && <span>Logout</span>}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ 
                marginLeft: sidebarOpen ? '250px' : '70px',
                flex: 1,
                transition: 'margin-left 0.3s'
            }}>
                {/* Header */}
                <header style={{
                    backgroundColor: 'white',
                    padding: '15px 30px',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '20px',
                            cursor: 'pointer',
                            padding: '5px'
                        }}
                    >
                        ☰
                    </button>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ color: '#666', fontSize: '14px' }}>
                            Welcome, {user?.fullname}
                        </span>
                        <div style={{
                            width: '35px',
                            height: '35px',
                            backgroundColor: '#3b82f6',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}>
                            {user?.fullname?.charAt(0)?.toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main style={{ padding: '0' }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DriverLayout;