import { Proizvod } from '../../proizvodi/proizvodi.model';

export interface Order {
  proizvod: Proizvod;
  quantity: number;
  status: 'u toku' | 'pristigo' | 'otkazano';
  review?: number;
  reviewed: boolean;
}
