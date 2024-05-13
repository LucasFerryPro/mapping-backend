import * as express from "express";
import {Express, Request, Response} from "express";
import {AppRouter} from "./AppRouter";
import {BaseController} from "./base/BaseController";
import * as cookieParser from "cookie-parser";
import {Server, createServer} from "http";

export class AppServer {

    private server?: Server;
    private app?: Express;
    private port?: number;
    private authMiddleware?: (req: Request, res: Response) => Promise<boolean>;

    private constructor() {
    }

    public static createServer(data: {
        controllers: (typeof BaseController)[],
        authMiddleware?: (req: Request, res: Response) => Promise<boolean>
    }): AppServer {
        const appServer = new AppServer();

        // Create express app
        appServer.app = express();

        // Create http server
        appServer.server = createServer(appServer.app);

        // Create router
        const router = AppRouter.createRouter(data.authMiddleware);

        // Disable x-powered-by
        appServer.app.disable('x-powered-by');

        // Set proxy
        appServer.app.set('trust proxy', [
            'loopback',
            'linklocal',
            'uniquelocal'
        ]);

        // Parsers
        appServer.app.use(express.json());
        appServer.app.use(express.urlencoded({extended: false}));

        // Add cookie parser
        appServer.app.use(cookieParser());

        // Use router
        appServer.app.use(router.getRouter());

        // Load controllers
        router.loadControllers(data.controllers);

        return appServer;
    }

    public setPublicFolder(data: { path: string, uri?: string }): void {
        if (!this.app) {
            throw new Error('App not initialized');
        }
        if (data.uri) {
            this.app.use(data.uri, express.static(data.path));
        } else {
            this.app.use(express.static(data.path));
        }
    }

    public listen(port: number): Promise<void> {
        if (!this.app) {
            throw new Error('App not initialized');
        }
        this.port = port;
        return new Promise((resolve) => {
            this.server.listen(port, () => {
                resolve();
            });
        });
    }

    public get serverInstance(): Server {
        return this.server;
    }

}