export interface User {
    _id: string;
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
    user: { _id: string; role: string };
}

export interface Room {
    _id: string;
    name: string;
    rentPrice: number;
    status: Status;
    floor: number,
    capacity: number,
    dimensions: Dimension,
}

export interface Status {
    code: string;
    label: string;
}

export interface Dimension {
    length: number;
    height: number;
    width: number;
    area: number;
}