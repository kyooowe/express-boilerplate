//#region Import
import { IBase } from "../base.interface";
//#endregion

interface IProducts extends IBase {
    name: string;
    type: string;
}

export type { IProducts }