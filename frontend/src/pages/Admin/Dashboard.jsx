import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import DashboardLayout from '../../components/DashboardLayout';

const AdminDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalTrucks: 0,
        activeTrucks: 0,
        totalDrivers: 0,
        activeTrips: 0,
        completedTrips: 0,
        maintenanceAlerts: 0
    });
    const [recentActivities, setRecentActivities] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch trucks data
            const trucksResponse = await api.get('/trucks');
            const trucks = trucksResponse.data;
            
            // Fetch trips data
            const tripsResponse = await api.get('/trips');
            const trips = tripsResponse.data;

            const driversResponse = await api.get('/admin/users');
            console.log('the driver => ' + driversResponse);
            const drivers = driversResponse.data;
            // Calculate stats
            setStats({
                totalTrucks: trucks.length,
                activeTrucks: trucks.filter(t => t.status === 'available' || t.status === 'in_use').length,
                totalDrivers: drivers.filter(t=>t.role === 'driver').length, 
                activeTrips: trips.filter(t => t.status === 'in_progress').length,
                completedTrips: trips.filter(t => t.status === 'completed').length,
                maintenanceAlerts: trucks.filter(t => t.status === 'maintenance').length
            });
            
            // Mock recent activities
            setRecentActivities([
                { id: 1, type: 'trip', message: 'Trip ABC123 completed by John Doe', time: '2 hours ago' },
                { id: 2, type: 'maintenance', message: 'Truck XYZ789 scheduled for maintenance', time: '4 hours ago' },
                { id: 3, type: 'driver', message: 'New driver Sarah Smith registered', time: '1 day ago' }
            ]);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const StatCard = ({ title, value, icon, color, trend }) => (
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
                    {trend && (
                        <p style={{ fontSize: '12px', color: trend > 0 ? '#10b981' : '#ef4444', marginTop: '4px' }}>
                            {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}% from last month
                        </p>
                    )}
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
        <DashboardLayout userRole="admin">
            <div style={{ padding: '24px' }}>
                {/* Welcome Section */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                        Admin Dashboard 📊
                    </h1>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                       Welcome Mr<span>{user.fullname}</span>
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '16px' }}>
                        Monitor and manage your fleet operations from here.
                    </p>
                </div>

                {/* Stats Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px',
                    marginBottom: '32px'
                }}>
                    <StatCard
                        title="Total Trucks"
                        value={stats.totalTrucks}
                        icon="🚛"
                        color="#dbeafe"
                        trend={12}
                    />
                    <StatCard
                        title="Active Trucks"
                        value={stats.activeTrucks}
                        icon="✅"
                        color="#dcfce7"
                        trend={8}
                    />
                    <StatCard
                        title="Total Drivers"
                        value={stats.totalDrivers}
                        icon="👥"
                        color="#fef3c7"
                        trend={5}
                    />
                    <StatCard
                        title="Active Trips"
                        value={stats.activeTrips}
                        icon="📋"
                        color="#f3e8ff"
                        trend={-3}
                    />
                    <StatCard
                        title="Completed Trips"
                        value={stats.completedTrips}
                        icon="🏁"
                        color="#ecfdf5"
                        trend={15}
                    />
                    <StatCard
                        title="Maintenance Alerts"
                        value={stats.maintenanceAlerts}
                        icon="⚠️"
                        color="#fef2f2"
                        trend={-20}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                    {/* Quick Actions */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '24px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
                            Quick Actions
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                            <button
                                onClick={() => navigate('/admin/trucks')}
                                style={{
                                    padding: '16px',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    justifyContent: 'center'
                                }}
                            >
                                🚛 Manage Trucks
                            </button>
                            <button
                                onClick={() => navigate('/admin/drivers')}
                                style={{
                                    padding: '16px',
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    justifyContent: 'center'
                                }}
                            >
                                👥 Manage Drivers
                            </button>
                            <button
                                onClick={() => navigate('/admin/trips')}
                                style={{
                                    padding: '16px',
                                    backgroundColor: '#f59e0b',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    justifyContent: 'center'
                                }}
                            >
                                📋 Manage Trips
                            </button>
                            <button
                                onClick={() => navigate('/admin/reports')}
                                style={{
                                    padding: '16px',
                                    backgroundColor: '#8b5cf6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    justifyContent: 'center'
                                }}
                            >
                                📈 View Reports
                            </button>
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '24px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
                            Recent Activities
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {recentActivities.map(activity => (
                                <div key={activity.id} style={{
                                    padding: '12px',
                                    backgroundColor: '#f9fafb',
                                    borderRadius: '8px',
                                    borderLeft: '4px solid #3b82f6'
                                }}>
                                    <p style={{ fontSize: '14px', color: '#1f2937', marginBottom: '4px' }}>
                                        {activity.message}
                                    </p>
                                    <p style={{ fontSize: '12px', color: '#6b7280' }}>
                                        {activity.time}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Fleet Status Overview */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    marginTop: '24px'
                }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
                        Fleet Status Overview
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                        <div style={{ textAlign: 'center', padding: '16px' }}>
                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🟢</div>
                            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>Available</p>
                            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                                {stats.activeTrucks}
                            </p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '16px' }}>
                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔵</div>
                            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#3b82f6' }}>In Use</p>
                            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                                {stats.activeTrips}
                            </p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '16px' }}>
                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🟡</div>
                            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b' }}>Maintenance</p>
                            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                                {stats.maintenanceAlerts}
                            </p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '16px' }}>
                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔴</div>
                            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#ef4444' }}>Out of Service</p>
                            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>0</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;