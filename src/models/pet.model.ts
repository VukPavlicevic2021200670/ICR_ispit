export interface PetModel {
    id: number;
    name: string;
    description: string;
    breed: string;
    origin: string;
    size: string;
    age: number;
    imageUrl: string;
    priceRange: string;
    reviews: ReviewModel[];
}

export interface ReviewModel {
    id: number;
    author: string;
    rating: number;
    comment: string;
    date: string;
}