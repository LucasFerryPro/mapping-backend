import 'reflect-metadata';
import {Route} from "./Route";
import {Method} from "./Method";
import {Request, Response} from "express";

export function Path(method: Method, path: string, allowedRoles?: string[]): MethodDecorator {
    return (target, propertyKey): void => {
        if (!Reflect.hasMetadata('routes', target.constructor)) {
            Reflect.defineMetadata('routes', [], target.constructor);
        }
        const routes = Reflect.getMetadata('routes', target.constructor) as Array<Route>;
        let pKey: string;
        if (typeof propertyKey === 'symbol') {
            pKey = propertyKey.toString();
        } else {
            pKey = propertyKey;
        }

        routes.push({
            path: path,
            method: method,
            handler: (target as {
                [key: string]: (req: Request, res: Response) => void
            })[pKey] as (req: Request, res: Response) => void,
            handlerName: pKey,
            authRequired: allowedRoles !== undefined,
            allowedRoles: allowedRoles,
        });
        Reflect.defineMetadata('routes', routes, target.constructor);
    };
}

export function Get(path: string, allowedRoles?: string[]): MethodDecorator {
    return Path(Method.GET, path, allowedRoles);
}

export function Post(path: string, allowedRoles?: string[]): MethodDecorator {
    return Path(Method.POST, path, allowedRoles);
}

export function Put(path: string, allowedRoles?: string[]): MethodDecorator {
    return Path(Method.PUT, path, allowedRoles);
}

export function Delete(path: string, allowedRoles?: string[]): MethodDecorator {
    return Path(Method.DELETE, path, allowedRoles);
}

export function Patch(path: string, allowedRoles?: string[]): MethodDecorator {
    return Path(Method.PATCH, path, allowedRoles);
}

export function Head(path: string, allowedRoles?: string[]): MethodDecorator {
    return Path(Method.HEAD, path, allowedRoles);
}

export function Options(path: string, allowedRoles?: string[]): MethodDecorator {
    return Path(Method.OPTIONS, path, allowedRoles);
}