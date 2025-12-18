import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../api/axios';
import Swal from 'sweetalert2';
import DashboardLayout from '../../components/DashboardLayout';

const MyTrips = () => {
    const { user } = useSelector((state) => state.auth);
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyTrips();
    }, []);

    const fetchMyTrips = async () => {
        try {
            const response = await api.get('/driver/my-trips');
            setTrips(response.data);
        } catch (error) {
            console.error('Error fetching trips:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateTripStatus = async (tripId, status) => {
        try {
            // Check if driver already has an active trip
            if (status === 'in_progress') {
                const hasActiveTrip = trips.some(t => 
                    t.status === 'in_progress' && t._id !== tripId
                );
                
                if (hasActiveTrip) {
                    Swal.fire({
                        title: 'Cannot Start Trip!',
                        text: 'You already have an active trip in progress. Please complete your current trip before starting a new one.',
                        icon: 'warning',
                        confirmButtonColor: '#f59e0b'
                    });
                    return;
                }
            }

            await api.patch(`/driver/${tripId}/status`, { status });
            fetchMyTrips();
            Swal.fire({
                title: 'Success!',
                text: `Trip status updated to ${status.replace('_', ' ')}!`,
                icon: 'success',
                confirmButtonColor: '#3b82f6',
                timer: 2000
            });
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to update trip status. Please try again.',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    const downloadPDF = async (tripId) => {
        try {
            const response = await api.get(`/driver/${tripId}/pdf`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `trip-${tripId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to download PDF. Please try again.',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
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
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>Loading trips...</p>
            </div>
        );
    }

    return (
        <DashboardLayout userRole='driver'>
          <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>My Trips</h1>
                    <p style={{ color: '#666' }}>Manage your assigned trips, {user?.fullname}</p>
                </div>

                <div style={{ display: 'grid', gap: '16px' }}>
                    {trips.length === 0 ? (
                        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '40px', textAlign: 'center' }}>
                            <p style={{ color: '#666', fontSize: '16px' }}>No trips assigned yet</p>
                        </div>
                    ) : (
                        trips.map(trip => (
                            <div key={trip._id} style={{
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                padding: '24px',
                                border: '1px solid #e5e7eb'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
                                            {trip.startLocation} → {trip.endLocation}
                                        </h3>
                                        <p style={{ color: '#666', fontSize: '14px' }}>
                                            Trip ID: {trip._id}
                                        </p>
                                    </div>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: 'white',
                                        backgroundColor: getStatusColor(trip.status)
                                    }}>
                                        {trip.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                                    <div>
                                        <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Start Date</p>
                                        <p style={{ fontWeight: '500' }}>{new Date(trip.startDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>End Date</p>
                                        <p style={{ fontWeight: '500' }}>{new Date(trip.endDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Truck</p>
                                        <p style={{ fontWeight: '500' }}>{trip.truck?.immatriculation || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Distance</p>
                                        <p style={{ fontWeight: '500' }}>{trip.distance || 'N/A'} km</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                    {trip.status === 'pending' && (
                                        <button
                                            onClick={() => updateTripStatus(trip._id, 'in_progress')}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#3b82f6',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}
                                        >
                                            Start Trip
                                        </button>
                                    )}
                                    {trip.status === 'in_progress' && (
                                        <button
                                            onClick={() => updateTripStatus(trip._id, 'completed')}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#10b981',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: '500'
                                            }}
                                        >
                                            Complete Trip
                                        </button>
                                    )}
                                    <button
                                        onClick={() => downloadPDF(trip._id)}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#6b7280',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Download PDF
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
          </div>
        </DashboardLayout>
    );
};

export default MyTrips;