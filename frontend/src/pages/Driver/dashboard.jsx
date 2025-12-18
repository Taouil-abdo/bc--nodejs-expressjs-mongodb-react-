import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import DashboardLayout from '../../components/DashboardLayout';

const DriverDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalTrips: 0,
        activeTrips: 0,
        completedTrips: 0,
        totalKm: 0
    });
    const [recentTrips, setRecentTrips] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/driver/my-trips');
            const trips = response.data;
            
            setStats({
                totalTrips: trips.length,
                activeTrips: trips.filter(t => t.status === 'in_progress').length,
                completedTrips: trips.filter(t => t.status === 'completed').length,
                totalKm: trips.reduce((sum, t) => sum + (t.distance || 0), 0)
            });
            
            setRecentTrips(trips.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const StatCard = ({ title, value, icon, color }) => (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>{title}</p>
                    <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{value}</p>
                </div>
                <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: color,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                }}>
                    {icon}
                </div>
            </div>
        </div>
    );

    return (
        <DashboardLayout userRole="driver">
            <div style={{ padding: '24px' }}>
                {/* Welcome Section */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                        Welcome back, {user?.fullname}! 👋
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '16px' }}>
                        Here's what's happening with your trips today.
                    </p>
                </div>

                {/* Stats Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                    marginBottom: '32px'
                }}>
                    <StatCard
                        title="Total Trips"
                        value={stats.totalTrips}
                        icon="📋"
                        color="#dbeafe"
                    />
                    <StatCard
                        title="Active Trips"
                        value={stats.activeTrips}
                        icon="🚛"
                        color="#dcfce7"
                    />
                    <StatCard
                        title="Completed Trips"
                        value={stats.completedTrips}
                        icon="✅"
                        color="#fef3c7"
                    />
                    <StatCard
                        title="Total Distance"
                        value={`${stats.totalKm.toLocaleString()} km`}
                        icon="📏"
                        color="#f3e8ff"
                    />
                </div>

                {/* Quick Actions */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    marginBottom: '32px'
                }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
                        Quick Actions
                    </h2>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => navigate('/driver/trips')}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            🚛 View My Trips
                        </button>
                        <button
                            onClick={() => navigate('/driver/profile')}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            👤 Update Profile
                        </button>
                    </div>
                </div>

                {/* Recent Trips */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
                            Recent Trips
                        </h2>
                        <button
                            onClick={() => navigate('/driver/trips')}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: 'transparent',
                                color: '#3b82f6',
                                border: '1px solid #3b82f6',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            View All
                        </button>
                    </div>

                    {recentTrips.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                            <p>No trips assigned yet</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {recentTrips.map(trip => (
                                <div
                                    key={trip._id}
                                    onClick={() => navigate(`/driver/trips/${trip._id}`)}
                                    style={{
                                        padding: '16px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = '#f9fafb';
                                        e.currentTarget.style.borderColor = '#3b82f6';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = 'white';
                                        e.currentTarget.style.borderColor = '#e5e7eb';
                                    }}
                                >
                                    <div>
                                        <p style={{ fontWeight: '500', color: '#1f2937', marginBottom: '4px' }}>
                                            {trip.startLocation} → {trip.endLocation}
                                        </p>
                                        <p style={{ fontSize: '14px', color: '#6b7280' }}>
                                            {new Date(trip.startDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: 'white',
                                        backgroundColor: trip.status === 'pending' ? '#f59e0b' : 
                                                       trip.status === 'in_progress' ? '#3b82f6' : '#10b981'
                                    }}>
                                        {trip.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DriverDashboard;