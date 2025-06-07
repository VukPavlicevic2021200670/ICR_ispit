export interface Proizvod {
    id: number;
    name: string;
    cena: number;
    tag: Array<string>;
    kolekcija: string;
    slika: string;
    reviews: number[];
}