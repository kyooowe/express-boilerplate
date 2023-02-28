//#region Import
import { ForgotPassword } from "../forgotPassword.controller";
import { UserModel } from "../../../models/user/user.models";
import bcrypt from 'bcrypt';
import { Request } from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import { MailerHelper } from "../../../helpers/mailer.helper";
//#endregion

// Loads variable in .env file
dotenv.config();

// Mock NodeMailer
jest.mock('../../../helpers/mailer.helper.ts', () => ({
    MailerHelper: {
        Mailer: jest.fn(),
    },
}));

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

        // eslint-disable-next-line
        const res: any = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    it('should returns a 404 status code when user is not found', async () => {

        // Create request object
        const req = {
            body: {
                email: 'nonexistentuser@test.com',
            }
        };

        // Create mock response
        const res = mockResponse()

        // Run Forgot Password Component
        await ForgotPassword(req as Request, res);

        // Expected Result
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ count: 0, success: true, data: null, statusCode: 404, statusText: "Not Found!" });
    });

    it('should generate and save new password', async () => {

        // Create user and mock as existing
        const existingUser = new UserModel({
            email: 'existinguser@test.com',
            password: await bcrypt.hash('password123', 8),
            lastName: "existing",
            firstName: "existing",
            middleName: "existing"
        });
        await existingUser.save();

        // Spy on mongoose function
        jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(existingUser);
        jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce(existingUser);

        // Create Request
        const req = { body: { email: existingUser.email } };

        // Mock Response
        const res = mockResponse();

        // Run Componment
        await ForgotPassword(req as Request, res)

        // Expected Result
        expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
            { email: existingUser.email },
            expect.objectContaining({ password: expect.any(String) })
        );
        expect(res.json).toHaveBeenCalledWith({
            count: 1,
            success: true,
            data: expect.anything(),
            statusCode: 200,
            statusText: "Success!"
        });

        await existingUser.deleteOne({ email: existingUser.email })
    });

    it('should send an email with the new password to the user', async () => {

        // Mock Request
        const req = {
            body: {
                email: "existinguser@test.com",
            }
        };

        // Mock Response
        const res = mockResponse()

        // User Object
        const user = { email: "existinguser@test.com" }

        // Spy on mongoose function
        jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(user);
        jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce(user);

        // Run Component
        await ForgotPassword(req as Request, res);

        //  Expected Result
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            count: 1,
            success: true,
            data: expect.anything(),
            statusCode: 200,
            statusText: "Success!"
        });
        expect(MailerHelper.Mailer).toHaveBeenCalledWith({
            from: "your@email.com",
            to: user.email,
            subject: "New Password",
            text: "Hello this is your new password",
            html: expect.any(String)
        });

    });

    it('should return 500 if an error occurs', async () => {

        // Mock UserModel.findOne to throw an error
        UserModel.findOne = jest.fn().mockRejectedValueOnce(new Error('Test error'));

        // Mock Request
        const req = { body: { email: "test@email.com" } } as Request;

        // Mock Response
        const res = mockResponse()

        // Run Component
        await ForgotPassword(req, res);

        // Expected Result
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(
            { count: 0, success: false, data: null, statusCode: 500, statusText: 'Something error occured, please contact administrator!' }
        );
    });
})