export enum STATUSCODES {
  OK = 200,
  USER_ERROR = 400,
  SERVER_ERROR = 500,
  NO_PROCESSING = 404,
}

export interface ResponseArtifact<T> {
  id: string;
  progress: number;
  statusCode: STATUSCODES;
  responseBody: T;
  isError: boolean;
}
