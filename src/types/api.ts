export interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
}

export interface Role {
    code: string;
    label: string;
}

export interface LoginResponse {
    token: string;
    user: {id: string; role: string};
}