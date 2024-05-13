export class Logger {

    static log(service: string, message: string): void {
        console.log(`\x1b[36m[${service.toUpperCase()}]\x1b[0m ${message}`);
    }

    static error(service: string, message: string): void {
        console.error(`\x1b[31m[${service.toUpperCase()}]\x1b[0m ${message}`);
    }

    static warn(service: string, message: string): void {
        console.warn(`\x1b[33m[${service.toUpperCase()}]\x1b[0m ${message}`);
    }

    static debug(service: string, message: string): void {
        if (process.env.NODE_ENV === "development")
            console.debug(`\x1b[35m[${service.toUpperCase()}]\x1b[0m ${message}`);
    }

}