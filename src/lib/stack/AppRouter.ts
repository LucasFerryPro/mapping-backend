import "reflect-metadata";
import {Request, Response, Router} from "express";
import {Route} from "./types/Route";
import {BaseController} from "./base/BaseController";
import {Container, Service} from "typedi";

export class AppRouter {

    private router: Router | undefined;
    private authMiddleware: (req: Request, res: Response) => Promise<boolean>;

    public static createRouter(authMiddleware: (req: Request, res: Response) => Promise<boolean>): AppRouter {
        const appRouter = new AppRouter();
        appRouter.router = Router();
        appRouter.authMiddleware = authMiddleware;
        return appRouter;
    }

    loadControllers(controllers: (typeof BaseController)[]): void {
        const router = this.router;
        if (!router) {
            throw new Error('Router not initialized');
        }

        controllers.forEach((controller) => {
            // Create an instance of the controller
            Service()(controller);
            const instance = Container.get(controller);

            const prefix = Reflect.getMetadata('prefix', controller);
            if (!prefix) {
                throw new Error('Controller prefix not defined: ' + controller.name);
            }

            // Create new router for this controller and assign it to the controller
            const controllerRouter = Router();
            Reflect.defineMetadata('router', controllerRouter, controller);

            const routes: Route[] = Reflect.getMetadata('routes', controller);

            routes.forEach((route) => {

                controllerRouter[route.method](route.path, async (req, res) => {

                    // Set the controller instance to the request
                    req.route = {
                        ...req.route,
                        definition: route,
                    }

                    // Check auth
                    if (!await this.authMiddleware(req, res)) {
                        res.status(401).json({
                            message: 'Unauthorized',
                        });
                        return;
                    }

                    // Call the controller handler
                    instance[route.handlerName](req, res);
                });
            });

            // Use the controller router
            router.use(prefix, controllerRouter);
        });
    }

    getRouter(): Router {
        if (!this.router) {
            throw new Error('Router not initialized');
        }
        return this.router;
    }

}