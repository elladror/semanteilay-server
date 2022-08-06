import { ErrorRequestHandler } from "express";
import CorsError from "./corsError";

const clientErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof CorsError) {
    res.status(400).send({ error: err.message });
  } else {
    next(err);
  }
};

export default clientErrorHandler;
