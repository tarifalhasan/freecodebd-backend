import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  //  wrong mongodb id error

  if (err.name === "CastError") {
    const message = `Resource not found INvalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //   Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} extered`;
    err = new ErrorHandler(message, 400);
  }

  //   wrong jwt token

  if (err.name === "JsonWebTokenError") {
    const message = "Json web token is not valid try again";
    err = new ErrorHandler(message, 400);
  }

  //   jwt expire error

  if (err.name === "TokenExpiredError") {
    const message = "json web token is expired, try again";
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
