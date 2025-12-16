import { useState, useEffect } from 'react';
import api from '../../api/axios';
import DashboardLayout from '../../components/DashboardLayout';
import Swal from 'sweetalert2';

const DriverManagement = () => {
    const [drivers, setDrivers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        age: '',
        phoneNumber: ''
    });

    useEffect(() => {
        loadDrivers();
    }, []);

    const loadDrivers = async () => {
        try {
            const response = await api.get('/admin/users');
            // Filter only drivers
            const driversOnly = response.data.filter(user => user.role === 'driver');
            setDrivers(driversOnly);
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to load drivers. Please refresh the page.',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    const createDriver = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/drivers', formData);
            
            setShowForm(false);
            setFormData({
                fullname: '',
                email: '',
                password: '',
                age: '',
                phoneNumber: ''
            });
            loadDrivers();
            Swal.fire({
                title: 'Success!',
                text: 'Driver created successfully!',
                icon: 'success',
                confirmButtonColor: '#10b981',
                timer: 2000
            });
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to create driver. Please try again.',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    const toggleDriverStatus = async (driverId, currentStatus) => {
        const result = await Swal.fire({
            title: 'Change Driver Status?',
            text: `This will ${currentStatus === 'active' ? 'deactivate' : 'activate'} the driver.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3b82f6',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, change it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                await api.patch(`/admin/users/${driverId}/status`);
                loadDrivers();
                Swal.fire({
                    title: 'Updated!',
                    text: 'Driver status has been updated.',
                    icon: 'success',
                    confirmButtonColor: '#10b981',
                    timer: 2000
                });
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to update driver status. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
            }
        }
    };

    const getStatusColor = (status) => {
        return status === 'active' ? '#10b981' : '#ef4444';
    };

    return (
        <DashboardLayout userRole="admin">
            <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>Driver Management</h1>
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
                        + Add New Driver
                    </button>
                </div>

                <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {drivers.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                <p>No drivers found. Create your first driver!</p>
                            </div>
                        ) : (
                            drivers.map(driver => (
                                <div key={driver._id} style={{
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                                            {driver.fullname}
                                        </h3>
                                        <p style={{ color: '#666', marginBottom: '4px' }}>
                                            📧 {driver.email} | 📞 {driver.phoneNumber || 'No phone'}
                                        </p>
                                        <p style={{ color: '#666', fontSize: '14px' }}>
                                            Age: {driver.age} | 
                                            <span style={{ 
                                                color: getStatusColor(driver.status),
                                                fontWeight: 'bold',
                                                marginLeft: '8px'
                                            }}>
                                                {driver.status.toUpperCase()}
                                            </span>
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => toggleDriverStatus(driver._id, driver.status)}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: driver.status === 'active' ? '#ef4444' : '#10b981',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '14px'
                                            }}
                                        >
                                            {driver.status === 'active' ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
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
                            width: '400px'
                        }}>
                            <h2 style={{ marginBottom: '20px' }}>Add New Driver</h2>
                            
                            <form onSubmit={createDriver} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={formData.fullname}
                                    onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                                    required
                                    style={{
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                    }}
                                />
                                
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                    style={{
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                    }}
                                />
                                
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
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
                                        type="number"
                                        placeholder="Age"
                                        value={formData.age}
                                        onChange={(e) => setFormData({...formData, age: e.target.value})}
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
                                        placeholder="Phone Number"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
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
                                            backgroundColor: '#10b981',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Create Driver
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
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

export default DriverManagement;