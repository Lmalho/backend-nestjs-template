export declare type AppErrorDetails =
  | string
  | string[]
  | Record<string, unknown>;

export class AppError extends Error {
  constructor(
    public errorCode: string,
    name: string,
    message: string,
    public details?: AppErrorDetails,
  ) {
    super(message);
    this.name = name;
  }
}
