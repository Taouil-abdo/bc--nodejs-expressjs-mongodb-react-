import { updateTripStatus } from '../services/tripService.js';
import Trip from '../models/trip.js';
import Truck from '../models/truck.js';

jest.mock('../models/trip.js');
jest.mock('../models/truck.js');

describe('Trip Status Validation - One Active Trip Rule', () => {
    const driverId = 'driver123';
    const tripId = 'trip123';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should prevent driver from starting a second trip when one is already in progress', async () => {
        // Mock: Current trip exists
        Trip.findById.mockResolvedValue({
            _id: tripId,
            driver: driverId,
            status: 'pending',
            truck: 'truck123'
        });

        // Mock: Driver already has an active trip
        Trip.findOne.mockResolvedValue({
            _id: 'otherTrip123',
            driver: driverId,
            status: 'in_progress'
        });

        // Attempt to start a new trip
        await expect(
            updateTripStatus(tripId, driverId, 'in_progress')
        ).rejects.toThrow('Cannot start trip: You already have an active trip in progress');
    });

    it('should allow driver to start trip when no other trip is in progress', async () => {
        Trip.findById.mockResolvedValue({
            _id: tripId,
            driver: driverId,
            status: 'pending',
            truck: 'truck123'
        });

        // No active trip found
        Trip.findOne.mockResolvedValue(null);

        Trip.findByIdAndUpdate.mockResolvedValue({
            _id: tripId,
            status: 'in_progress'
        });

        Truck.findByIdAndUpdate.mockResolvedValue({});

        const result = await updateTripStatus(tripId, driverId, 'in_progress');

        expect(result.status).toBe('in_progress');
        expect(Trip.findOne).toHaveBeenCalledWith({
            driver: driverId,
            status: 'in_progress',
            _id: { $ne: tripId }
        });
    });

    it('should allow driver to complete a trip without checking for active trips', async () => {
        Trip.findById.mockResolvedValue({
            _id: tripId,
            driver: driverId,
            status: 'in_progress',
            truck: 'truck123'
        });

        Trip.findByIdAndUpdate.mockResolvedValue({
            _id: tripId,
            status: 'completed'
        });

        Truck.findByIdAndUpdate.mockResolvedValue({});

        const result = await updateTripStatus(tripId, driverId, 'completed');

        expect(result.status).toBe('completed');
        // Should NOT check for active trips when completing
        expect(Trip.findOne).not.toHaveBeenCalled();
    });
});
