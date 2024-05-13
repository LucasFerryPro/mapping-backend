import {Inject} from "typedi";
import {DbService} from "../../../services/DbService";
import {Collection, ObjectId} from "mongodb";
import {Delete, Get, Post, Put} from "../types/Path";
import {Request, Response} from "express";
import {Role} from "../../../models/Role";
import {User} from "../../../models/User";

export class RestController<model> {

    @Inject()
    protected dbService: DbService;

    private readonly collectionName: string;

    private readonly allowedRoles: Role[] | undefined;

    constructor(collectionName: string, allowedRoles?: Role[]) {
        this.collectionName = collectionName;
        this.allowedRoles = allowedRoles;
    }

    private get _collection(): Collection {
        return this.dbService.db.collection(this.collectionName);
    }

    async get(skip: number = 0, limit: number = 10, sort_by: string, sort_order: 1 | -1, search?: string): Promise<model[]> {
        if (search) {
            // If sort_by equals "score", throw an error
            if (sort_by === "score") {
                throw new Error("Cannot sort by score when searching");
            }

            return (await this._collection.find({
                $text: {
                    $search: search
                }
            }, {
                projection: {
                    score: {
                        $meta: "textScore"
                    }
                }
            }).sort({
                score: {
                    $meta: "textScore"
                },
                [sort_by]: sort_order
            }).skip(skip).limit(limit).toArray()) as model[];
        }
        return (await this._collection.find().sort(sort_by, sort_order).skip(skip).limit(limit).toArray()) as model[];
    }

    async count(search?: string): Promise<number> {
        if (search) {
            return await this._collection.countDocuments({
                $text: {
                    $search: search
                }
            });
        }
        return await this._collection.countDocuments();
    }

    async getById(id: string): Promise<model> {
        return (await this._collection.findOne({
            _id: new ObjectId(id)
        })) as model;
    }

    async create(object: model): Promise<ObjectId> {
        return (await this._collection.insertOne(object)).insertedId;
    }

    async update(id: string, object: model): Promise<ObjectId> {
        return (await this._collection.updateOne({
            _id: new ObjectId(id)
        }, {
            $set: object
        })).upsertedId;
    }

    async delete(id: string): Promise<void> {
        await this._collection.deleteOne({
            _id: new ObjectId(id)
        });
    }

    protected userCanAccess(req: Request, res: Response, allowedRoles?: Role[]): boolean {
        const unauthorized = () => {
            res.status(403).send({
                message: "You are not authorized to access this resource"
            });
            return false;
        }
        if (!allowedRoles) allowedRoles = this.allowedRoles;
        if (!allowedRoles) return true;
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return unauthorized();
        }
        return true;
    }

    @Get("/")
    async restGet(req: Request, res: Response) {
        if (!this.userCanAccess(req, res)) return;
        const skip = parseInt(req.query.skip as string || "0");
        const limit = parseInt(req.query.limit as string || "10");
        const sort_by = req.query.sort_by as string || "_id";
        const sort_order = parseInt(req.query.sort_order as string || "1") as 1 | -1;
        const search = req.query.search as string;

        if (sort_order !== 1 && sort_order !== -1) {
            res.status(400).send({
                message: "sort_order must be 1 or -1"
            });
            return;
        }

        res.send(await this.get(skip, limit, sort_by, sort_order, search));
    }

    @Get("/count")
    async restCount(req: Request, res: Response) {
        if (!this.userCanAccess(req, res)) return;
        const search = req.query.search as string;
        res.json(await this.count(search));
    }

    @Get("/:id")
    async restGetById(req: Request, res: Response) {
        if (!this.userCanAccess(req, res)) return;
        res.send(await this.getById(req.params.id));
    }

    @Post("/")
    async restCreate(req: Request, res: Response) {
        if (!this.userCanAccess(req, res)) return;
        res.status(201).send(await this.create(req.body as model));
    }

    @Put("/:id")
    async restUpdate(req: Request, res: Response) {
        if (!this.userCanAccess(req, res)) return;
        res.status(200).send(await this.update(req.params.id, req.body as model));
    }

    @Delete("/:id")
    async restDelete(req: Request, res: Response) {
        if (!this.userCanAccess(req, res)) return;
        await this.delete(req.params.id);
        res.status(200).send();
    }


}