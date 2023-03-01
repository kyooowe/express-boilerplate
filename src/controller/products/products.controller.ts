//#region Import
import { ProductsModel } from '../../models/products/products.models';
import { Request, Response } from 'express';
import { ApiResponse, SingleApiResponse } from '../../helpers/response.helper';

// eslint-disable-next-line
import { CustomRequest } from '../../interface/request.interface';
//#endregion

//#region Action
const FetchAllProducts = async (req: Request, res: Response) => {
	try {
		// Decoded userId in token
		// const userId = (req as CustomRequest)

		// Fetch then Return
		const products = await ProductsModel.find();
		res.status(200).json(
			ApiResponse({ success: true, data: products, statusCode: 200 })
		);
	} catch (err: unknown) {
		res.status(500).json(
			SingleApiResponse({ success: false, data: null, statusCode: 500 })
		);
	}
};

const CreateProducts = async (req: Request, res: Response) => {
	try {
		const isProductNameExisting = await ProductsModel.findOne({
			name: req.body.name
		});

		if (isProductNameExisting)
			res.status(409).json(
				SingleApiResponse({
					success: true,
					data: null,
					statusCode: 409
				})
			);

		// Create new products
		const product = new ProductsModel({
			name: req.body.name,
			type: req.body.type
		});

		// Save then Return the latest
		const newProduct = await product.save();
		res.status(200).json(
			SingleApiResponse({
				success: true,
				data: newProduct,
				statusCode: 200
			})
		);
	} catch (err: unknown) {
		res.status(500).json(
			SingleApiResponse({ success: false, data: null, statusCode: 500 })
		);
	}
};
//#endregion

export { FetchAllProducts, CreateProducts };
