export interface ISigninUser {
    email: string;
    password: string;
}

export interface ICreateUser {
    name: string;
    email: string;
    password: string;
}

export interface ILocalSt {
    message: string;
    token: string;
    refreshToken: string;
    userId: string;
};