import type { IDated } from "./strapi";

export interface IAuthRes {
    jwt: string;
    user: IUser;
}

export interface IUser extends IDated {
    id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
}

export interface IStrapiAuth {
    id: number;
    username: string;
    email: string;
}

export type IAuthSuccess = IStrapiAuth & {
    isAuth: true,
}

export interface IAuthError {
    isAuth: false,
}

export type IAuthResult = IAuthSuccess | IAuthError;