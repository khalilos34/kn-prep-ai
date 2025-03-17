type handlerFunction = (...args: any[]) => Promise<any>;

interface IvalidationError {
  message: string;
}

const extractErrors = (error: any) => {
  if (error.name === "ValidationError") {
    return {
      message: Object.values<IvalidationError>(error?.errors)
        .map((err) => err.message)
        .join(", "),
      statusCode: 400,
    };
  }
  if (error?.response?.data?.message) {
    return { message: error?.response?.data?.message, statusCode: 400 };
  }
  if (error?.message) {
    return { message: error.message, statusCode: 400 };
  }
  return {
    message: "internal server error",
    statusCode: 500,
  };
};
export const catchAsyncErrors =
  (handler: handlerFunction) =>
  async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error: any) {
      const { message, statusCode } = extractErrors(error);
      return {
        error: { statusCode, message },
      };
    }
  };
