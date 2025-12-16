import authService from '../services/authService.js';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock the dependencies - simple way to fake them for testing
jest.mock('../models/user.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Service Tests', () => {
    // Clear all mocks before each test - fresh start
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test 1: Simple register test
    describe('Register User', () => {
        test('should register a new user successfully', async () => {
            // Arrange - set up fake data
            const userData = {
                fullname: 'John Doe',
                email: 'john@test.com',
                password: 'password123',
                age: 25,
                role: 'driver'
            };

            // Mock the database responses
            User.findOne.mockResolvedValue(null); // No existing user
            bcrypt.hash.mockResolvedValue('hashedPassword123');
            User.create.mockResolvedValue({
                _id: 'user123',
                ...userData,
                password: 'hashedPassword123'
            });
            jwt.sign.mockReturnValue('fakeToken123');

            // Act - run the function
            const result = await authService.register(userData);

            // Assert - check if it worked correctly
            expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
            expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
            expect(User.create).toHaveBeenCalled();
            expect(result.user.fullname).toBe(userData.fullname);
            expect(result.access_token).toBe('fakeToken123');
        });

        test('should throw error if user already exists', async () => {
            // Arrange - user already exists
            const userData = { email: 'existing@test.com' };
            User.findOne.mockResolvedValue({ email: 'existing@test.com' });

            // Act & Assert - should throw error
            await expect(authService.register(userData)).rejects.toThrow('User already exists');
        });
    });

    // Test 2: Simple login test
    describe('Login User', () => {
        test('should login user with correct credentials', async () => {
            // Arrange
            const loginData = {
                email: 'john@test.com',
                password: 'password123'
            };

            const mockUser = {
                _id: 'user123',
                fullname: 'John Doe',
                email: 'john@test.com',
                password: 'hashedPassword123',
                role: 'driver'
            };

            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true); // Password matches
            jwt.sign.mockReturnValue('fakeToken123');

            // Act
            const result = await authService.login(loginData);

            // Assert
            expect(User.findOne).toHaveBeenCalledWith({ email: loginData.email });
            expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
            expect(result.user.fullname).toBe(mockUser.fullname);
            expect(result.access_token).toBe('fakeToken123');
        });

        test('should throw error with wrong password', async () => {
            // Arrange
            const loginData = { email: 'john@test.com', password: 'wrongpassword' };
            const mockUser = { password: 'hashedPassword123' };

            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false); // Password doesn't match

            // Act & Assert
            await expect(authService.login(loginData)).rejects.toThrow('Invalid email or password');
        });

        test('should throw error if user not found', async () => {
            // Arrange
            const loginData = { email: 'notfound@test.com', password: 'password123' };
            User.findOne.mockResolvedValue(null); // User not found

            // Act & Assert
            await expect(authService.login(loginData)).rejects.toThrow('Invalid email or password');
        });
    });
});