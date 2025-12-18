import Trip from '../models/trip.js';
import Truck from '../models/truck.js';
import Fuel from '../models/fuel.js';
import Maintenance from '../models/maintenance.js';

// Simple reports controller
export const getFuelConsumptionReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        const fuelData = await Fuel.find({
            date: {
                $gte: new Date(startDate || '2024-01-01'),
                $lte: new Date(endDate || new Date())
            }
        }).populate('truck', 'immatriculation marque');
        
        // Calculate totals
        const totalLiters = fuelData.reduce((sum, fuel) => sum + fuel.liters, 0);
        const totalCost = fuelData.reduce((sum, fuel) => sum + fuel.cost, 0);
        
        res.json({
            totalLiters,
            totalCost,
            averageCostPerLiter: totalCost / totalLiters || 0,
            fuelData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getKilometrageReport = async (req, res) => {
    try {
        const trucks = await Truck.find();
        
        const kilometrageData = trucks.map(truck => ({
            truck: {
                id: truck._id,
                immatriculation: truck.immatriculation,
                marque: truck.marque,
                modele: truck.modele
            },
            currentKm: truck.kilometrageActuel,
            initialKm: truck.kilometrageInitial,
            totalKm: truck.kilometrageActuel - truck.kilometrageInitial
        }));
        
        const totalKm = kilometrageData.reduce((sum, truck) => sum + truck.totalKm, 0);
        
        res.json({
            totalFleetKm: totalKm,
            averageKmPerTruck: totalKm / trucks.length || 0,
            trucks: kilometrageData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMaintenanceReport = async (req, res) => {
    try {
        const maintenance = await Maintenance.find()
            .populate('truck', 'immatriculation marque')
            .sort({ scheduledDate: -1 });
        
        const maintenanceStats = {
            total: maintenance.length,
            completed: maintenance.filter(m => m.status === 'completed').length,
            scheduled: maintenance.filter(m => m.status === 'scheduled').length,
            inProgress: maintenance.filter(m => m.status === 'in_progress').length
        };
        
        // Group by maintenance type
        const byType = maintenance.reduce((acc, m) => {
            acc[m.maintenanceType] = (acc[m.maintenanceType] || 0) + 1;
            return acc;
        }, {});
        
        res.json({
            stats: maintenanceStats,
            byType,
            recentMaintenance: maintenance.slice(0, 10)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDriverPerformanceReport = async (req, res) => {
    try {
        const trips = await Trip.find({ status: 'completed' })
            .populate('driver', 'fullname email')
            .populate('truck', 'immatriculation');
        
        // Group trips by driver
        const driverStats = {};
        
        trips.forEach(trip => {
            const driverId = trip.driver._id.toString();
            if (!driverStats[driverId]) {
                driverStats[driverId] = {
                    driver: trip.driver,
                    totalTrips: 0,
                    totalKm: 0,
                    totalFuel: 0,
                    averageKmPerTrip: 0
                };
            }
            
            driverStats[driverId].totalTrips++;
            driverStats[driverId].totalKm += trip.distance || 0;
            driverStats[driverId].totalFuel += trip.fuelUsed || 0;
        });
        
        // Calculate averages
        Object.values(driverStats).forEach(driver => {
            driver.averageKmPerTrip = driver.totalKm / driver.totalTrips || 0;
            driver.fuelEfficiency = driver.totalKm / driver.totalFuel || 0; // km per liter
        });
        
        res.json(Object.values(driverStats));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const [trucks, trips, maintenance, fuel] = await Promise.all([
            Truck.find(),
            Trip.find(),
            Maintenance.find(),
            Fuel.find()
        ]);
        
        const stats = {
            trucks: {
                total: trucks.length,
                available: trucks.filter(t => t.status === 'available').length,
                inUse: trucks.filter(t => t.status === 'in_use').length,
                maintenance: trucks.filter(t => t.status === 'maintenance').length
            },
            trips: {
                total: trips.length,
                pending: trips.filter(t => t.status === 'pending').length,
                inProgress: trips.filter(t => t.status === 'in_progress').length,
                completed: trips.filter(t => t.status === 'completed').length
            },
            maintenance: {
                total: maintenance.length,
                scheduled: maintenance.filter(m => m.status === 'scheduled').length,
                completed: maintenance.filter(m => m.status === 'completed').length
            },
            fuel: {
                totalLiters: fuel.reduce((sum, f) => sum + f.liters, 0),
                totalCost: fuel.reduce((sum, f) => sum + f.cost, 0)
            }
        };
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};