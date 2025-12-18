import { downloadTripPDF } from '../controllers/pdfController.js';
import Trip from '../models/trip.js';
import { generateTripPDF } from '../utils/generateTripPDF.js';

jest.mock('../models/trip.js');
jest.mock('../utils/generateTripPDF.js');

describe('PDF Controller Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { id: 'trip123' },
            user: { id: 'driver123', role: 'driver' }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should generate PDF for driver own trip', async () => {
        const mockTrip = {
            _id: 'trip123',
            driver: { _id: 'driver123', fullname: 'John Doe', email: 'john@test.com' },
            truck: { immatriculation: 'ABC123', marque: 'Volvo', modele: 'FH16' },
            startLocation: 'Casablanca',
            endLocation: 'Marrakech',
            status: 'in_progress'
        };

        Trip.findOne = jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockTrip)
                })
            })
        });

        generateTripPDF.mockImplementation(() => {});

        await downloadTripPDF(req, res);

        expect(Trip.findOne).toHaveBeenCalled();
        expect(generateTripPDF).toHaveBeenCalledWith(mockTrip, res);
    });

    it('should return 404 if trip not found', async () => {
        Trip.findOne = jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(null)
                })
            })
        });

        await downloadTripPDF(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Trip not found or access denied" });
    });

    it('should allow admin to download any trip', async () => {
        req.user = { id: 'admin123', role: 'admin' };

        const mockTrip = {
            _id: 'trip123',
            driver: { _id: 'driver456', fullname: 'Jane Doe' },
            truck: { immatriculation: 'XYZ789' }
        };

        Trip.findOne = jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockTrip)
                })
            })
        });

        generateTripPDF.mockImplementation(() => {});

        await downloadTripPDF(req, res);

        expect(generateTripPDF).toHaveBeenCalled();
    });
});
