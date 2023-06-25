import mongoose from 'mongoose';
import { IGenericErrorMessage } from '../interfaces/error.interface';
import { IGenericErrorMesasgeResponse } from '../interfaces/common';
import httpStatus from 'http-status';
const handleValidationError = (
  error: mongoose.Error.ValidationError
): IGenericErrorMesasgeResponse => {
  const errors: IGenericErrorMessage[] = Object.values(error.errors).map(
    (el: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: el.path,
        message: el.message,
      };
    }
  );

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: 'Validation Error',
    errorMessages: errors,
  };
};

export default handleValidationError;
