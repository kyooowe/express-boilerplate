//#region Import
import { ProductsModel } from "../../models/products/products.models";
import { Request, Response } from "express";
import { ApiResponse, SingleApiResponse } from "../../helpers/response.helper";
import { CustomRequest } from "../../interface/request.interface";
//#endregion

//#region Action
const FetchAllProducts = async (req: Request, res: Response) => {
    try {
        
        // Decoded userId in token
        const userId = (req as CustomRequest)
    
        // Fetch then Return
        const products = await ProductsModel.find()
        res.status(200).json(ApiResponse({success: false, data: products, statusCode: 200}))

    } catch(err: any) {
        res.status(500).json(SingleApiResponse({success: false, data: null, statusCode: 500}))
    }
}

const CreateProducts = async (req: Request, res: Response) => {
    
    try {
        
        // Create new products
        const products = new ProductsModel({
            name: req.body.name,
            type: req.body.type
        });

        // Save then Return the latest
        const newProducts = await products.save();
        res.status(200).json(SingleApiResponse({success: false, data: newProducts, statusCode: 200}))

    } catch(err: any) {
        res.status(500).json(SingleApiResponse({success: false, data: null, statusCode: 500}))
    }
}
//#endregion 

export { FetchAllProducts, CreateProducts }