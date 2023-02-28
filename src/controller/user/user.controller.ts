//#region Import
import { UserModel } from "../../models/user/user.models";
import { Request, Response } from "express";
import { SingleApiResponse } from "../../helpers/response.helper";
import bcrypt from 'bcrypt'
//#endregion

//#region Action
const CreateUser = async (req: Request, res: Response) => {
    try {
        
        // Recomended hash = 8
        const saltRounds = 8

        // Create new User Model
        const user = new UserModel({
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, saltRounds),
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName
        })

        // Save then Return the latest
        const newAccount = await user.save()
        res.status(200).json(SingleApiResponse({success: false, data: newAccount, statusCode: 200}))

    } catch (error: unknown) {
        res.status(500).json(SingleApiResponse({success: false, data: null, statusCode: 500}))
    }
}

export { CreateUser }
//#endregion