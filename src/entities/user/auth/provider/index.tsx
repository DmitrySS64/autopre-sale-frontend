import {type PropsWithChildren, useCallback, useEffect, useState} from "react";
import { AuthContext } from "../context";
import type {IUserDto} from "@entities/user/auth/interface/dto";
import {useGetMePresenter} from "@entities/user/auth/use-case/get-me/presenter";
import {CookieService} from "@shared/services/cookie/CookieService.ts";
import {ECookieKey} from "@shared/services/cookie/ECookieKey.ts";

const cookieService = new CookieService();

function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<IUserDto | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const { data: userData, isLoading, error } = useGetMePresenter()

    const logout = useCallback(() => {
        cookieService.remove(ECookieKey.ACCESS_TOKEN);
        cookieService.remove(ECookieKey.REFRESH_TOKEN);
        setUser(null);
        setIsAuthenticated(false)
    }, [])

    const setAuthData = useCallback((authData: IUserDto| null)=> {
        setUser(authData);
        setIsAuthenticated(authData != null);
    }, [])

    useEffect(() => {
        if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
        } else if (error) {
            setIsAuthenticated(false);
            setUser(null);
        }
    }, [userData, error]);

    if (isLoading) return <div>Загрузка..</div>;

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, setAuthData, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}


export {AuthProvider}