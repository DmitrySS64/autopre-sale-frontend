import {HttpService} from "./HttpService";

const DEFAULT_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

const HTTP_APP_SERVICE = new HttpService({
    baseURL: DEFAULT_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

export { HTTP_APP_SERVICE }