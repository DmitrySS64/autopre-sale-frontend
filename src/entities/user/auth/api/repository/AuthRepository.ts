import {BaseRepository} from "@shared/api/http/BaseRepository.ts";
import type {IAuthRepository} from "../../interface/repository/IAuthRepository.ts";
import type {IGetMeDto, IRegisterDto, ISignInDto} from "@entities/user/auth/interface/dto";
import {EAuthAPI} from "@shared/enum/query";
import type {IRegisterPort, ISignInPort} from "@entities/user/auth/interface/port";
import type {ICookieService} from "@shared/services/cookie/ICookieService.ts";
import {CookieService} from "@shared/services/cookie/CookieService.ts";
import {ECookieKey} from "@shared/services/cookie/ECookieKey.ts";

const isStub: boolean = false

const stubUser: IRegisterDto = {
    user: {
        id: '1',
        email: '123@gmail.com',
        fullName: 'Иванов И.И.',
    },
    accessToken: 'stub-token',
    refreshToken: 'stub-refresh-token',
}

class AuthRepository extends BaseRepository implements IAuthRepository {
    private readonly _cookieService: ICookieService = new CookieService();

    public async getMe(): Promise<IGetMeDto> {
        if (isStub) {
            // Для stub тоже используем cookies
            this._cookieService.set(ECookieKey.ACCESS_TOKEN, 'stub-token');
            return Promise.resolve(stubUser.user)
        }

        // HttpService автоматически добавит токен из cookies
        return this._httpService.get<IGetMeDto>(EAuthAPI.GET_ME);
    }

    public async register(port: IRegisterPort): Promise<IRegisterDto> {
        if (isStub) {
            this._cookieService.set(ECookieKey.ACCESS_TOKEN, 'stub-token');
            return Promise.resolve(stubUser)
        }

        const result = await this._httpService.post<IRegisterDto>(EAuthAPI.REGISTER, {body: port});

        // Сохраняем токены в cookies
        if (result.accessToken) {
            this._cookieService.set(ECookieKey.ACCESS_TOKEN, result.accessToken, {
                expires: 1 / 24, // 1 час (access token)
                path: '/',
                secure: true,
                sameSite: 'strict'
            });
        }
        if (result.refreshToken) {
            this._cookieService.set(ECookieKey.REFRESH_TOKEN, result.refreshToken, {
                expires: 7, // 7 дней (refresh token)
                path: '/',
                secure: true,
                sameSite: 'strict'
            });
        }
        return result;
    }

    public async signIn(port: ISignInPort): Promise<ISignInDto> {
        if (isStub) {
            this._cookieService.set(ECookieKey.ACCESS_TOKEN, 'stub-token');
            return Promise.resolve(stubUser);
        }

        const result = await this._httpService.post<ISignInDto>(EAuthAPI.SIGN_IN, { body: port });

        if (result.accessToken) {
            this._cookieService.set(ECookieKey.ACCESS_TOKEN, result.accessToken, {
                expires: 1 / 24, // 1 час
                path: '/',
                secure: true,
                sameSite: 'strict'
            });
        }
        if (result.refreshToken) {
            this._cookieService.set(ECookieKey.REFRESH_TOKEN, result.refreshToken, {
                expires: 7, // 7 дней
                path: '/',
                secure: true,
                sameSite: 'strict'
            });
        }
        return result;
    }

    public async signOut(): Promise<void> {
        if (isStub) {
            this._cookieService.remove(ECookieKey.ACCESS_TOKEN);
            this._cookieService.remove(ECookieKey.REFRESH_TOKEN);
            return Promise.resolve();
        }

        // await this._httpService.post<void>(EAuthAPI.SIGN_OUT);
        this._cookieService.remove(ECookieKey.ACCESS_TOKEN);
        this._cookieService.remove(ECookieKey.REFRESH_TOKEN);
    }
}

export {AuthRepository}