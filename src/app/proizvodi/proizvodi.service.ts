import { Injectable } from '@angular/core';
import { Proizvod } from './proizvodi.model';

@Injectable({
  providedIn: 'root'
})
export class ProizvodService {
  private proizvodi: Proizvod[] = [
    {
        id: 1,
        name: 'Bela majica',
        cena: 200,
        tag: ["Majica", "Casual"],
        kolekcija: 'Prolece 2024',
        slika: "https://lh5.googleusercontent.com/proxy/K6Yl4gKrR8LOdplGWlfiqyURgHKRFYSRa0v6A92wf2U6YHREfWabiky2sez87upweVRV40egXuN69o5rbnp7bbp3YcrwydPpZ7yhX3US",
        reviews: [5,4,4]
      },
      {
        id: 2,
        name: 'Bela kosulja',
        cena: 350,
        tag: ["Formalno", "Kosulja"],
        kolekcija: 'Prolece 2024',
        slika: "https://www.3wisemen.com.au/media/catalog/product/s/2/s20_1022120_1.jpg?optimize=low&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700",
        reviews: [2,1,2]
      },{
        id: 3,
        name: 'Crna kosulja',
        cena: 350,
        tag: ["Formalno", "Kosulja"],
        kolekcija: 'Prolece 2024',
        slika: "https://i5.walmartimages.com/asr/3e518546-8cb2-4009-abd5-d922b320be15.c7444e6f0e2e62fda2bb49a0ac783a74.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
        reviews: [3,3,4]
      },{
        id: 4,
        name: 'Dzemper',
        cena: 430,
        tag: ["Formalno", "Dzemper"],
        kolekcija: 'Jesen 2024',
        slika: "https://www.armyshop.rs/wp-content/uploads/2022/09/dzemper-commando-2.jpeg",
        reviews: [1,5,4]
      },
      {
        id: 5,
        name: 'Pantalone',
        cena: 430,
        tag: ["Formalno", "Pantalone"],
        kolekcija: 'Jesen 2024',
        slika: "https://www.webstaurantstore.com/images/products/large/631799/2218227.jpg",
        reviews: [2,3,2]
      },
      {
        id: 6,
        name: 'Pantalone',
        cena: 500,
        tag: ["Formalno", "Pantalone"],
        kolekcija: 'Jesen 2024',
        slika: "https://www.webstaurantstore.com/images/products/large/631799/2218227.jpg",
        reviews: [1,4,4]
      },
      {
        id: 7,
        name: 'Pantalone',
        cena: 430,
        tag: ["Formalno", "Pantalone"],
        kolekcija: 'Jesen 2024',
        slika: "https://cdn2.propercloth.com/pic_tccp/146394_0ba8bab5a3ae50935a8be4aec42a4944_size3.jpg",
        reviews: [2,1,5]
      },
      {
        id: 8,
        name: 'Pantalone',
        cena: 430,
        tag: ["Formalno", "Pantalone"],
        kolekcija: 'Jesen 2024',
        slika: "https://cdn2.propercloth.com/pic_tccp/147382_2a5aa433ac68f758392a490f6d974cfb_size6.jpg",
        reviews: [5,4,3]
      },
      {
        id: 9,
        name: 'Prsluk',
        cena: 600,
        tag: ["Prsluk", "Casual"],
        kolekcija: 'Prolece 2025',
        slika: "https://remiks.com/media/catalog/product/cache/3a94dccb1b2fbf2ba369a22195785beb/n/p/np0a4gas0411-1_11274.jpg",
        reviews: [1,3,5]
      },
      {
        id: 10,
        name: 'Prsluk',
        cena: 600,
        tag: ["Prsluk", "Casual"],
        kolekcija: 'Prolece 2025',
        slika: "https://remiks.com/media/catalog/product/cache/3a94dccb1b2fbf2ba369a22195785beb/n/p/np0a4gas0411-1_11274.jpg",
        reviews: [2,2,2]
      },
  ];

  getProizvodi(): Proizvod[] {
    return this.proizvodi;
  }
}
