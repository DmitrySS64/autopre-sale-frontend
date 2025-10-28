import {type PropsWithChildren, useCallback, useEffect, useState} from "react";
import { AuthContext } from "../context";
import type {IUserDto} from "@entities/user/auth/interface/dto";
import {AuthRepository} from "@entities/user/auth/api/repository/AuthRepository.ts";
import {HTTP_APP_SERVICE} from "@shared/services/http/HttpAppService.ts";
import {ELocalStorageKeys} from "@shared/enum/storage";


function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<IUserDto | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem(ELocalStorageKeys.AUTH_TOKEN);
        setUser(null);
        setIsAuthenticated(false)
    }, [])

    const checkAuth = useCallback(async () => {
        const token = localStorage.getItem(ELocalStorageKeys.AUTH_TOKEN);
        if (!token) {
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
        }
        try {
            const repository = new AuthRepository(HTTP_APP_SERVICE);
            const userData = await repository.getMe();
            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Auth check failed:', error);
            logout();
        } finally {
            setIsLoading(false);
        }
    }, [logout])

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isLoading) return <div>Загрузка..</div>;

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    )
}


export {AuthProvider}