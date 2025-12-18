import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const DashboardLayout = ({ children, userRole = 'driver' }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const driverMenuItems = [
        { name: 'Dashboard', path: '/driver/dashboard', icon: '📊' },
        { name: 'My Trips', path: '/driver/trips', icon: '🚛' },
    ];

    const adminMenuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
        { name: 'Trucks', path: '/admin/trucks', icon: '🚛' },
        { name: 'Trailer', path: '/admin/trailers', icon: '🚛' },
        { name: 'Drivers', path: '/admin/users', icon: '👥' },
        { name: 'Trips', path: '/admin/trips', icon: '📋' },
        { name: 'Reports', path: '/admin/reports', icon: '📈' },
        { name: 'Tires', path: '/admin/tires', icon: '🛞' },


    ];

    const menuItems = userRole === 'admin' ? adminMenuItems : driverMenuItems;

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
            {/* Sidebar */}
            <div style={{
                width: sidebarOpen ? '250px' : '70px',
                backgroundColor: '#1f2937',
                transition: 'width 0.3s ease',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Logo */}
                <div style={{
                    padding: '20px',
                    borderBottom: '1px solid #374151',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#3b82f6',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px'
                    }}>
                        🚛
                    </div>
                    {sidebarOpen && (
                        <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
                            FleetManager
                        </span>
                    )}
                </div>

                {/* Menu Items */}
                <nav style={{ flex: 1, padding: '20px 0' }}>
                    {menuItems.map((item) => (
                        <div
                            key={item.name}
                            onClick={() => navigate(item.path)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 20px',
                                color: '#d1d5db',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                borderLeft: window.location.pathname === item.path ? '3px solid #3b82f6' : '3px solid transparent'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#374151';
                                e.target.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#d1d5db';
                            }}
                        >
                            <span style={{ fontSize: '18px' }}>{item.icon}</span>
                            {sidebarOpen && <span>{item.name}</span>}
                        </div>
                    ))}
                </nav>

                {/* User Info */}
                <div style={{
                    padding: '20px',
                    borderTop: '1px solid #374151',
                    color: 'white'
                }}>
                    {sidebarOpen ? (
                        <div>
                            <p style={{ fontSize: '14px', marginBottom: '4px' }}>{user?.fullname}</p>
                            <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '12px' }}>
                                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                            </p>
                            <button
                                onClick={handleLogout}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    backgroundColor: '#dc2626',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleLogout}
                            style={{
                                width: '100%',
                                padding: '8px',
                                backgroundColor: '#dc2626',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '18px'
                            }}
                        >
                            🚪
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <header style={{
                    backgroundColor: 'white',
                    padding: '16px 24px',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{
                            padding: '8px',
                            backgroundColor: 'transparent',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        ☰
                    </button>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#3b82f6',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}>
                            {user?.fullname?.charAt(0) || 'U'}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main style={{ flex: 1, overflow: 'auto' }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;