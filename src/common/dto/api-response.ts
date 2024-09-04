import { ApiResponse } from './response.dto';

export const apiSuccess = (
  statusCode: number = 200,
  data: any = null,
  message: string,
): ApiResponse => {
  return new ApiResponse(statusCode, data, message);
};

export const apiFailed = (
  statusCode: number = 500,
  message: string = 'Internal server error',
  error: any = null,
): ApiResponse => {
  return new ApiResponse(statusCode, null, message, error);
};

export const apiGeneral = (
  statusCode: number = 200,
  data: any = null,
  message: string,
  error: any = null,
): ApiResponse => {
  return new ApiResponse(statusCode, data, message, error);
};
