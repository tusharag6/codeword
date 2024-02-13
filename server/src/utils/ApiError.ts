class ApiError extends Error {
  statusCode: number;
  errors: string[]; 
  stack: string;
  message: string;
  constructor(
    statusCode: number,
    message = "Something went wrong",
    errors: any[] = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.stack = stack;
    this.message=message;
  }
}
export {ApiError}
