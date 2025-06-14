import { Injectable } from '@angular/core';
import { PetModel } from '../models/pet.model';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MockapiService {

    private pets: PetModel[] = [
        {
            id: 1,
            name: 'Max',
            breed: 'Golden Retriever',
            age: 3,
            imageUrl: 'https://placedog.net/500?id=1'
        },
        {
            id: 2,
            name: 'Mia',
            breed: 'Persian Cat',
            age: 2,
            imageUrl: 'https://placekitten.com/500/500'
        },
        {
            id: 3,
            name: 'Luna',
            breed: 'Beagle',
            age: 4,
            imageUrl: 'https://placedog.net/500?id=2'
        }
    ];

    public getPets(): Observable<PetModel[]> {
        return of(this.pets).pipe(delay(500)); // simulate network delay
    }

    public getPetById(id: number): Observable<PetModel | undefined> {
        const pet = this.pets.find(p => p.id === id);
        return of(pet).pipe(delay(300));
    }

    public getPetImage(pet: PetModel): string {
        return pet.imageUrl || 'https://img.pequla.com/pets/default.jpg';
    }
}
