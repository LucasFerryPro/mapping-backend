import {Service} from "typedi";
import {DataSource} from "typeorm";
import {User} from "../models/User";
import {Poi} from "../models/Poi";

@Service()
export class DataBaseService {

    private _dataSource: DataSource;

    constructor() {
        this._dataSource = new DataSource({
            type: "postgres",
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            synchronize: true,
            logging: false,
            entities: [
                User,
                Poi
            ],
        });
    }

    get dataSource(): DataSource {
        return this._dataSource;
    }

    async init() {
        await this._dataSource.initialize();
    }
}