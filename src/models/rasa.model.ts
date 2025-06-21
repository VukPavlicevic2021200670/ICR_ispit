import {PetModel} from "./pet.model";

export interface RasaModel {
   recipient_id: string
   image: string | null
   attachment: PetModel[] | null
   text: string | null
}