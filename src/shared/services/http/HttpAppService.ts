import {HttpService} from "./HttpService";

const DEFAULT_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const HTTP_APP_SERVICE = new HttpService({
    baseURL: DEFAULT_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
})

export { HTTP_APP_SERVICE }