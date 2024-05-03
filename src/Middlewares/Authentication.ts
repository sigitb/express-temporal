import { NextFunction, Request, Response } from "express";
import ResponseUtil from "../Utils/ResponseUtil";

export const auth = (req: Request, res: Response, next: NextFunction): any => { 
    const response = ResponseUtil.authenticate()
    if (!req.headers.authorization || req.headers.authorization != '064e1388-5312-4a07-81fb-89cc14c2dd2b') {
        return res.status(401).send(response);
    }
    next()
}