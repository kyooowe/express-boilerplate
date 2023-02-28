//#region Import
import { model, Schema } from "mongoose";
import { IUser } from "../../interface/user/user.interface";
//#endregion

//#region Schema and Model
const userSchema = new Schema<IUser>({
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    middleName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateCreated: { type: Date, required: true, default: Date.now },
    createdBy: { type: Number, required: true, default: 1 },
    dateUpdated: { type: Date, required: true, default: Date.now },
    updatedBy: { type: Number, required: true, default: 1 },
})

const UserModel = model<IUser>('User', userSchema)
//#endregion

export { UserModel };


