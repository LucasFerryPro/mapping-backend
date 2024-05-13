import {Controller, Get, Post, Put} from "../lib/stack";
import {Request, Response} from "express";
import {ViewId} from "../models/ViewId";
import {Inject} from "typedi";
import {UserService} from "../services/UserService";
import {HttpStatus} from "../lib/stack/types/HttpStatus";

@Controller("/user")
export class UserController {

    @Inject()
    private userService: UserService;

    @Get("/:id", ["user"])
    public async getOne(req: Request, res: Response) {
        try {
            console.log(req.user)
            const user = await this.userService.getUser(
                parseInt(req.params.id),
                (req.header("viewId") || ViewId.SIMPLE)?.toLowerCase()
            );
            if(!user) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    message: "User not found"
                });
            }
            return res.status(HttpStatus.OK).json(user);
        } catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: e.message,
            });
        }
    }

    @Post("/")
    public async create(req: Request, res: Response) {
        return "Hello World";
    }

    @Get("/me", ["user"])
    public async getMe(req: Request, res: Response) {
        res.status(HttpStatus.OK)
            .json(req.user);
    }

    @Get("/me/whereami", ["user"])
    public async whereAmI(req: Request, res: Response) {
        return "Hello World";
    }

    @Put("/me/whereami", ["user"])
    public async updateWhereAmI(req: Request, res: Response) {
        return "Hello World";
    }

}