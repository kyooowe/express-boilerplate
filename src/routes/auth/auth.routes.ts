//#region Import
import { Router } from "express";
import { Login } from "../../controller/authentication/login.controller";
import { ForgotPassword } from "../../controller/authentication/forgotPassword.controller";
//#endregion

//#region Action
const AuthenticationRouter = Router()
AuthenticationRouter.post('/login', Login)
AuthenticationRouter.post('/forgotPassword', ForgotPassword)
//#endregion

export { AuthenticationRouter }