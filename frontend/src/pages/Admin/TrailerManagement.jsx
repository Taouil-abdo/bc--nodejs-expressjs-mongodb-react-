import { useState, useEffect } from 'react';
import api from '../../api/axios';
import DashboardLayout from '../../components/DashboardLayout';
import Swal from 'sweetalert2';

const TrailerManagement = () => {
    // Simple state - same pattern as trucks
    const [trailers, setTrailers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingTrailer, setEditingTrailer] = useState(null);
    const [formData, setFormData] = useState({
        immatriculation: '',
        marque: '',
        modele: '',
        dateAcquisition: ''
    });

    // Load trailers when page opens
    useEffect(() => {
        loadTrailers();
    }, []);

    // Simple function to get all trailers
    const loadTrailers = async () => {
        try {
            const response = await api.get('/trailers');
            setTrailers(response.data);
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to load trailers. Please refresh the page.',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    // Simple function to save trailer
    const saveTrailer = async (e) => {
        e.preventDefault();
        try {
            if (editingTrailer) {
                await api.put(`/trailers/${editingTrailer._id}`, formData);
            } else {
                await api.post('/trailers', formData);
            }
            
            // Reset and reload
            setShowForm(false);
            setEditingTrailer(null);
            setFormData({ immatriculation: '', marque: '', modele: '', dateAcquisition: '' });
            loadTrailers();
            Swal.fire({
                title: 'Success!',
                text: editingTrailer ? 'Trailer updated successfully!' : 'Trailer created successfully!',
                icon: 'success',
                confirmButtonColor: '#10b981',
                timer: 2000
            });
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to save trailer. Please try again.',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    // Simple function to edit trailer
    const editTrailer = (trailer) => {
        setEditingTrailer(trailer);
        setFormData({
            immatriculation: trailer.immatriculation,
            marque: trailer.marque,
            modele: trailer.modele,
            dateAcquisition: trailer.dateAcquisition?.split('T')[0] || ''
        });
        setShowForm(true);
    };

    // Simple function to delete trailer with beautiful confirmation
    const deleteTrailer = async (id) => {
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
                await api.delete(`/trailers/${id}`);
                loadTrailers();
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Trailer has been deleted successfully.',
                    icon: 'success',
                    confirmButtonColor: '#10b981',
                    timer: 2000
                });
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete trailer. Please try again.',
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
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>Trailer Management</h1>
                    <button
                        onClick={() => setShowForm(true)}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        + Add New Trailer
                    </button>
                </div>

                {/* Trailer List */}
                <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {trailers.map(trailer => (
                            <div key={trailer._id} style={{
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                padding: '16px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                                        {trailer.immatriculation}
                                    </h3>
                                    <p style={{ color: '#666', marginBottom: '4px' }}>
                                        {trailer.marque} {trailer.modele}
                                    </p>
                                    <p style={{ color: '#666', fontSize: '14px' }}>
                                        Status: {trailer.status} | Added: {new Date(trailer.dateAcquisition).toLocaleDateString()}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => editTrailer(trailer)}
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
                                        onClick={() => deleteTrailer(trailer._id)}
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
                            width: '400px'
                        }}>
                            <h2 style={{ marginBottom: '20px' }}>
                                {editingTrailer ? 'Edit Trailer' : 'Add New Trailer'}
                            </h2>
                            
                            <form onSubmit={saveTrailer} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <input
                                    type="text"
                                    placeholder="License Plate"
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
                                    placeholder="Brand"
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
                                    placeholder="Model"
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
                                    type="date"
                                    placeholder="Acquisition Date"
                                    value={formData.dateAcquisition}
                                    onChange={(e) => setFormData({...formData, dateAcquisition: e.target.value})}
                                    required
                                    style={{
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                    }}
                                />
                                
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        type="submit"
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            backgroundColor: '#10b981',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '500'
                                        }}
                                    >
                                        {editingTrailer ? 'Update' : 'Create'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditingTrailer(null);
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

export default TrailerManagement;