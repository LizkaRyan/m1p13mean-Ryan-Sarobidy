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
    category: {
        code: string;
        label: string;
    }
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
    shopId?: any;
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

export interface ReservationUnpaid {
    _id: string;
    shop: Shop
    shopUser: User,
    room: Room,
    reservationId: string;
    month: string;
    amount: number;
    status: string;
}

interface Category {
  code: string;
  label: string;
}

interface ShopReservation {
  category: Category;
  _id: string;
  name: string;
  userId: string;
}

interface RoomReservation {
  _id: string;
  name: string;
}

export interface Reservation {
  _id: string;
  shopId: ShopReservation;
  roomId: RoomReservation;
  dateMax: string;
}

export interface ReviewData {
  _id: string;
  userId: User;
  shopId: string;
  rating: number;
  text: string;
  createdAt: string;
}