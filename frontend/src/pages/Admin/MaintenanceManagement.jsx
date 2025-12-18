import { useState, useEffect } from 'react';
import api from '../../api/axios';
import DashboardLayout from '../../components/DashboardLayout';
import Swal from 'sweetalert2';

const MaintenanceManagement = () => {
    const [maintenance, setMaintenance] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingMaintenance, setEditingMaintenance] = useState(null);
    const [formData, setFormData] = useState({
        truck: '',
        maintenanceType: 'oil-change',
        scheduledDate: '',
        description: '',
        cost: '',
        status: 'scheduled'
    });

    useEffect(() => {
        loadMaintenance();
        loadTrucks();
    }, []);

    const loadMaintenance = async () => {
        try {
            const response = await api.get('/maintenance');
            setMaintenance(response.data);
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to load maintenance records.',
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

    const saveMaintenance = async (e) => {
        e.preventDefault();
        try {
            if (editingMaintenance) {
                await api.put(`/maintenance/${editingMaintenance._id}`, formData);
            } else {
                await api.post('/maintenance', formData);
            }
            
            setShowForm(false);
            setEditingMaintenance(null);
            setFormData({
                truck: '',
                maintenanceType: 'oil-change',
                scheduledDate: '',
                description: '',
                cost: '',
                status: 'scheduled'
            });
            loadMaintenance();
            Swal.fire({
                title: 'Success!',
                text: editingMaintenance ? 'Maintenance updated successfully!' : 'Maintenance scheduled successfully!',
                icon: 'success',
                confirmButtonColor: '#f59e0b',
                timer: 2000
            });
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to save maintenance. Please try again.',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    const editMaintenance = (maintenanceItem) => {
        setEditingMaintenance(maintenanceItem);
        setFormData({
            truck: maintenanceItem.truck?._id || '',
            maintenanceType: maintenanceItem.maintenanceType,
            scheduledDate: maintenanceItem.scheduledDate?.split('T')[0] || '',
            description: maintenanceItem.description || '',
            cost: maintenanceItem.cost || '',
            status: maintenanceItem.status
        });
        setShowForm(true);
    };

    const deleteMaintenance = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This will cancel the maintenance schedule!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/maintenance/${id}`);
                loadMaintenance();
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Maintenance has been cancelled.',
                    icon: 'success',
                    confirmButtonColor: '#f59e0b',
                    timer: 2000
                });
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete maintenance. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled': return '#f59e0b';
            case 'in_progress': return '#3b82f6';
            case 'completed': return '#10b981';
            default: return '#6b7280';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'oil-change': return '🛢️';
            case 'revision': return '🔧';
            case 'tire-replacement': return '🛞';
            case 'repair': return '⚙️';
            default: return '🔧';
        }
    };

    return (
        <DashboardLayout userRole="admin">
            <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>Maintenance Management</h1>
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
                        + Schedule Maintenance
                    </button>
                </div>

                <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {maintenance.map(item => (
                            <div key={item._id} style={{
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                padding: '16px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {getTypeIcon(item.maintenanceType)}
                                            {item.maintenanceType.replace('-', ' ').toUpperCase()}
                                        </h3>
                                        <p style={{ color: '#666', marginBottom: '4px' }}>
                                            Truck: {item.truck?.immatriculation || 'Not assigned'}
                                        </p>
                                        <p style={{ color: '#666', fontSize: '14px' }}>
                                            Scheduled: {new Date(item.scheduledDate).toLocaleDateString()} |
                                            Cost: ${item.cost || 'TBD'}
                                        </p>
                                        {item.description && (
                                            <p style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
                                                📝 {item.description}
                                            </p>
                                        )}
                                    </div>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: 'white',
                                        backgroundColor: getStatusColor(item.status)
                                    }}>
                                        {item.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    <button
                                        onClick={() => editMaintenance(item)}
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
                                        onClick={() => deleteMaintenance(item._id)}
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
                            width: '500px'
                        }}>
                            <h2 style={{ marginBottom: '20px' }}>
                                {editingMaintenance ? 'Edit Maintenance' : 'Schedule Maintenance'}
                            </h2>
                            
                            <form onSubmit={saveMaintenance} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                                    value={formData.maintenanceType}
                                    onChange={(e) => setFormData({...formData, maintenanceType: e.target.value})}
                                    style={{
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                    }}
                                >
                                    <option value="oil-change">Oil Change</option>
                                    <option value="revision">Annual Revision</option>
                                    <option value="tire-replacement">Tire Replacement</option>
                                    <option value="repair">Repair</option>
                                </select>
                                
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <input
                                        type="date"
                                        value={formData.scheduledDate}
                                        onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
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
                                        type="number"
                                        placeholder="Estimated Cost"
                                        value={formData.cost}
                                        onChange={(e) => setFormData({...formData, cost: e.target.value})}
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
                                    value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                    style={{
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                    }}
                                >
                                    <option value="scheduled">Scheduled</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                                
                                <textarea
                                    placeholder="Description (optional)"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                                            backgroundColor: '#f59e0b',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '500'
                                        }}
                                    >
                                        {editingMaintenance ? 'Update' : 'Schedule'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditingMaintenance(null);
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

export default MaintenanceManagement;