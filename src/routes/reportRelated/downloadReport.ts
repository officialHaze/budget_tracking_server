import express, { NextFunction, Request, Response } from "express";
import Parser from "../../apis/Parser";
import fs from "fs";
import FileSaver from "../../apis/FileSaver";

const router = express.Router();

router.get(
  "/:filename",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filename } = req.params;

      const defaultParsedPath = FileSaver.getDefaultPath();

      const fullpath = defaultParsedPath + "/" + filename;

      res.status(200).download(fullpath, (err) => {
        if (err) console.error(err);

        // Remove the file
        fs.unlink(fullpath, (err) => {
          if (err) console.error(err);

          console.log("File removed successfully!");
        });
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);

export default router;
