export enum ErrorCodes {
  DB_VALIDATION = 'DB_VALIDATION',
  JOB_NOT_FOUND = 'JOB_NOT_FOUND',
}

export const ErrorMessages = {
  [ErrorCodes.JOB_NOT_FOUND]: 'job was not found',
};
