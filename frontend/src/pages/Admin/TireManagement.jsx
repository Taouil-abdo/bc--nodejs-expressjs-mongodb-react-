import { useState, useEffect } from 'react';
import api from '../../api/axios';
import DashboardLayout from '../../components/DashboardLayout';
import Swal from 'sweetalert2';

const TireManagement = () => {
    const [tires, setTires] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingTire, setEditingTire] = useState(null);
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        size: '',
        truck: '',
        position: 'front-left',
        installationDate: '',
        currentKm: '',
        condition: 'good'
    });

    useEffect(() => {
        loadTires();
        loadTrucks();
    }, []);

    const loadTires = async () => {
        try {
            const response = await api.get('/tires');
            setTires(response.data);
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to load tires. Please refresh the page.',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    const loadTrucks = async () => {
        try {
            const response = await api.get('/trucks');
            setTrucks(response.data);
        } catch (error) {
            console.error('Error loading trucks:', error);
        }
    };

    const saveTire = async (e) => {
        e.preventDefault();
        try {
            if (editingTire) {
                await api.put(`/tires/${editingTire._id}`, formData);
            } else {
                await api.post('/tires', formData);
            }
            
            setShowForm(false);
            setEditingTire(null);
            setFormData({
                brand: '',
                model: '',
                size: '',
                truck: '',
                position: 'front-left',
                installationDate: '',
                currentKm: '',
                condition: 'good'
            });
            loadTires();
            Swal.fire({
                title: 'Success!',
                text: editingTire ? 'Tire updated successfully!' : 'Tire added successfully!',
                icon: 'success',
                confirmButtonColor: '#f59e0b',
                timer: 2000
            });
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to save tire. Please try again.',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    const editTire = (tire) => {
        setEditingTire(tire);
        setFormData({
            brand: tire.brand,
            model: tire.model,
            size: tire.size,
            truck: tire.truck?._id || '',
            position: tire.position,
            installationDate: tire.installationDate?.split('T')[0] || '',
            currentKm: tire.currentKm,
            condition: tire.condition
        });
        setShowForm(true);
    };

    const deleteTire = async (id) => {
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
                await api.delete(`/tires/${id}`);
                loadTires();
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Tire has been deleted successfully.',
                    icon: 'success',
                    confirmButtonColor: '#f59e0b',
                    timer: 2000
                });
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete tire. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
            }
        }
    };

    const getConditionColor = (condition) => {
        switch (condition) {
            case 'excellent': return '#10b981';
            case 'good': return '#3b82f6';
            case 'fair': return '#f59e0b';
            case 'poor': return '#ef4444';
            default: return '#6b7280';
        }
    };

    return (
        <DashboardLayout userRole="admin">
            <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>Tire Management</h1>
                    <button
                        onClick={() => setShowForm(true)}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#f59e0b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        + Add New Tire
                    </button>
                </div>

                <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {tires.map(tire => (
                            <div key={tire._id} style={{
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                padding: '16px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                                        {tire.brand} {tire.model} - {tire.size}
                                    </h3>
                                    <p style={{ color: '#666', marginBottom: '4px' }}>
                                        Truck: {tire.truck?.immatriculation || 'Not assigned'} | Position: {tire.position}
                                    </p>
                                    <p style={{ color: '#666', fontSize: '14px' }}>
                                        KM: {tire.currentKm?.toLocaleString()} | 
                                        <span style={{ 
                                            color: getConditionColor(tire.condition),
                                            fontWeight: 'bold',
                                            marginLeft: '8px'
                                        }}>
                                            {tire.condition.toUpperCase()}
                                        </span>
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => editTire(tire)}
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
                                        onClick={() => deleteTire(tire._id)}
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

                {showForm && (
                    <div 
                    style={{
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
                        <div 
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            padding: '24px',
                            width: '500px',
                            maxHeight: '80vh',
                            overflow: 'auto'
                        }}>
                            <h2 style={{ marginBottom: '20px' }}>
                                {editingTire ? 'Edit Tire' : 'Add New Tire'}
                            </h2>
                            
                            <form onSubmit={saveTire} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <input
                                        type="text"
                                        placeholder="Brand"
                                        value={formData.brand}
                                        onChange={(e) => setFormData({...formData, brand: e.target.value})}
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
                                        type="text"
                                        placeholder="Model"
                                        value={formData.model}
                                        onChange={(e) => setFormData({...formData, model: e.target.value})}
                                        required
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '14px'
                                        }}
                                    />
                                </div>
                                
                                <input
                                    type="text"
                                    placeholder="Size (e.g., 295/80R22.5)"
                                    value={formData.size}
                                    onChange={(e) => setFormData({...formData, size: e.target.value})}
                                    required
                                    style={{
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                    }}
                                />
                                
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
                                
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <select
                                        value={formData.position}
                                        onChange={(e) => setFormData({...formData, position: e.target.value})}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <option value="front-left">Front Left</option>
                                        <option value="front-right">Front Right</option>
                                        <option value="rear-left">Rear Left</option>
                                        <option value="rear-right">Rear Right</option>
                                    </select>
                                    
                                    <select
                                        value={formData.condition}
                                        onChange={(e) => setFormData({...formData, condition: e.target.value})}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <option value="excellent">Excellent</option>
                                        <option value="good">Good</option>
                                        <option value="fair">Fair</option>
                                        <option value="poor">Poor</option>
                                    </select>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <input
                                        type="date"
                                        placeholder="Installation Date"
                                        value={formData.installationDate}
                                        onChange={(e) => setFormData({...formData, installationDate: e.target.value})}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '14px'
                                        }}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Current KM"
                                        value={formData.currentKm}
                                        onChange={(e) => setFormData({...formData, currentKm: e.target.value})}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '14px'
                                        }}
                                    />
                                </div>
                                
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        type="submit"
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            backgroundColor: '#f59e0b',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '500'
                                        }}
                                    >
                                        {editingTire ? 'Update' : 'Create'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditingTire(null);
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

export default TireManagement;