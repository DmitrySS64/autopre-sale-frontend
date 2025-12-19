import {BaseRepository} from "@shared/api/http/BaseRepository.ts";
import type {IAuthRepository} from "../../interface/repository/IAuthRepository.ts";
import type {IGetMeDto, IRefreshResponse, IRegisterDto, ISignInDto} from "@entities/user/auth/interface/dto";
import {EAuthAPI} from "@shared/enum/query";
import type {IRefreshPort, IRegisterPort, ISignInPort} from "@entities/user/auth/interface/port";
import {IS_STUB as isStub}  from "@shared/api/const";
import type {ICookieService} from "@shared/services/cookie/ICookieService.ts";
import {CookieService} from "@shared/services/cookie/CookieService.ts";
import {ECookieKey} from "@shared/services/cookie/ECookieKey.ts";


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
            return Promise.resolve(stubUser.user)
        }

        // Токен будет автоматически добавлен через HttpService interceptor
        return await this._httpService.get<IGetMeDto>(EAuthAPI.GET_ME);
    }
    public async register(port: IRegisterPort): Promise<IRegisterDto> {
        if (isStub) {
            this._cookieService.set(ECookieKey.ACCESS_TOKEN, stubUser.accessToken);
            this._cookieService.set(ECookieKey.REFRESH_TOKEN, stubUser.refreshToken);
            return Promise.resolve(stubUser);
        }
        const result = await this._httpService.post<IRegisterDto>(EAuthAPI.REGISTER, {body: {
                ...port,
                middleName: port.middleName || null
            }});

        if (result.accessToken) {
            this._cookieService.set(ECookieKey.ACCESS_TOKEN, result.accessToken);
            this._cookieService.set(ECookieKey.REFRESH_TOKEN, result.refreshToken);
        }
        return result;
    }
    public async signIn(port: ISignInPort): Promise<ISignInDto> {
        if (isStub) {
            this._cookieService.set(ECookieKey.ACCESS_TOKEN, stubUser.accessToken);
            this._cookieService.set(ECookieKey.REFRESH_TOKEN, stubUser.refreshToken);
            return Promise.resolve(stubUser);
        }
        const result = await this._httpService.post<ISignInDto>(EAuthAPI.SIGN_IN, { body: port });
        // Сохраняем токен после входа
        if (result.accessToken) {
            this._cookieService.set(ECookieKey.ACCESS_TOKEN, result.accessToken);
            this._cookieService.set(ECookieKey.REFRESH_TOKEN, result.refreshToken);
        }
        return result;
    }

    public async refreshToken(port: IRefreshPort): Promise<IRefreshResponse> {
        if (isStub) {
            const newTokens = {
                accessToken: 'new-stub-access-token',
                refreshToken: 'new-stub-refresh-token'
            };
            this._cookieService.set(ECookieKey.ACCESS_TOKEN, newTokens.accessToken);
            this._cookieService.set(ECookieKey.REFRESH_TOKEN, newTokens.refreshToken);
            return Promise.resolve(newTokens);
        }

        const result = await this._httpService.post<IRefreshResponse>(EAuthAPI.REFRESH_TOKEN, {
            body: port
        });

        if (result.accessToken && result.refreshToken) {
            this._cookieService.set(ECookieKey.ACCESS_TOKEN, result.accessToken);
            this._cookieService.set(ECookieKey.REFRESH_TOKEN, result.refreshToken);
        }
        return result;
    }

    public async signOut(): Promise<void> {
        if (isStub) {
            this._cookieService.remove(ECookieKey.ACCESS_TOKEN);
            this._cookieService.remove(ECookieKey.REFRESH_TOKEN);
            return Promise.resolve();
        }
        //await this._httpService.post<void>(EAuthAPI.SIGN_OUT);
        this._cookieService.remove(ECookieKey.ACCESS_TOKEN);
        this._cookieService.remove(ECookieKey.REFRESH_TOKEN);
    }
}

export {AuthRepository}