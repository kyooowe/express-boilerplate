//#region Import
import { CreateProducts, FetchAllProducts } from '../products.controller';
import { Request } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { ProductsModel } from '../../../models/products/products.models';
import crypto from 'crypto';
//#endregion

// Loads variable in .env file
dotenv.config();

// Mock
const mockProducts = [
	{ name: 'test', type: 1 },
	{ name: 'test 1', type: 2 }
];

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

describe('Fetch:Products', () => {
	it('should fetch all products', async () => {
		// Mock Request
		const req = {} as Request;

		// Mock Response
		const res = mockResponse();

		jest.spyOn(ProductsModel, 'find').mockResolvedValueOnce(mockProducts);
		await FetchAllProducts(req, res);

		// Expected Result
		expect(ProductsModel.find).toHaveBeenCalledTimes(1);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toBeCalledWith({
			count: mockProducts.length,
			success: true,
			data: mockProducts,
			statusCode: 200,
			statusText: 'Success!'
		});
	});

	it('should return 500 if an error occurs', async () => {
		// Mock ProductsModel.find to throw an error
		ProductsModel.find = jest
			.fn()
			.mockRejectedValueOnce(new Error('Test error'));

		// Mock Request
		const req = {} as Request;

		// Mock Response
		const res = mockResponse();

		// Run Component
		await FetchAllProducts(req, res);

		// Expected Result
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

describe('Create:Products', () => {
	it('should returns a 409 status code when products already exist', async () => {
		// Create request object
		const req = {
			body: {
				name: 'test products'
			}
		};

		// Create mock response
		const res = mockResponse();

		// Run Create Products Component
		await CreateProducts(req as Request, res);

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

	it('should create a new product', async () => {
		// Generate Random Project Key Name
		const randomProductKeyName = crypto.randomBytes(20).toString('hex');

		// Mock Request
		const req = {
			body: {
				name: `test-${randomProductKeyName} products`,
				type: 1
			}
		};

		// Mock Response
		const res = mockResponse();

		// Run Component
		await CreateProducts(req as Request, res);

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

	it('should return an error if ProductsModel.save() throws an exception', async () => {
		// Spy on mongoose function
		jest.spyOn(ProductsModel.prototype, 'save').mockImplementationOnce(
			() => {
				throw new Error('Database error');
			}
		);

		// Mock Request
		const req = {
			body: {
				name: 'test products',
				type: 1
			}
		} as Request;

		// Mock Response
		const res = mockResponse();

		await CreateProducts(req, res);

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
