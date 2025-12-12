import {HttpService} from "./HttpService";
import {DEFAULT_URL} from "@shared/api/const";

const HTTP_APP_SERVICE = new HttpService({
    baseURL: DEFAULT_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

export { HTTP_APP_SERVICE }