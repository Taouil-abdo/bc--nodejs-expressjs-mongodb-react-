import Trip from '../models/trip.js';
import Truck from '../models/truck.js';
import User from '../models/user.js';
import Trailer from '../models/trailer.js'

// Simple function to get trips assigned to a driver
export const getTripsAssignedByDriverId = async (driverId) => {
    try {
        return await Trip.find({ driver: driverId })
            .populate('truck', 'immatriculation marque modele')
            .populate('trailer', 'immatriculation');
    } catch (error) {
        throw new Error('Failed to get driver trips');
    }
};

// Simple function to update trip status
export const updateTripStatus = async (tripId, driverId, status) => {
    try {
        // Find trip and check if driver is authorized
        const trip = await Trip.findById(tripId);
        if (!trip) {
            throw new Error('Trip not found');
        }
        
        if (trip.driver.toString() !== driverId) {
            throw new Error('Not authorized to update this trip');
        }

        // CRITICAL: Check if driver already has a trip in progress
        if (status === 'in_progress') {
            const activeTrip = await Trip.findOne({
                driver: driverId,
                status: 'in_progress',
                _id: { $ne: tripId } // Exclude current trip
            });

            if (activeTrip) {
                throw new Error('Cannot start trip: You already have an active trip in progress. Please complete your current trip first.');
            }
        }

        // Update truck status based on trip status
        if (status === 'in_progress' && trip.truck) {
            await Truck.findByIdAndUpdate(trip.truck, { status: 'in_use' });
        }
        
        if (status === 'completed' && trip.truck) {
            await Truck.findByIdAndUpdate(trip.truck, { status: 'available' });
        }

        // Update trip status
        const updatedTrip = await Trip.findByIdAndUpdate(
            tripId,
            { status: status },
            { new: true }
        );

        return updatedTrip;
    } catch (error) {
        throw error;
    }
};

// Simple function to update trip data (km, fuel, notes)
export const updateTripData = async (tripId, driverId, data) => {
    try {
        // Find trip and check authorization
        const trip = await Trip.findById(tripId);
        if (!trip) {
            throw new Error('Trip not found');
        }
        
        if (trip.driver.toString() !== driverId) {
            throw new Error('Not authorized to update this trip');
        }

        // Don't allow updates to completed trips
        if (trip.status === 'completed') {
            throw new Error('Cannot update completed trip');
        }

        // Validate kilometrage logic
        if (data.endKm && data.startKm && data.endKm <= data.startKm) {
            throw new Error('End kilometrage must be greater than start kilometrage');
        }

        // Validate fuel consumption (reasonable range: 20-50 L/100km for trucks)
        if (data.fuelUsed && data.endKm && data.startKm) {
            const distance = data.endKm - data.startKm;
            const consumption = (data.fuelUsed / distance) * 100;
            if (consumption < 10 || consumption > 100) {
                throw new Error('Fuel consumption seems abnormal. Please verify the data.');
            }
        }

        // Update truck kilometrage if endKm is provided
        if (data.endKm && trip.truck) {
            await Truck.findByIdAndUpdate(trip.truck, { kilometrageActuel: data.endKm });
        }

        // Update trip data
        const updatedTrip = await Trip.findByIdAndUpdate(
            tripId,
            data,
            { new: true }
        );

        return updatedTrip;
    } catch (error) {
        throw error;
    }
};

// Function to check if truck is available for a trip
export const checkTruckAvailability = async (truckId, startDate, endDate) => {
    try {
        const truck = await Truck.findById(truckId);
        if (!truck) {
            throw new Error('Truck not found');
        }

        if (truck.status === 'maintenance') {
            throw new Error('Truck is currently in maintenance');
        }

        // Check for overlapping trips
        const overlappingTrips = await Trip.find({
            truck: truckId,
            status: { $in: ['pending', 'in_progress'] },
            $or: [
                { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
            ]
        });

        if (overlappingTrips.length > 0) {
            throw new Error('Truck is already assigned to another trip during this period');
        }

        return true;
    } catch (error) {
        throw error;
    }
};

export const checkTrailerAvailability = async (trailerId, startDate, endDate) => {
    try {
        const trailer = await Trailer.findById(trailerId);
        if (!trailer) {
            throw new Error('Trailer not found');
        }

        if (trailer.status === 'maintenance') {
            throw new Error('Trailer is currently in maintenance');
        }

        // Check for overlapping trips
        const overlappingTrips = await Trip.find({
            Trailer: trailerId,
            status: { $in: ['pending', 'in_progress'] },
            $or: [
                { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
            ]
        });

        if (overlappingTrips.length > 0) {
            throw new Error('Trailer is already assigned to another trip during this period');
        }

        return true;
    } catch (error) {
        throw error;
    }
};