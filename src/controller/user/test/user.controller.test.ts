//#region Import
import { CreateUser } from '../user.controller';
import { Request } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { UserModel } from '../../../models/user/user.models';
import crypto from 'crypto';
//#endregion

// Loads variable in .env file
dotenv.config();

// Run first
beforeAll(async () => {
	await mongoose.connect(`${process.env.MONGO_DB}`);
});

// Run after all test case is done
afterAll(async () => {
	await mongoose.disconnect();
});

const mockResponse = () => {
	// eslint-disable-next-line
	const res: any = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res;
};

describe('Create:User', () => {
	it('should returns a 409 status code when user already exist', async () => {
		// Create request object
		const req = {
			body: {
				email: 'existinguser@test.com'
			}
		};

		// Create mock response
		const res = mockResponse();

		// Run Forgot Password Component
		await CreateUser(req as Request, res);

		// Expected Result
		expect(res.status).toHaveBeenCalledWith(409);
		expect(res.json).toHaveBeenCalledWith({
			count: 0,
			success: true,
			data: null,
			statusCode: 409,
			statusText: 'Data already exists'
		});
	});

	it('should create a new user', async () => {
		// Generate Random Password
		const randomPassword = crypto.randomBytes(20).toString('hex');

		// Mock Request
		const req = {
			body: {
				email: 'existinguser@test.com',
				password: randomPassword,
				lastName: 'existing',
				firstName: 'existing',
				middleName: 'existing'
			}
		};

		// Mock Response
		const res = mockResponse();

		// Run Component
		await CreateUser(req as Request, res);

		// Expected Result
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({
			count: 1,
			success: true,
			data: expect.anything(),
			statusCode: 200,
			statusText: 'Success!'
		});
	});

	it('should return an error if CreateModel.save() throws an exception', async () => {
		// Spy on mongoose function
		jest.spyOn(UserModel.prototype, 'save').mockImplementationOnce(() => {
			throw new Error('Database error');
		});

		// Mock Request
		const req = {
			body: {
				email: 'test@email.com',
				pasword: 'test',
				firstName: 'test',
				middleName: 'test',
				lastName: 'test'
			}
		} as Request;

		// Mock Response
		const res = mockResponse();

		await CreateUser(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({
			count: 0,
			success: false,
			data: null,
			statusCode: 500,
			statusText: 'Something error occured, please contact administrator!'
		});
	});
});
