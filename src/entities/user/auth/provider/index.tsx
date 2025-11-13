import {type PropsWithChildren, useCallback, useEffect, useState} from "react";
import { AuthContext } from "../context";
import type {IUserDto} from "@entities/user/auth/interface/dto";
import {useGetMePresenter} from "@entities/user/auth/use-case/get-me/presenter";
import {CookieService} from "@shared/services/cookie/CookieService.ts";
import {ECookieKey} from "@shared/services/cookie/ECookieKey.ts";

function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<IUserDto | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const { data: userData, isLoading, error } = useGetMePresenter()
    const cookieService = new CookieService();


    // 🚪 Выход из аккаунта
    const logout = useCallback(() => {
        cookieService.remove(ECookieKey.ACCESS_TOKEN);
        cookieService.remove(ECookieKey.REFRESH_TOKEN);
        setUser(null);
        setIsAuthenticated(false);
    }, [cookieService]);

    // ⚙️ Установка данных пользователя
    const setAuthData = useCallback((authData: IUserDto | null) => {
        setUser(authData);
        setIsAuthenticated(authData != null);
    }, []);

    // 📡 Проверка токенов при загрузке
    useEffect(() => {
        try {
            const accessToken = cookieService.get(ECookieKey.ACCESS_TOKEN);
            const refreshToken = cookieService.get(ECookieKey.REFRESH_TOKEN);
            if (accessToken && refreshToken) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch {
            setIsAuthenticated(false);
        }
    }, []);

    // 👤 Получаем информацию о пользователе
    useEffect(() => {
        if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
        } else if (error) {
            // Если ошибка 401 или токен недействителен
            cookieService.remove(ECookieKey.ACCESS_TOKEN);
            cookieService.remove(ECookieKey.REFRESH_TOKEN);
            setUser(null);
            setIsAuthenticated(false);
        }
    }, [userData, error, cookieService]);

    if (isLoading) return <div>Загрузка..</div>;

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            setAuthData,
            logout,
            isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}


export {AuthProvider}