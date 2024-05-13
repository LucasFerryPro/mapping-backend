import {Method} from "./Method";
import {Request, Response} from "express";

export interface Route {
    path: string;
    method: Method;
    handler: (req: Request, res: Response) => void;
    handlerName: string;
    authRequired: boolean;
    allowedRoles?: string[];
}