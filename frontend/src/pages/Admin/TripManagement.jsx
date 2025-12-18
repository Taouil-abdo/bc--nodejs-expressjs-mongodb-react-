import { useState, useEffect } from 'react';
import api from '../../api/axios';
import DashboardLayout from '../../components/DashboardLayout';
import Swal from 'sweetalert2';

const TripManagement = () => {
    // Simple state management
    const [trips, setTrips] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [trailers ,setTrailers] =useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingTrip, setEditingTrip] = useState(null);
    const [formData, setFormData] = useState({
        startLocation: '',
        endLocation: '',
        startDate: '',
        endDate: '',
        driver: '',
        truck: '',
        trailer:'',
        notes: ''
    });

    // Load data when page opens
    useEffect(() => {
        loadTrips();
        loadTrucks();
        loadDrivers();
        loadTrailers();
    }, []);

    // Simple functions to load data
    const loadTrips = async () => {
        try {
            const response = await api.get('/trips');
            setTrips(response.data);
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to load trips. Please refresh the page.',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    const loadTrucks = async () => {
        try {
            const response = await api.get('/trucks');
            setTrucks(response.data.filter(truck => truck.status === 'available'));
        } catch (error) {
            console.error('Error loading trucks:', error);
        }
    };

    const loadDrivers = async () => {
        try {
            const response = await api.get('/trips/drivers');
            setDrivers(response.data);
        } catch (error) {
            console.error('Error loading drivers:', error);
        }
    };

    const loadTrailers = async () => {
        try{
            const response = await api.get('/trailers');
            setTrailers(response.data);

        }catch(error){
            console.error('Error loading the Trailer :' , error);
        }

    }

   

    // Simple function to save trip
    const saveTrip = async (e) => {
        e.preventDefault();
        try {
            if (editingTrip) {
                await api.put(`/trips/${editingTrip._id}`, formData);
            } else {
                await api.post('/trips', formData);
            }
            
            // Reset and reload
            setShowForm(false);
            setEditingTrip(null);
            setFormData({
                startLocation: '',
                endLocation: '',
                startDate: '',
                endDate: '',
                driver: '',
                truck: '',
                notes: ''
            });
            loadTrips();
            loadTrucks(); // Reload to update available trucks
            Swal.fire({
                title: 'Success!',
                text: editingTrip ? 'Trip updated successfully!' : 'Trip created and assigned successfully!',
                icon: 'success',
                confirmButtonColor: '#8b5cf6',
                timer: 2000
            });
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to save trip. Please check all fields and try again.',
                icon: 'error',
                confirmButtonColor: '#ef4444',
                error: error
            });
        }
    };

    // Simple function to edit trip
    const editTrip = (trip) => {
        setEditingTrip(trip);
        setFormData({
            startLocation: trip.startLocation,
            endLocation: trip.endLocation,
            startDate: trip.startDate?.split('T')[0] || '',
            endDate: trip.endDate?.split('T')[0] || '',
            driver: trip.driver?._id || '',
            truck: trip.truck?._id || '',
            notes: trip.notes || ''
        });
        setShowForm(true);
    };

    // Simple function to delete trip with beautiful confirmation
    const deleteTrip = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This will cancel the trip and free up the truck!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/trips/${id}`);
                loadTrips();
                loadTrucks(); // Reload to update available trucks
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Trip has been deleted and truck is now available.',
                    icon: 'success',
                    confirmButtonColor: '#8b5cf6',
                    timer: 2000
                });
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete trip. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
            }
        }
    };

    // Simple function to get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#f59e0b';
            case 'in_progress': return '#3b82f6';
            case 'completed': return '#10b981';
            case 'cancelled': return '#ef4444';
            default: return '#6b7280';
        }
    };

    

    return (
        <DashboardLayout userRole="admin">
            <div style={{ padding: '24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>Trip Management</h1>
                    <button
                        onClick={() => setShowForm(true)}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#8b5cf6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        + Create New Trip
                    </button>
                </div>

                {/* Trip List */}
                <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {trips.map(trip => (
                            <div key={trip._id} style={{
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                padding: '16px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                                            {trip.startLocation} → {trip.endLocation}
                                        </h3>
                                        <p style={{ color: '#666', marginBottom: '4px' }}>
                                            Driver: {trip.driver?.fullname || 'Not assigned'}
                                        </p>
                                        <p style={{ color: '#666', fontSize: '14px' }}>
                                            Truck: {trip.truck?.immatriculation || 'Not assigned'} | 
                                            Start: {new Date(trip.startDate).toLocaleDateString()}
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
                                
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    <button
                                        onClick={() => editTrip(trip)}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#3b82f6',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteTrip(trip._id)}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#ef4444',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Simple Form Modal */}
                {showForm && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            padding: '24px',
                            width: '500px',
                            maxHeight: '80vh',
                            overflow: 'auto'
                        }}>
                            <h2 style={{ marginBottom: '20px' }}>
                                {editingTrip ? 'Edit Trip' : 'Create New Trip'}
                            </h2>
                            
                            <form onSubmit={saveTrip} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <input
                                    type="text"
                                    placeholder="Start Location"
                                    value={formData.startLocation}
                                    onChange={(e) => setFormData({...formData, startLocation: e.target.value})}
                                    required
                                    style={{
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                    }}
                                />
                                
                                <input
                                    type="text"
                                    placeholder="End Location"
                                    value={formData.endLocation}
                                    onChange={(e) => setFormData({...formData, endLocation: e.target.value})}
                                    required
                                    style={{
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                    }}
                                />
                                
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <input
                                        type="date"
                                        placeholder="Start Date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                        required
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '14px'
                                        }}
                                    />
                                    <input
                                        type="date"
                                        placeholder="End Date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '14px'
                                        }}
                                    />
                                </div>
                                
                                <select
                                    value={formData.driver}
                                    onChange={(e) => setFormData({...formData, driver: e.target.value})}
                                    required
                                    style={{
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                    }}
                                >
                                    <option value="">Select Driver</option>
                                    {drivers.map(driver => (
                                        <option key={driver._id} value={driver._id}>
                                            {driver.fullname}
                                        </option>
                                    ))}
                                </select>
                                
                                <select
                                    value={formData.truck}
                                    onChange={(e) => setFormData({...formData, truck: e.target.value})}
                                    required
                                    style={{
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                    }}
                                >
                                    <option value="">Select Truck</option>
                                    {trucks.map(truck => (
                                        <option key={truck._id} value={truck._id}>
                                            {truck.immatriculation} - {truck.marque} {truck.modele}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={formData.trailer}
                                    onChange={(e) => setFormData({...formData, trailer: e.target.value})}
                                    required
                                    style={{
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                    }}
                                >
                                    <option value="">Select Trailer</option>
                                    {trailers.map(trailer => (
                                        <option key={trailer._id} value={trailer._id}>
                                            {trailer.immatriculation} - {trailer.marque} {trailer.modele}
                                        </option>
                                    ))}
                                </select>
                                
                                <textarea
                                    placeholder="Notes (optional)"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                    rows="3"
                                    style={{
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        resize: 'vertical'
                                    }}
                                />
                                
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        type="submit"
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            backgroundColor: '#8b5cf6',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '500'
                                        }}
                                    >
                                        {editingTrip ? 'Update' : 'Create'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditingTrip(null);
                                        }}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            backgroundColor: '#6b7280',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default TripManagement;