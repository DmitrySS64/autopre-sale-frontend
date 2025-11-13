interface IUserDto {
    id: string;
    email: string;
    fullName: string;
}

interface IBaseUserDto {
    user: IUserDto;
    accessToken: string;
    refreshToken: string;
}

type IRegisterDto = IBaseUserDto
type ISignInDto = IBaseUserDto
type IGetMeDto = IUserDto

export type {IRegisterDto, IGetMeDto, IUserDto, ISignInDto}

