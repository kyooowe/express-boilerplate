//#region Import
import { UserModel } from "../../models/user/user.models";
import { Request, Response } from "express";
import { SingleApiResponse } from "../../helpers/response.helper";
import { IUser } from "../../interface/user/user.interface";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
//#endregion

//#region Action
const Login = async (req: Request, res: Response) => {
    try {

        const email = req.body.email;
        const password = req.body.password

        // Fetch user based on email and password
        const user = await UserModel.findOne<IUser>({ email: email })

        if (!user) {
            res.status(404).json(SingleApiResponse({ success: true, data: null, statusCode: 404 }));
        } else {

            // Check if hash password is equal
            const isPasswordMatch = await bcrypt.compare(password, user.password)

            // Flagger for password
            if (!isPasswordMatch) {
                res.status(404).json(SingleApiResponse({ success: true, data: null, statusCode: 404 }));
            } else {

                const secretKey = process.env.TOKEN_KEY
                const token = jwt.sign({ id: user._id.toString() }, `${secretKey}`, {
                    expiresIn: '2h'
                })

                res.status(200).json(SingleApiResponse({ success: true, data: { user, token: token }, statusCode: 200 }))

            }
        }

    } catch (error: any) {
        res.status(500).json(SingleApiResponse({ success: false, data: null, statusCode: 500 }))
    }
}

export { Login }
//#endregion