import type {User} from "@entities/user/auth/interface";

interface IGetMeResponse {
    user: User | null;
}

export type {IGetMeResponse};