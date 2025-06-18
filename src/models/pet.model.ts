// pet.model.ts
export interface PetModel {
    id: number;
    name: string;
    description: string;
    breed: string;
    origin: string;
    size: string; // Could be enum: 'Small', 'Medium', 'Large'
    age: number;
    imageUrl: string;
    priceRange: string; // Could be enum: '$', '$$', '$$$', '$$$$'
    reviews: ReviewModel[];
}

export interface ReviewModel {
    id: number;
    author: string;
    rating: number;
    comment: string;
    date: string; // or Date
}