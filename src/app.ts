import * as chalk from "chalk";
import { readdir, stat } from "fs/promises";
import { RunalyzeServiceProvider } from "./runalyze.service.provider";

// redirect console.warn and console.error to console.log colored with chalk
console.warn = (data: unknown) => console.log(chalk.yellow(data));
console.error = (data: unknown) => console.log(chalk.red(data));

const appEnv = process.env.APP_ENV ?? "local";
require("dotenv").config({ path: `${process.cwd()}/env/${appEnv}.env` });

const buildFilesToUpload = async (srcLocation: string): Promise<string[]> => {
    console.log(`Source location is: ${srcLocation}`);
    const curStat = await stat(srcLocation);
    if (curStat.isDirectory()) {
        const files = await readdir(srcLocation);
        return files.filter((x) =>
            ["gpx", "tcx", "fit"].includes(x.substring(x.length - 3, x.length))
        );
    }
    return [srcLocation];
};

(async () => {
    console.log("Starting runalyze uploader");

    try {
        // source location defaults to /uploads if is not passed as argument
        const srcLocation =
            process.argv.length < 3
                ? `${process.cwd()}/uploads`
                : process.argv[2];

        const filesToUpload = await buildFilesToUpload(srcLocation);
        if (filesToUpload.length === 0) {
            console.warn("No files to uploads");
            return;
        }
        const provider = new RunalyzeServiceProvider();
        await provider.assertPing();

        for (const fileToUpload of filesToUpload) {
            console.log(`Uploading ${fileToUpload}`);
            await provider.upload(fileToUpload);
        }
    } catch (error) {
        console.error(error);
    }
})();
