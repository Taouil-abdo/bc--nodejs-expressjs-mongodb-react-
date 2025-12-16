import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DriverLayout from '../../components/DriverLayout';
import api from '../../api/axios';
import Swal from 'sweetalert2';
import DashboardLayout from '../../components/DashboardLayout';

const DriverDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [trips, setTrips] = useState([]);
    const [stats, setStats] = useState({
        totalTrips: 0,
        completedTrips: 0,
        pendingTrips: 0,
        inProgressTrips: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/driver/my-trips');
            const tripsData = response.data;
            setTrips(tripsData.slice(0, 5)); // Show only recent 5 trips
            
            setStats({
                totalTrips: tripsData.length,
                completedTrips: tripsData.filter(t => t.status === 'completed').length,
                pendingTrips: tripsData.filter(t => t.status === 'pending').length,
                inProgressTrips: tripsData.filter(t => t.status === 'in_progress').length
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#f59e0b';
            case 'in_progress': return '#3b82f6';
            case 'completed': return '#10b981';
            default: return '#6b7280';
        }
    };

    if (loading) {
        return (
            <DriverLayout>
                <div style={{ padding: '24px', textAlign: 'center' }}>
                    <p>Loading dashboard...</p>
                </div>
            </DriverLayout>
        );
    }

    return (
        <DashboardLayout>
          <div style={{ padding: '24px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>Driver Dashboard</h1>
                    <p style={{ color: '#666' }}>Welcome back, <span style={{ fontWeight: '600', color: '#2563eb' }}>{user?.fullname}</span></p>
                </div>
                
                <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '16px' }}>Available Trucks</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                        {trucks.map(truck => (
                            <div key={truck._id} style={{ 
                                border: selectedTruck?._id === truck._id ? '2px solid #2563eb' : '1px solid #e5e7eb',
                                borderRadius: '8px', 
                                padding: '16px', 
                                backgroundColor: selectedTruck?._id === truck._id ? '#eff6ff' : 'white',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>{truck.immatriculation}</h4>
                                    <span style={{ 
                                        padding: '4px 8px', 
                                        backgroundColor: '#dcfce7', 
                                        color: '#166534', 
                                        fontSize: '12px', 
                                        borderRadius: '9999px' 
                                    }}>
                                        {truck.status}
                                    </span>
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <p style={{ color: '#666', marginBottom: '4px' }}><span style={{ fontWeight: '500' }}>Model:</span> {truck.model}</p>
                                    <p style={{ color: '#666' }}><span style={{ fontWeight: '500' }}>Current KM:</span> {truck.kilometrageActuel?.toLocaleString()}</p>
                                </div>
                                <button 
                                    onClick={() => setSelectedTruck(truck)}
                                    style={{
                                        width: '100%',
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        backgroundColor: selectedTruck?._id === truck._id ? '#2563eb' : '#f3f4f6',
                                        color: selectedTruck?._id === truck._id ? 'white' : '#374151',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {selectedTruck?._id === truck._id ? 'Selected' : 'Select Truck'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {selectedTruck && (
                    <div style={{ 
                        backgroundColor: 'white', 
                        borderRadius: '8px', 
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
                        padding: '24px',
                        borderLeft: '4px solid #2563eb'
                    }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '16px' }}>
                            Selected Truck: <span style={{ color: '#2563eb' }}>{selectedTruck.immatriculation}</span>
                        </h3>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <input
                                type="number"
                                placeholder="Enter new kilometrage"
                                value={kmUpdate}
                                onChange={(e) => setKmUpdate(e.target.value)}
                                style={{
                                    flex: '1',
                                    minWidth: '200px',
                                    padding: '12px 16px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            />
                            <button 
                                onClick={updateKilometrage}
                                style={{
                                    padding: '12px 24px',
                                    backgroundColor: '#2563eb',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                Update KM
                            </button>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </DashboardLayout>
          
    );
};

export default DriverDashboard;