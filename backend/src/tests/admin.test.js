import { createDriver, getUsers } from '../controllers/adminController';
import User from '../models/user.js';
import authService from '../services/authService.js';

// Mock dependencies
jest.mock('../models/user.js');
jest.mock('../services/authService.js');

describe('Admin Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('createDriver', () => {
        it('should create a driver successfully', async () => {
            req.body = {
                fullname: 'John Driver',
                email: 'driver@test.com',
                password: 'password123',
                age: 30,
                phoneNumber: '1234567890'
            };

            const mockResult = {
                user: { _id: '123', ...req.body, role: 'driver' },
                token: 'mock-token'
            };

            authService.register.mockResolvedValue(mockResult);

            await createDriver(req, res);

            expect(authService.register).toHaveBeenCalledWith({
                ...req.body,
                role: 'driver'
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Driver created successfully',
                ...mockResult
            });
        });

        it('should handle errors during driver creation', async () => {
            const errorMessage = 'Registration failed';
            authService.register.mockRejectedValue(new Error(errorMessage));

            await createDriver(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: errorMessage
            });
        });
    });

    describe('getUsers', () => {
        it('should get all users successfully', async () => {
            const mockUsers = [
                { _id: '1', fullname: 'User 1' },
                { _id: '2', fullname: 'User 2' }
            ];

            // Mock chainable query
            const mockFind = {
                select: jest.fn().mockResolvedValue(mockUsers)
            };
            User.find.mockReturnValue(mockFind);

            await getUsers(req, res);

            expect(User.find).toHaveBeenCalled();
            expect(mockFind.select).toHaveBeenCalledWith('-password');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUsers);
        });
    });
});
