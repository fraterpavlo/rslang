export interface IRoute {
    name: string;
    component: () => void;
}

export interface IUserData {
    name: string;
    email: string;
    password: string;
}