import {BaseRepository} from "@shared/api/http/BaseRepository.ts";
import type {IAuthRepository} from "../../interface/repository/IAuthRepository.ts";
import type {IGetMeDto, IRegisterDto, ISignInDto} from "@entities/user/auth/interface/dto";
import {EAuthAPI} from "@shared/enum/query";
import type {IRegisterPort, ISignInPort} from "@entities/user/auth/interface/port";
import {ELocalStorageKeys} from "@shared/enum/storage";
//import type {ICookieService} from "@shared/services/cookie/ICookieService.ts";
//import {CookieService} from "@shared/services/cookie/CookieService.ts";
//import {ECookieKey} from "@shared/services/cookie/ECookieKey.ts";

const isStub: boolean = true

const stubUser: IRegisterDto = {
    user: {
        id: '1',
        email: '123@gmail.com',
        fullName: 'Иванов И.И.',
    },
    accessToken: 'stub-token'
}

class AuthRepository extends BaseRepository implements IAuthRepository {
    //private readonly _cookieService: ICookieService = new CookieService();
    public async getMe(): Promise<IGetMeDto> {
        if (isStub) {
            //this._cookieService.set(ECookieKey.ACCESS_TOKEN, 'stub-token');
            return Promise.resolve(stubUser.user)
        }
        const token = localStorage.getItem(ELocalStorageKeys.AUTH_TOKEN);
        if (!token) {
            throw new Error('No authentication token found');
        }
        return await this._httpService.get<IGetMeDto>(EAuthAPI.GET_ME, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
    public async register(port: IRegisterPort): Promise<IRegisterDto> {
        if (isStub) {
            localStorage.setItem(ELocalStorageKeys.AUTH_TOKEN, 'stub-token')
            return Promise.resolve(stubUser)
        }
        const result = await this._httpService.post<IRegisterDto>(EAuthAPI.REGISTER, {body: port});

        if (result.accessToken) {
            localStorage.setItem(ELocalStorageKeys.AUTH_TOKEN, result.accessToken);
        }
        return result;
    }
    public async signIn(port: ISignInPort): Promise<ISignInDto> {
        if (isStub) {
            localStorage.setItem(ELocalStorageKeys.AUTH_TOKEN, 'stub-token');
            return Promise.resolve(stubUser);
        }
        const result = await this._httpService.post<ISignInDto>(EAuthAPI.SIGN_IN, { body: port });
        // Сохраняем токен после входа
        if (result.accessToken) {
            localStorage.setItem(ELocalStorageKeys.AUTH_TOKEN, result.accessToken);
        }
        return result;
    }
    public async signOut(): Promise<void> {
        if (isStub) {
            localStorage.removeItem(ELocalStorageKeys.AUTH_TOKEN);
            return Promise.resolve();
        }
        //await this._httpService.post<void>(EAuthAPI.SIGN_OUT);
        localStorage.removeItem(ELocalStorageKeys.AUTH_TOKEN);
    }
}

export {AuthRepository}