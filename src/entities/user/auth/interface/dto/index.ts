interface IBaseUserDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    token: string;
}

type IRegisterDto = IBaseUserDto
type ISignInDto = IBaseUserDto
type IGetMeDto = IBaseUserDto
type IUserDto = IBaseUserDto

export type {IRegisterDto, IGetMeDto, IUserDto, ISignInDto}

