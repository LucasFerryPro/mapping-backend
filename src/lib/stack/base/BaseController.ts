export class BaseController {

    protected static getControllerName(): string {
        return this.name.replace('Controller', '');
    }

}