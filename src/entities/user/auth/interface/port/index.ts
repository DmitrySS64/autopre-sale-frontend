interface IRegisterPort {
    firstName: string
    lastName: string
    middleName: string | null
    email: string
    password: string
}

interface ISignInPort {
    email: string,
    password: string
}

export type {IRegisterPort, ISignInPort}