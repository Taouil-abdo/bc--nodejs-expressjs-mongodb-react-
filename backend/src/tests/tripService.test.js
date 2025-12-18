import * as tripService from '../services/tripService.js';
import Trip from '../models/trip.js';
import Truck from '../models/truck.js';

// Mock the models
jest.mock('../models/trip.js');
jest.mock('../models/truck.js');

describe('Trip Service Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test 1: Get trips by driver
    describe('Get Trips by Driver', () => {
        test('should return trips for a specific driver', async () => {
            // Arrange
            const driverId = 'driver123';
            const mockTrips = [
                {
                    _id: 'trip1',
                    startLocation: 'Paris',
                    endLocation: 'Lyon',
                    driver: driverId,
                    status: 'pending'
                }
            ];

            // Mock the database query with chaining
            const mockPopulate2 = jest.fn().mockResolvedValue(mockTrips);
            const mockPopulate1 = jest.fn().mockReturnValue({ populate: mockPopulate2 });
            const mockFind = jest.fn().mockReturnValue({ populate: mockPopulate1 });

            Trip.find = mockFind;

            // Act
            const result = await tripService.getTripsAssignedByDriverId(driverId);

            // Assert
            expect(Trip.find).toHaveBeenCalledWith({ driver: driverId });
            expect(mockPopulate1).toHaveBeenCalledWith('truck', 'immatriculation marque modele');
            expect(mockPopulate2).toHaveBeenCalledWith('trailer', 'immatriculation');
            expect(result).toEqual(mockTrips);
        });
    });

    // Test 2: Update trip status
    describe('Update Trip Status', () => {
        test('should update trip status successfully', async () => {
            // Arrange
            const tripId = 'trip123';
            const driverId = 'driver123';
            const newStatus = 'in_progress';

            const mockTrip = {
                _id: tripId,
                driver: driverId,
                status: 'pending',
                truck: 'truck123'
            };

            const updatedTrip = { ...mockTrip, status: newStatus };

            Trip.findById.mockResolvedValue(mockTrip);
            Trip.findOne.mockResolvedValue(null); // No active trip
            Trip.findByIdAndUpdate.mockResolvedValue(updatedTrip);

            // Act
            const result = await tripService.updateTripStatus(tripId, driverId, newStatus);

            // Assert
            expect(Trip.findById).toHaveBeenCalledWith(tripId);
            expect(Trip.findByIdAndUpdate).toHaveBeenCalledWith(
                tripId,
                { status: newStatus },
                { new: true }
            );
            expect(result.status).toBe(newStatus);
        });

        test('should throw error if trip not found', async () => {
            // Arrange
            const tripId = 'nonexistent';
            const driverId = 'driver123';
            Trip.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(
                tripService.updateTripStatus(tripId, driverId, 'in_progress')
            ).rejects.toThrow('Trip not found');
        });

        test('should throw error if driver not authorized', async () => {
            // Arrange
            const tripId = 'trip123';
            const wrongDriverId = 'wrongdriver';
            const mockTrip = {
                _id: tripId,
                driver: 'correctdriver123',
                status: 'pending'
            };

            Trip.findById.mockResolvedValue(mockTrip);

            // Act & Assert
            await expect(
                tripService.updateTripStatus(tripId, wrongDriverId, 'in_progress')
            ).rejects.toThrow('Not authorized to update this trip');
        });
    });

    // Test 3: Update trip data
    describe('Update Trip Data', () => {
        test('should update trip data successfully', async () => {
            // Arrange
            const tripId = 'trip123';
            const driverId = 'driver123';
            const updateData = {
                currentKm: 150000,
                fuelUsed: 50,
                notes: 'Trip completed successfully'
            };

            const mockTrip = {
                _id: tripId,
                driver: driverId,
                status: 'in_progress'
            };

            const updatedTrip = { ...mockTrip, ...updateData };

            Trip.findById.mockResolvedValue(mockTrip);
            Trip.findByIdAndUpdate.mockResolvedValue(updatedTrip);

            // Act
            const result = await tripService.updateTripData(tripId, driverId, updateData);

            // Assert
            expect(Trip.findById).toHaveBeenCalledWith(tripId);
            expect(Trip.findByIdAndUpdate).toHaveBeenCalledWith(
                tripId,
                updateData,
                { new: true }
            );
            expect(result.currentKm).toBe(updateData.currentKm);
            expect(result.notes).toBe(updateData.notes);
        });

        test('should throw error if trying to update completed trip', async () => {
            // Arrange
            const tripId = 'trip123';
            const driverId = 'driver123';
            const mockTrip = {
                _id: tripId,
                driver: driverId,
                status: 'completed' // Already completed
            };

            Trip.findById.mockResolvedValue(mockTrip);

            // Act & Assert
            await expect(
                tripService.updateTripData(tripId, driverId, { currentKm: 150000 })
            ).rejects.toThrow('Cannot update completed trip');
        });
    });
});