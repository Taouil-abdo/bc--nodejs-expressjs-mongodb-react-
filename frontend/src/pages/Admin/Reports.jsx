import { useState, useEffect } from 'react';
import api from '../../api/axios';
import DashboardLayout from '../../components/DashboardLayout';

const Reports = () => {
    const [activeTab, setActiveTab] = useState('fuel');
    const [fuelReport, setFuelReport] = useState(null);
    const [kilometrageReport, setKilometrageReport] = useState(null);
    const [maintenanceReport, setMaintenanceReport] = useState(null);
    const [driverReport, setDriverReport] = useState(null);
    const [dateRange, setDateRange] = useState({
        startDate: '2024-01-01',
        endDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        loadReports();
    }, [dateRange]);

    const loadReports = async () => {
        try {
            const [fuel, kilometrage, maintenance, drivers] = await Promise.all([
                api.get(`/reports/fuel?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`),
                api.get('/reports/kilometrage'),
                api.get('/reports/maintenance'),
                api.get('/reports/drivers')
            ]);

            setFuelReport(fuel.data);
            setKilometrageReport(kilometrage.data);
            setMaintenanceReport(maintenance.data);
            setDriverReport(drivers.data);
        } catch (error) {
            console.error('Error loading reports:', error);
        }
    };

    const TabButton = ({ id, label, active, onClick }) => (
        <button
            onClick={() => onClick(id)}
            style={{
                padding: '12px 24px',
                backgroundColor: active ? '#3b82f6' : 'transparent',
                color: active ? 'white' : '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                borderBottom: active ? 'none' : '1px solid #d1d5db'
            }}
        >
            {label}
        </button>
    );

    const StatCard = ({ title, value, subtitle, color }) => (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: `3px solid ${color}`
        }}>
            <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>{title}</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>{value}</p>
            {subtitle && <p style={{ fontSize: '12px', color: '#6b7280' }}>{subtitle}</p>}
        </div>
    );

    return (
        <DashboardLayout userRole="admin">
            <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
                        Fleet Reports & Analytics
                    </h1>
                    <p style={{ color: '#666' }}>Monitor your fleet performance and costs</p>
                </div>

                {/* Date Range Selector */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '24px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center'
                }}>
                    <label style={{ fontSize: '14px', fontWeight: '500' }}>Date Range:</label>
                    <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                        style={{
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                        }}
                    />
                    <span>to</span>
                    <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                        style={{
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                        }}
                    />
                </div>

                {/* Tab Navigation */}
                <div style={{ display: 'flex', marginBottom: '24px' }}>
                    <TabButton id="fuel" label="⛽ Fuel Consumption" active={activeTab === 'fuel'} onClick={setActiveTab} />
                    <TabButton id="kilometrage" label="📏 Kilometrage" active={activeTab === 'kilometrage'} onClick={setActiveTab} />
                    <TabButton id="maintenance" label="🔧 Maintenance" active={activeTab === 'maintenance'} onClick={setActiveTab} />
                    <TabButton id="drivers" label="👥 Driver Performance" active={activeTab === 'drivers'} onClick={setActiveTab} />
                </div>

                {/* Tab Content */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '0 8px 8px 8px',
                    padding: '24px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    minHeight: '400px'
                }}>
                    {/* Fuel Report */}
                    {activeTab === 'fuel' && fuelReport && (
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
                                Fuel Consumption Report
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                                <StatCard
                                    title="Total Fuel Used"
                                    value={`${fuelReport.totalLiters?.toLocaleString()} L`}
                                    color="#ef4444"
                                />
                                <StatCard
                                    title="Total Cost"
                                    value={`$${fuelReport.totalCost?.toLocaleString()}`}
                                    color="#f59e0b"
                                />
                                <StatCard
                                    title="Average Cost/Liter"
                                    value={`$${fuelReport.averageCostPerLiter?.toFixed(2)}`}
                                    color="#10b981"
                                />
                            </div>
                            
                            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>Recent Fuel Records</h3>
                            <div style={{ display: 'grid', gap: '8px' }}>
                                {fuelReport.fuelData?.slice(0, 5).map((fuel, index) => (
                                    <div key={index} style={{
                                        padding: '12px',
                                        backgroundColor: '#f9fafb',
                                        borderRadius: '6px',
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                        <span>{fuel.truck?.immatriculation} - {fuel.liters}L</span>
                                        <span>${fuel.cost}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Kilometrage Report */}
                    {activeTab === 'kilometrage' && kilometrageReport && (
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
                                Kilometrage Report
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                                <StatCard
                                    title="Total Fleet KM"
                                    value={kilometrageReport.totalFleetKm?.toLocaleString()}
                                    color="#3b82f6"
                                />
                                <StatCard
                                    title="Average KM/Truck"
                                    value={Math.round(kilometrageReport.averageKmPerTruck)?.toLocaleString()}
                                    color="#8b5cf6"
                                />
                            </div>
                            
                            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>Truck Kilometrage</h3>
                            <div style={{ display: 'grid', gap: '8px' }}>
                                {kilometrageReport.trucks?.map((truck, index) => (
                                    <div key={index} style={{
                                        padding: '12px',
                                        backgroundColor: '#f9fafb',
                                        borderRadius: '6px',
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                        <span>{truck.truck.immatriculation} - {truck.truck.marque}</span>
                                        <span>{truck.totalKm?.toLocaleString()} km</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Maintenance Report */}
                    {activeTab === 'maintenance' && maintenanceReport && (
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
                                Maintenance Report
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                                <StatCard
                                    title="Total Maintenance"
                                    value={maintenanceReport.stats?.total}
                                    color="#6b7280"
                                />
                                <StatCard
                                    title="Completed"
                                    value={maintenanceReport.stats?.completed}
                                    color="#10b981"
                                />
                                <StatCard
                                    title="Scheduled"
                                    value={maintenanceReport.stats?.scheduled}
                                    color="#f59e0b"
                                />
                                <StatCard
                                    title="In Progress"
                                    value={maintenanceReport.stats?.inProgress}
                                    color="#3b82f6"
                                />
                            </div>
                            
                            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>Maintenance by Type</h3>
                            <div style={{ display: 'grid', gap: '8px' }}>
                                {Object.entries(maintenanceReport.byType || {}).map(([type, count]) => (
                                    <div key={type} style={{
                                        padding: '12px',
                                        backgroundColor: '#f9fafb',
                                        borderRadius: '6px',
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                        <span>{type.replace('-', ' ').toUpperCase()}</span>
                                        <span>{count} times</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Driver Performance Report */}
                    {activeTab === 'drivers' && driverReport && (
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
                                Driver Performance Report
                            </h2>
                            
                            <div style={{ display: 'grid', gap: '12px' }}>
                                {driverReport.map((driver, index) => (
                                    <div key={index} style={{
                                        padding: '16px',
                                        backgroundColor: '#f9fafb',
                                        borderRadius: '8px',
                                        border: '1px solid #e5e7eb'
                                    }}>
                                        <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                                            {driver.driver.fullname}
                                        </h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
                                            <div>
                                                <span style={{ fontSize: '12px', color: '#6b7280' }}>Total Trips</span>
                                                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{driver.totalTrips}</p>
                                            </div>
                                            <div>
                                                <span style={{ fontSize: '12px', color: '#6b7280' }}>Total KM</span>
                                                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{driver.totalKm?.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <span style={{ fontSize: '12px', color: '#6b7280' }}>Avg KM/Trip</span>
                                                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{Math.round(driver.averageKmPerTrip)}</p>
                                            </div>
                                            <div>
                                                <span style={{ fontSize: '12px', color: '#6b7280' }}>Fuel Efficiency</span>
                                                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{driver.fuelEfficiency?.toFixed(1)} km/L</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Reports;