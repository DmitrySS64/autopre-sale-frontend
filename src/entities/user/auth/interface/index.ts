import type {IUserDto} from "@entities/user/auth/interface/dto";

interface User {
    id: string;
    username: string;
    email: string;
}

interface IAuthState {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    user: IUserDto | null;
    setUser: (user: IUserDto | null) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export type { IAuthState, User };