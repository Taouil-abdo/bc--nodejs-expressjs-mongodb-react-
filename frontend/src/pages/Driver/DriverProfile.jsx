import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DriverLayout from '../../components/DriverLayout';
import api from '../../api/axios';
import Swal from 'sweetalert2';

const DriverProfile = () => {
    const { user } = useSelector((state) => state.auth);
    const [profileData, setProfileData] = useState({
        fullname: user?.fullname || '',
        email: user?.email || '',
        phone: '',
        address: '',
        licenseNumber: '',
        licenseExpiry: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    const handleInputChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        try {
            await api.put('/users/profile', profileData);
            setIsEditing(false);
            Swal.fire({
                title: 'Success!',
                text: 'Profile updated successfully!',
                icon: 'success',
                confirmButtonColor: '#3b82f6',
                timer: 2000
            });
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update profile. Please try again.',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    return (
        <DriverLayout>
            <div style={{ padding: '24px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>Driver Profile</h1>
                            <button
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: isEditing ? '#10b981' : '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                {isEditing ? 'Save Changes' : 'Edit Profile'}
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '4px' }}>
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="fullname"
                                    value={profileData.fullname}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        backgroundColor: isEditing ? 'white' : '#f9fafb',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '4px' }}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profileData.email}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        backgroundColor: isEditing ? 'white' : '#f9fafb',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '4px' }}>
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={profileData.phone}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        backgroundColor: isEditing ? 'white' : '#f9fafb',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '4px' }}>
                                    License Number
                                </label>
                                <input
                                    type="text"
                                    name="licenseNumber"
                                    value={profileData.licenseNumber}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        backgroundColor: isEditing ? 'white' : '#f9fafb',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '4px' }}>
                                    License Expiry
                                </label>
                                <input
                                    type="date"
                                    name="licenseExpiry"
                                    value={profileData.licenseExpiry}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        backgroundColor: isEditing ? 'white' : '#f9fafb',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '4px' }}>
                                    Address
                                </label>
                                <textarea
                                    name="address"
                                    value={profileData.address}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    rows="3"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        backgroundColor: isEditing ? 'white' : '#f9fafb',
                                        resize: 'vertical',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        </div>

                        {isEditing && (
                            <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#6b7280',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DriverLayout>
    );
};

export default DriverProfile;