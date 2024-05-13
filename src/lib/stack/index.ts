import {Controller} from "./types/Controller";
import {Delete, Get, Head, Options, Patch, Path, Post, Put} from "./types/Path";
import {AppServer} from "./AppServer";
import {AppRouter} from "./AppRouter";
import {User} from "../../models/User";

declare global {
    namespace Express {
        export interface Request {
            user?: User;
        }
    }
}

export {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Patch,
    Options,
    Head,
    Path,
    AppServer,
    AppRouter,
};