//#region Import
import jwt, { Secret } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { SingleApiResponse } from '../helpers/response.helper';
import { CustomRequest } from "../interface/request.interface";
//#endregion

export const AuthChecker = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const secretKey: Secret = `${process.env.TOKEN_KEY}`
        const token = req.header('Authorization')?.replace('Bearer ', '')

        if(!token)
            throw new Error()
        
        // Decode token
        // eslint-disable-next-line
        const decoded = jwt.verify(token, secretKey) as any;

        // Make request as CustomRequest
        // Add decoded token to string propery in CustomRequest
        (req as CustomRequest).id = decoded.id;

        // Run next function
        next();

    } catch(err: unknown) {
        res.status(401).json(SingleApiResponse({ success: false, data: null, statusCode: 401 }))
    }
}   