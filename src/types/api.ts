import { title } from "process";

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

export interface Shop {
    _id: string;
    name: string;
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

export interface EventData {
    _id?: string;
    title: string;
    startDate: string;
    endDate: string;
    description: string;
    createdAt: string;
    themes: string[];
    color: string;
}

export interface RequestEvent {
    _id?: string;
    title: string;
    startDate: string;
    endDate: string;
    description: string;
    createdAt: string;
    themes: string[];
    color: string;
    shopId: Shop;
    status: { code: string; label: string, date: string };
}

export interface EventAndRequest {
    events: EventData[];
    requests: RequestEvent[];
}

export interface ReservationStat {
    _id: string;
    totalPaid: number;
    totalUnpaid: number;
}