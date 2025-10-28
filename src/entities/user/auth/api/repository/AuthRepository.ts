import {BaseRepository} from "@shared/api/http/BaseRepository.ts";
import type {IAuthRepository} from "../../interface/repository/IAuthRepository.ts";
import type {IGetMeDto, IRegisterDto, ISignInDto} from "@entities/user/auth/interface/dto";
import {EAuthAPI} from "@shared/enum/query";
import type {IRegisterPort, ISignInPort} from "@entities/user/auth/interface/port";
import {ELocalStorageKeys} from "@shared/enum/storage";


const isStub: boolean = import.meta.env.VITE_IS_STUB ?? false

const stubUser = {
    id: '1',
    email: '123@gmail.com',
    firstName: 'Name',
    lastName: 'LastName',
    token: 'stub-token'
}

class AuthRepository extends BaseRepository implements IAuthRepository {
    public async getMe(): Promise<IGetMeDto> {
        if (isStub) {
            return Promise.resolve(stubUser)
        }
        return this._httpService.post<IGetMeDto>(EAuthAPI.GET_ME);
    }
    public async register(port: IRegisterPort): Promise<IRegisterDto> {
        if (isStub) {
            localStorage.setItem(ELocalStorageKeys.AUTH_TOKEN, 'stub-token')
            return Promise.resolve(stubUser)
        }
        const result = await this._httpService.post<IRegisterDto>(EAuthAPI.REGISTER, {body: port});

        if (result.token) {
            localStorage.setItem(ELocalStorageKeys.AUTH_TOKEN, result.token);
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
        if (result.token) {
            localStorage.setItem(ELocalStorageKeys.AUTH_TOKEN, result.token);
        }
        return result;
    }
    public async signOut(): Promise<void> {
        if (isStub) {
            localStorage.removeItem(ELocalStorageKeys.AUTH_TOKEN);
            return Promise.resolve();
        }
        await this._httpService.post<void>(EAuthAPI.SIGN_OUT);
        localStorage.removeItem(ELocalStorageKeys.AUTH_TOKEN);
    }
}

export {AuthRepository}