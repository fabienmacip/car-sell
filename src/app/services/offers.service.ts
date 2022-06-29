import { Injectable } from '@angular/core';
import { Offer } from '../interfaces/offer';

@Injectable({
  providedIn: 'root'
})
export class OffersService {

  private offers: Offer[] = [
    {
      title: 'Nouvelle annonce',
      brand: 'SUZUKI',
      model: 'Bandit 600 S',
      description: 'rouge',
      price: 2500
    },
    {
      title: '2ème annonce',
      brand: 'YAMAHA',
      model: 'Fazer 6',
      description: 'grise',
      price: 2200
    }
  ];

  constructor() { }

  getOffers(): Offer[] {
    return this.offers;
  }

  createOffer(offer: Offer): Offer[]{
    this.offers.push(offer);
    return this.offers;
  }

  editOffer(offer: Offer, index: number): Offer[]{
    this.offers[index] = offer;
    return this.offers;
  }

  deleteOffer(offerIndex: number): Offer[]{
    this.offers.splice(offerIndex, 1);
    return this.offers;
  }

}
