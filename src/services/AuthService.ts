import {Inject, Service} from "typedi";
import {Request, Response} from "express";
import {UserService} from "./UserService";
import {ViewId} from "../models/ViewId";

@Service()
export class AuthService {

    @Inject()
    private userService: UserService;

    async authMiddleware(req: Request, res: Response): Promise<boolean> {
        // Check route needs authentication
        if (req.route.definition && req.route.definition.allowedRoles === undefined) {
            // No authentication needed
            // Grant request
            return true;
        }

        // Check if user is authenticated
        if (req.header("userId") === undefined) {
            // User is not authenticated
            // Deny request
            return false;
        }

        // Load user from database
        const user = await this.userService.getUser(
            parseInt(req.header("userId") as string),
            ViewId.FULL
        );
        // Check if user exists
        if (!user) {
            // User does not exist
            // Deny request
            return false;
        }

        // If user exists, user is authenticated
        // Ignore roles
        // Save user in request
        req.user = user;

        // Allow request
        return true;
    }

}