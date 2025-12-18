import Trip from '../models/trip.js';
import User from '../models/user.js';
import Truck from '../models/truck.js';
import { checkTruckAvailability } from '../services/tripService.js';

// Simple function to get all trips (for admin)
export const getAllTrips = async (req, res) => {
    try {
        const trips = await Trip.find()
            .populate('driver', 'fullname email')
            .populate('truck', 'immatriculation marque modele')
            .populate('trailer', 'immatriculation');
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Simple function to create new trip
export const createTrip = async (req, res) => {
    try {
        // Check truck availability before creating trip
        if (req.body.truck) {
            await checkTruckAvailability(req.body.truck, req.body.startDate, req.body.endDate);
        }
        // if (req.body.trailer) {
        //     await checkTruckAvailability(req.body.trailer, req.body.startDate, req.body.endDate);
        // }

        const trip = new Trip(req.body);
        await trip.save();
        
        // Update truck status to in_use if trip starts immediately
        if (trip.truck && trip.status === 'in_progress') {
            await Truck.findByIdAndUpdate(trip.truck, { status: 'in_use' });
        }
        
        res.status(201).json({
            message:'craete sussfully',
            trip
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Simple function to update trip
export const updateTrip = async (req, res) => {
    try {
        const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        res.json(trip);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Simple function to delete trip
export const deleteTrip = async (req, res) => {
    try {

        const trip = await Trip.findByIdAndDelete(req.params.id);
        if(trip.status === 'in_progress' || trip.status === 'pending'){
            return res.status(400).json({ message: 'Cannot delete a trip that is pending or in progress' });
        }
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        
        // Update truck status back to available
        if (trip.truck) {
            await Truck.findByIdAndUpdate(trip.truck, { status: 'available' });
        }
        
        res.json({ message: 'Trip deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Simple function to get all drivers (for trip assignment)
export const getAllDrivers = async (req, res) => {
    try {
        const drivers = await User.find({ role: 'driver' }).select('fullname email');
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};