import {Controller, Get} from "../lib/stack";
import {Request, Response} from "express";
import {ViewId} from "../models/ViewId";

@Controller("/poi")
export class PoIController {

    @Get("/", ["user"])
    public async getAll(req: Request, res: Response) {
        return "Hello World";
    }

    @Get("/:id", ["user"])
    public async getOne(req: Request, res: Response) {
        if(req.header("viewId")?.toLowerCase() === ViewId.FULL) {

        } else {

        }
        return "Hello World";
    }



}