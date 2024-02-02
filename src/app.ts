import * as chalk from "chalk";
import { RunalyzeServiceProvider } from "./runalyze.service.provider";

// redirect console.warn and console.error to console.log colored with chalk
console.warn = (data: unknown) => console.log(chalk.yellow(data));
console.error = (data: unknown) => console.log(chalk.red(data));

const appEnv = process.env.APP_ENV ?? "local";
require("dotenv").config({ path: `${process.cwd()}/env/${appEnv}.env` });

(async () => {
    console.log("Starting runalyze uploader");

    try {
        if (process.argv.length < 3) {
            console.warn("Usage: npm run start <full-path>");
            throw new Error("Missing full path");
        }
        console.log(`Uploading ${process.argv[2]}`);

        const provider = new RunalyzeServiceProvider();
        await provider.assertPing();
        await provider.upload(process.argv[2]);
    } catch (error) {
        console.error(error);
    }
})();
