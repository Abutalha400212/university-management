import { ZodError, ZodIssue } from 'zod';
import { IGenericErrorMesasgeResponse } from '../interfaces/common';
import { IGenericErrorMessage } from '../interfaces/error.interface';
const handleZodError = (error: ZodError): IGenericErrorMesasgeResponse => {
  const errors: IGenericErrorMessage[] = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    };
  });
  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation Error',
    errorMessages: errors,
  };
};

export default handleZodError;
