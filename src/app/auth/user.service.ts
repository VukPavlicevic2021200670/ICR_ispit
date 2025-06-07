import { Injectable } from "@angular/core";
import { KorpaService } from "../korpa/korpa.service";

export interface User {
    id: number;
    email: string;
    password: string;
    date: Date;
    address?: string;
}

@Injectable()
export class UserService {
    currentUser: User | null = null;

    constructor(private korpaService: KorpaService) {}

    static dummyUserList: Array<User> = [
        {
            id: 0,
            email: "vuk.pavlicevic.21@singimail.rs",
            password: "11111111",
            date: new Date("2024-04-18 14:23")
        }
    ];

    getUserName(user: User): string {
        return user.email;
    }

    getUserById(id: number): User | null {
        const foundUser = UserService.dummyUserList.find(user => user.id === id) || null;
        if (foundUser) {
            this.currentUser = foundUser;
        }
        return foundUser;
    }

    getUser(userEmail: string): User | null {
        const foundUser = UserService.dummyUserList.find(user => user.email === userEmail) || null;
        if (foundUser) {
            this.currentUser = foundUser;
        }
        return foundUser;
    }

    isPasswordCorrect(userEmail: string, password: string): boolean {
        return !!UserService.dummyUserList.find(user =>
            user.email === userEmail && user.password === password);
    }

    registerUser(email: string, password: string, date: Date): User {
        const maxId = Math.max(...UserService.dummyUserList.map(user => user.id), 0);
        const id = maxId + 1;
        const newUser: User = { id, email, password, date };
        UserService.dummyUserList.push(newUser);
        this.currentUser = newUser;
        console.log(newUser);
        return newUser;
    }
    logout(): void{
        this.currentUser = null;
        this.korpaService.emptyCart();
    }
}
