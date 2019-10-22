import { AxiosRequestConfig, AxiosResponse } from "../types";
export declare class AxiosError extends Error {
    isAxiosError: boolean;
    congif: AxiosRequestConfig;
    code?: null | string;
    request?: any;
    response?: AxiosResponse;
    constructor(message: string, config: AxiosRequestConfig, code?: string | null, request?: any, response?: AxiosResponse);
}
export declare function CreateError(message: string, config: AxiosRequestConfig, code?: string | null, request?: any, response?: AxiosResponse): AxiosError;
