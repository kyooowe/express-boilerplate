//#region Import
import { Router } from "express";
import { CreateProducts, FetchAllProducts } from "../../controller/products/products.controller";
import { AuthChecker } from "../../middleware/auth.middleware";
//#endregion

//#region Action
const ProductsRouter = Router()
ProductsRouter.post('/', AuthChecker, CreateProducts)
ProductsRouter.get('/', AuthChecker, FetchAllProducts)
//#endregion

export { ProductsRouter }