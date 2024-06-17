import { NextFunction, Request, Response } from "express";

export default class RouteErrorHandler {
  public static exec(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const errStatus = err.status ?? 500;
    const errMessage = err.error ?? err.message ?? "Server error!";

    res.status(errStatus).json({ message: errMessage });
  }
}
