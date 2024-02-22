import { readFile } from "fs/promises";

export class RunalyzeServiceProvider {
    private baseUrl!: string;
    private activitiesUploads!: string;
    private ping!: string;
    private token!: string;

    constructor() {
        this.initViaEnv();
        if (
            !this.baseUrl ||
            !this.activitiesUploads ||
            !this.token ||
            !this.ping
        ) {
            throw new Error("Runalyze service provider init failed");
        }
    }

    private initViaEnv() {
        this.token = process.env.RUNALYZE_PERSONAL_ACCESS_TOKEN ?? "";
        this.baseUrl = process.env.RUNALYZE_BASE_URL ?? "";
        this.activitiesUploads =
            process.env.RUNALYZE_ACTIVITY_UPLOAD_ENDPOINT ?? "";
        this.ping = process.env.RUNALIZE_PING ?? "";
    }

    async assertPing(): Promise<void> {
        const res = await fetch(`${this.baseUrl}/${this.ping}`, {
            method: "GET",
            headers: {
                accept: "*/*",
                token: this.token
            }
        });

        if (!res.ok) {
            throw new Error(`Http status is ${res.status} 😞`);
        }

        try {
            const text = await res.text();
            console.log(text);
        } catch (error) {
            console.error("Fetch text failed", error);
            throw new Error("Fetch text failed");
        }
    }

    async upload(fullFileLocation: string): Promise<void> {
        const parts = fullFileLocation.split("/");
        const filename = parts[parts.length - 1];

        const headers = new Headers();
        headers.append("token", this.token);
        headers.append("Cookie", "lang=en");

        const title =
            process.env.RUNALYZE_ACTIVITY_NAME ??
            new Date().getTime().toString();

        const formdata = new FormData();
        formdata.append("title", title);
        formdata.append("note", "");
        formdata.append("route", "");
        formdata.append("elevation_up_file", "");
        formdata.append("elevation_down_file", "");

        const fileInput = await readFile(fullFileLocation);
        formdata.append("file", new Blob([fileInput]), filename);

        const res = await fetch(`${this.baseUrl}/${this.activitiesUploads}`, {
            method: "POST",
            headers: headers,
            body: formdata,
            redirect: "follow"
        });

        if (!res.ok) {
            throw new Error(`Http status is ${res.status} 😞`);
        }

        try {
            const text = await res.text();
            console.log(text);
        } catch (error) {
            console.error("Fetch text failed", error);
            throw new Error("Fetch text failed");
        }

        console.log("Upload queued successfully 😄");
    }
}
