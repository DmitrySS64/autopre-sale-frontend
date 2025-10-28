import type {IGetMeDto, IRegisterDto, ISignInDto} from "@entities/user/auth/interface/dto";
import type {IRegisterPort, ISignInPort} from "@entities/user/auth/interface/port";

interface IAuthRepository {
    getMe(): Promise<IGetMeDto>
    register(port: IRegisterPort): Promise<IRegisterDto>
    signIn(port: ISignInPort): Promise<ISignInDto>
    signOut(): Promise<void>
}

export type {IAuthRepository}