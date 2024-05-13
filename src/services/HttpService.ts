import {Inject, Service} from "typedi";
import {AppServer} from "../lib/stack";
import {networkInterfaces} from "node:os";
import * as path from "path";
import {readdir} from "fs/promises";
import {Logger} from "./Logger";
import {AuthService} from "./AuthService";

@Service()
export class HttpService {

    private _appServer: AppServer;

    @Inject()
    private authService: AuthService;

    async init() {
        this._appServer = AppServer.createServer({
            controllers: await this.loadControllers(),
            authMiddleware: this.authService.authMiddleware.bind(this.authService)
        });
        this._appServer.setPublicFolder({
            path: path.resolve(__dirname, "../../public"),
        })
        await this._appServer.listen(parseInt(process.env.PORT || "3000"));

        Logger.log("Http", `Server started on port ${this.listenedIps().map(ip => `http://${ip}:${process.env.PORT || 3000}`).join("\r\n\t\t\t     or ")}`);

    }

    private async loadControllers() {
        const controllersPath = path.resolve(__dirname, "../controllers");
        const controllers = [];
        for (const file of (await readdir(controllersPath))) {
            if (file.endsWith(".js") || file.endsWith(".ts")) {
                const controller = (await import(path.resolve(controllersPath, file)))[file.split(".")[0]];
                controllers.push(controller);
            }
        }
        return controllers;
    }

    private listenedIps() {
        const ips = [];
        const nets = networkInterfaces();
        for (const net of Object.keys(nets)) {
            for (const net2 of nets[net]) {
                // Skip over non-IPv4
                if (net2.family === 'IPv4') {
                    ips.push(net2.address);
                }
            }
        }
        return ips;
    }

    public get appServer(): AppServer {
        return this._appServer;
    }


}