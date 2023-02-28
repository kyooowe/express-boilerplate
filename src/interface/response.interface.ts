interface IResponse {
    success: boolean;
    data: any | null;
    statusCode: number;
}

export type { IResponse }