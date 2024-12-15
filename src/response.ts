export enum STATUSCODE {
  OK = 200,
  NO_PROCESSING = 204,
  USER_ERROR = 400,
  NOT_AUTHORIZED = 401,
  METHOD_NOT_FOUND = 404,
  INVALID_INPUTS = 422,
  SERVER_ERROR = 500,
}

export interface ResponseArtifact<T> {
  id: string;
  progress: number;
  statusCode: STATUSCODE;
  responseBody: T;
  isError: boolean;
}
