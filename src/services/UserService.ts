import {Inject, Service} from "typedi";
import {User} from "../models/User";
import {DataBaseService} from "./DataBaseService";
import {ViewId} from "../models/ViewId";

@Service()
export class UserService {

    @Inject()
    private dbService: DataBaseService;

    async getUser(id: number, viewId: string): Promise<User> {
        return await this.dbService.dataSource.getRepository(User).findOne({
            where: {
                id
            },
            select: {
                id: true,
                firstname: true,
                lastname: true,
                job: viewId === ViewId.FULL,
                phone: viewId === ViewId.FULL,
                linkedin: viewId === ViewId.FULL,
            },
            relations: {
                currentPoI: viewId === ViewId.FULL,
            }
        });
    }

}