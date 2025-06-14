import { FlightModel } from "./flight.model"

export interface UserModel {
    email: string
    password: string
    flights: UserOrderModel[]
}

export interface UserOrderModel {
    id: number,
    flight?: FlightModel
    status: 'reserved' | 'paid' | 'canceled'
    rating: 'l' | 'd' | 'na'
    created: string
}