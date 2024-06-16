import { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";

export default class Authenticator {
  public static async authenticate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const secret = req.headers.secret;
      console.log({ secret });

      const secretBuff = await fs.readFile(
        path.join(__dirname, "../../secretkey.pem")
      );
      const secretKey = secretBuff.toString().replace(/\n/g, "");
      console.log({ secretKey });

      if (secret !== secretKey)
        throw { status: 403, error: "You are not allowed here!" };

      next();
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
}
