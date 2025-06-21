import {PetModel} from "./pet.model";

export interface UserModel {
    email: string
    password: string
    pets: UserPetModel[]
}

export interface UserPetModel {
    id: number,
    pet?: PetModel
    status: 'reserved' | 'paid' | 'canceled'
    userRating?: number;
    created: string
}