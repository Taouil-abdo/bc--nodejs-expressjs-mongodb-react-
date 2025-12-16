import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Swal from 'sweetalert2';
import DashboardLayout from '../../components/DashboardLayout';

const TripDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updateData, setUpdateData] = useState({
        currentKm: '',
        fuelUsed: '',
        notes: ''
    });

    useEffect(() => {
        fetchTripDetails();
    }, [id]);

    const fetchTripDetails = async () => {
        try {
            const response = await api.get(`/driver/my-trips`);
            const foundTrip = response.data.find(t => t._id === id);
            setTrip(foundTrip);
            if (foundTrip) {
                setUpdateData({
                    currentKm: foundTrip.currentKm || '',
                    fuelUsed: foundTrip.fuelUsed || '',
                    notes: foundTrip.notes || ''
                });
            }
        } catch (error) {
            console.error('Error fetching trip details:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateTripData = async () => {
        try {
            await api.patch(`/driver/${id}/data`, updateData);
            Swal.fire({
                title: 'Success!',
                text: 'Trip data updated successfully!',
                icon: 'success',
                confirmButtonColor: '#3b82f6',
                timer: 2000
            });
            fetchTripDetails();
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update trip data. Please try again.',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    const handleInputChange = (e) => {
        setUpdateData({
            ...updateData,
            [e.target.name]: e.target.value
        });
    };

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>Loading trip details...</p>
            </div>
        );
    }

    if (!trip) {
        return (
            <DashboardLayout userRole='driver'>
             <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>Trip not found</p>
                <button onClick={() => navigate('/driver/trips')} style={{ marginTop: '10px', padding: '8px 16px' }}>
                    Back to Trips
                </button>
             </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout userRole='driver'>
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <button 
                    onClick={() => navigate('/driver/trips')}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        marginBottom: '20px'
                    }}
                >
                    ← Back to Trips
                </button>

                <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '16px' }}>
                        Trip Details
                    </h1>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>Route</h3>
                            <p style={{ color: '#666' }}>{trip.startLocation} → {trip.endLocation}</p>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>Status</h3>
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: 'white',
                                backgroundColor: trip.status === 'pending' ? '#f59e0b' : trip.status === 'in_progress' ? '#3b82f6' : '#10b981'
                            }}>
                                {trip.status.replace('_', ' ').toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>Truck</h3>
                            <p style={{ color: '#666' }}>{trip.truck?.immatriculation || 'N/A'}</p>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>Distance</h3>
                            <p style={{ color: '#666' }}>{trip.distance || 'N/A'} km</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>Start Date</h3>
                            <p style={{ color: '#666' }}>{new Date(trip.startDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>End Date</h3>
                            <p style={{ color: '#666' }}>{new Date(trip.endDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {trip.status === 'in_progress' && (
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '24px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
                            Update Trip Data
                        </h2>
                        
                        <div style={{ display: 'grid', gap: '16px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '4px' }}>
                                    Current Kilometers
                                </label>
                                <input
                                    type="number"
                                    name="currentKm"
                                    value={updateData.currentKm}
                                    onChange={handleInputChange}
                                    placeholder="Enter current kilometers"
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '4px' }}>
                                    Fuel Used (Liters)
                                </label>
                                <input
                                    type="number"
                                    name="fuelUsed"
                                    value={updateData.fuelUsed}
                                    onChange={handleInputChange}
                                    placeholder="Enter fuel used"
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '4px' }}>
                                    Notes
                                </label>
                                <textarea
                                    name="notes"
                                    value={updateData.notes}
                                    onChange={handleInputChange}
                                    placeholder="Add any notes about the trip"
                                    rows="4"
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        resize: 'vertical',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        </div>
                        
                        <button
                            onClick={updateTripData}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Update Trip Data
                        </button>
                    </div>
                )}
            </div>
        </div>
        </DashboardLayout>
    );
};

export default TripDetails;