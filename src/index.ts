import {Container, Inject, Service} from "typedi";
import {DataBaseService} from "./services/DataBaseService";
import {config} from "dotenv";
import {existsSync} from "fs";
import {join} from "path";
import {HttpService} from "./services/HttpService";
import {Logger} from "./services/Logger";

// Read the config file
config();
if (existsSync(join(__dirname, "../.env.local")))
    config({path: join(__dirname, "../.env.local"), override: true});

@Service()
export class App {

    constructor() {
        Logger.log("APP", "Initializing app...");
    }

    @Inject()
    private dataBaseService: DataBaseService;

    @Inject()
    private httpService: HttpService;

    async start() {
        await this.dataBaseService.init();
        await this.httpService.init();
    }

}

Container.get(App).start().then();