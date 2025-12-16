import { useState, useEffect } from 'react';
import api from '../../api/axios';
import DashboardLayout from '../../components/DashboardLayout';
import Swal from 'sweetalert2';

const TruckManagement = () => {
    // Simple state management
    const [trucks, setTrucks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingTruck, setEditingTruck] = useState(null);
    const [formData, setFormData] = useState({
        immatriculation: '',
        marque: '',
        modele: '',
        kilometrageActuel: '',
        kilometrageInitial: '',
        dateAcquisition: '',
        derniereVidange: '',
        derniereRevision: ''
    });

    // Load trucks when page opens
    useEffect(() => {
        loadTrucks();
    }, []);

    // Simple function to get all trucks
    const loadTrucks = async () => {
        try {
            const response = await api.get('/trucks');
            setTrucks(response.data);
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to load trucks. Please refresh the page.',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    // Simple function to save truck
    const saveTruck = async (e) => {
        e.preventDefault();
        try {
            if (editingTruck) {
                // Update existing truck
                await api.put(`/trucks/${editingTruck._id}`, formData);
            } else {
                // Create new truck
                await api.post('/trucks', formData);
            }
            
            // Reset form and reload trucks
            setShowForm(false);
            setEditingTruck(null);
            setFormData({
                immatriculation: '',
                marque: '',
                modele: '',
                kilometrageActuel: '',
                kilometrageInitial: '',
                dateAcquisition: '',
                derniereVidange: '',
                derniereRevision: ''
            });
            loadTrucks();
            // Beautiful success message
            Swal.fire({
                title: 'Success!',
                text: editingTruck ? 'Truck updated successfully!' : 'Truck created successfully!',
                icon: 'success',
                confirmButtonColor: '#3b82f6',
                timer: 2000
            });
        } catch (error) {
            // Beautiful error message
            Swal.fire({
                title: 'Error!',
                text: 'Failed to save truck. Please try again.',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    // Simple function to edit truck
    const editTruck = (truck) => {
        setEditingTruck(truck);
        setFormData({
            immatriculation: truck.immatriculation,
            marque: truck.marque,
            modele: truck.modele,
            kilometrageActuel: truck.kilometrageActuel,
            kilometrageInitial: truck.kilometrageInitial,
            dateAcquisition: truck.dateAcquisition?.split('T')[0] || '',
            derniereVidange: truck.derniereVidange?.split('T')[0] || '',
            derniereRevision: truck.derniereRevision?.split('T')[0] || ''
        });
        setShowForm(true);
    };

    // Simple function to delete truck with beautiful confirmation
    const deleteTruck = async (id) => {
        // Beautiful confirmation dialog
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/trucks/${id}`);
                loadTrucks();
                // Success message
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Truck has been deleted successfully.',
                    icon: 'success',
                    confirmButtonColor: '#3b82f6',
                    timer: 2000
                });
            } catch (error) {
                // Error message
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete truck. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
            }
        }
    };

    return (
        <DashboardLayout userRole="admin">
            <div style={{ padding: '24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>Truck Management</h1>
                    <button
                        onClick={() => setShowForm(true)}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        + Add New Truck
                    </button>
                </div>

                {/* Truck List */}
                <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {trucks.map(truck => (
                            <div key={truck._id} style={{
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                padding: '16px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                                        {truck.immatriculation}
                                    </h3>
                                    <p style={{ color: '#666', marginBottom: '4px' }}>
                                        {truck.marque} {truck.modele}
                                    </p>
                                    <p style={{ color: '#666', fontSize: '14px' }}>
                                        Current KM: {truck.kilometrageActuel?.toLocaleString()} | Status: {truck.status}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => editTruck(truck)}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#10b981',
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
                                        onClick={() => deleteTruck(truck._id)}
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
                                {editingTruck ? 'Edit Truck' : 'Add New Truck'}
                            </h2>
                            
                            <form onSubmit={saveTruck} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <input
                                    type="text"
                                    placeholder="License Plate (Immatriculation)"
                                    value={formData.immatriculation}
                                    onChange={(e) => setFormData({...formData, immatriculation: e.target.value})}
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
                                    placeholder="Brand (Marque)"
                                    value={formData.marque}
                                    onChange={(e) => setFormData({...formData, marque: e.target.value})}
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
                                    placeholder="Model (Modele)"
                                    value={formData.modele}
                                    onChange={(e) => setFormData({...formData, modele: e.target.value})}
                                    required
                                    style={{
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                    }}
                                />
                                
                                <input
                                    type="number"
                                    placeholder="Current Kilometers"
                                    value={formData.kilometrageActuel}
                                    onChange={(e) => setFormData({...formData, kilometrageActuel: e.target.value})}
                                    required
                                    style={{
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                    }}
                                />
                                
                                <input
                                    type="number"
                                    placeholder="Initial Kilometers"
                                    value={formData.kilometrageInitial}
                                    onChange={(e) => setFormData({...formData, kilometrageInitial: e.target.value})}
                                    required
                                    style={{
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                    }}
                                />

                                <input placeholder='dateAcquisition' type="datetime-local"
                                style={{padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px'}} 
                                         name='dateAcquisition' value={formData.dateAcquisition} onChange={(e)=>setFormData({...formData,dateAcquisition:e.target.value})} required/>
                                <input placeholder='derniereVidange' style={{padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px'}} type="datetime-local" name='derniereVidange' value={formData.derniereVidange} onChange={(e)=>setFormData({...formData,derniereVidange:e.target.value})} required/>
                                <input placeholder='derniereRevision' style={{padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px'}} type="datetime-local" name='derniereRevision' value={formData.derniereRevision}  onChange={(e)=>setFormData({...formData ,derniereRevision:e.target.value})} required/> 
                                
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        type="submit"
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            backgroundColor: '#3b82f6',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '500'
                                        }}
                                    >
                                        {editingTruck ? 'Update' : 'Create'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditingTruck(null);
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

export default TruckManagement;