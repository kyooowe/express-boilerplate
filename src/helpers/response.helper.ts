import { IResponse } from "../interface/response.interface";

const StatusCodeChecker = (statusCode: number) => {
    if(statusCode === 200)
        return 'Success!'
    if(statusCode === 400)
        return 'Bad Request!'
    if(statusCode === 401)
        return 'Please authenticate'
    if(statusCode === 404)
        return 'Not Found!'
    if(statusCode === 500)
        return 'Something error occured, please contact administrator!'
}

// For multiple data response
const ApiResponse = ({ success, data, statusCode }: IResponse) => {
    return {
        count: data === null || data === undefined ? 0 : data.length,
        success: success,
        data: data,
        statusCode: statusCode,
        statusText: StatusCodeChecker(statusCode)
    }
}

// For single data response
const SingleApiResponse = ({ success, data, statusCode}: IResponse) => {
    return {
        count: data === null || data === undefined ? 0 : 1,
        success: success,
        data: data,
        statusCode: statusCode,
        statusText: StatusCodeChecker(statusCode)
    }
}

export { SingleApiResponse, ApiResponse }