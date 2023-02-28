//#region Import
import { model, Schema } from "mongoose";
import { IProducts } from "../../interface/products/products.interface";
//#endregion

//#region Schema and Model
const productsSchema = new Schema<IProducts>({
    name: { type: String, required: true },
    type: { type: String, required: true },
    dateCreated: { type: Date, required: true, default: Date.now },
    createdBy: { type: Number, required: true, default: 1 },
    dateUpdated: { type: Date, required: true, default: Date.now },
    updatedBy: { type: Number, required: true, default: 1 },
})

const ProductsModel = model<IProducts>('Products', productsSchema)
//#endregion

export { ProductsModel };


