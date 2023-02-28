//#region Import
import { Login } from "../login.controller";
import { UserModel } from "../../../models/user/user.models";
import bcrypt from 'bcrypt';
import { Request } from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";
//#endregion

// Loads variable in .env file
dotenv.config();

describe('LOGIN:CONTROLLER', () => {

    // Run first
    beforeAll(async () => {
        await mongoose.connect(`${process.env.MONGO_DB}`)
    })

    // Run after all test case is done
    afterAll(async () => {
        await mongoose.disconnect()
    })

    const mockResponse = () => {
        const res: any = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    it('should returns a 404 status code when user is not found', async () => {

        // Mock Request
        const req = {
            body: {
                email: 'nonexistentuser@test.com',
                password: 'password123'
            }
        };

        // Mock Response
        const res = mockResponse()

        // Run Component
        await Login(req as Request, res);

        // Expected Result
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ count: 0, success: true, data: null, statusCode: 404, statusText: "Not Found!" });
    });

    test('returns a 404 status code when password is incorrect', async () => {

        // Create user and mock as existing
        const existingUser = new UserModel({
            email: 'existinguser@test.com',
            password: await bcrypt.hash('password123', 8),
            lastName: "existing",
            firstName: "existing",
            middleName: "existing"
        });
        await existingUser.save();

        // Mock Request
        const req = {
            body: {
                email: 'existinguser@test.com',
                password: 'wrongpassword'
            }
        };

        // Mock Response
        const res = mockResponse()

        // Run Component
        await Login(req as Request, res);

        // Expected Result
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ count: 0, success: true, data: null, statusCode: 404, statusText: "Not Found!" });

        await existingUser.deleteOne({ email: existingUser.email })
    });

    test('returns a token and a 200 status code when the user is found and the password is correct', async () => {

        // Create user and mock as existing
        const existingUser = new UserModel({
            email: 'existinguser@test.com',
            password: await bcrypt.hash('password123', 8),
            lastName: "existing",
            firstName: "existing",
            middleName: "existing"
        });
        await existingUser.save();

        // Mock Request
        const req = {
            body: {
                email: 'existinguser@test.com',
                password: 'password123'
            }
        };

        // Mock Response
        const res = mockResponse()

        // Run Component
        await Login(req as Request, res);

        // Expected Result
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            count: 1,
            success: true,
            data: {
                user: expect.anything(),
                token: expect.any(String)
            },
            statusCode: 200,
            statusText: "Success!"
        });

        await existingUser.deleteOne({ email: existingUser.email })
    });

    it('should return 500 if an error occurs', async () => {

        // Mock UserModel.findOne to throw an error
        UserModel.findOne = jest.fn().mockRejectedValueOnce(new Error('Test error'));

        // Mock Request
        const req = { body: { email: "test@email.com" } } as Request;

        // Mock Response
        const res = mockResponse()

        // Run Component
        await Login(req, res);

        // Expected Result
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(
            { count: 0, success: false, data: null, statusCode: 500, statusText: 'Something error occured, please contact administrator!' }
        );
    });

})