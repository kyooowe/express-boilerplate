//#region Import
import crypto from 'crypto'
import { Request, Response } from "express";
import { UserModel } from "../../models/user/user.models";
import { SingleApiResponse } from "../../helpers/response.helper";
import { IUser } from '../../interface/user/user.interface';
import bcrypt from 'bcrypt'
import { MailerHelper } from '../../helpers/mailer.helper';

const { Mailer } = MailerHelper
//#endregion

const ForgotPassword = async (req: Request, res: Response) => {
    try {

        // Get email in request body
        const email = req.body.email;

        // Find user using email
        const user = await UserModel.findOne<IUser>({ email: email })

        // Flagger
        if (!user)
            res.status(404).json(SingleApiResponse({ success: true, data: null, statusCode: 404 }))
        else {

            // Recomended hash = 8
            const saltRounds = 8

            // Generate Random Password
            const randomPassword = crypto.randomBytes(20).toString('hex')
            const newPassword = await bcrypt.hash(randomPassword, saltRounds)

            // Update then save
            const updatedUser = await UserModel.findOneAndUpdate<IUser>({ email: email }, { password: newPassword })

            // Flagger
            if (updatedUser !== null) {

                // Send email
                await Mailer({
                    from: "your@email.com",
                    to: updatedUser.email,
                    subject: "New Password",
                    text: "Hello this is your new password",
                    html: `Password: <b>${randomPassword}</b>`
                })
                res.status(200).json(SingleApiResponse({ success: true, data: updatedUser, statusCode: 200 }))
            }
        }

    } catch (err: any) {
        res.status(500).json(SingleApiResponse({ success: false, data: null, statusCode: 500,  }))
    }
}

export { ForgotPassword }