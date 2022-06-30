import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Offer } from '../interfaces/offer';

@Injectable({
  providedIn: 'root'
})
export class OffersService {

  private offers: Offer[] = [];


/*   private offers: Offer[] = [
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
 */
  //offersSubject: Subject<Offer[]> = new Subject();
  offersSubject: BehaviorSubject<Offer[]> = new BehaviorSubject(<Offer[]>[]);

  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) {
    //this.getOffersOn(); // Pour écouter les MàJ en BDD
  }

  getOffers(): void {

    this.db.list('offers').query.limitToLast(10).once('value', snapshot => {
      const offersSnapshotValue = snapshot.val();
      if(offersSnapshotValue){
        const offers = Object.keys(offersSnapshotValue).map(id => ({id, ...offersSnapshotValue[id]}));
        this.offers = offers;
      }
      this.dispatchOffers();
    });


    /* return new Observable(observer => {
      if(this.offers.length === 0 ){
        observer.error(new Error('Pas d\'offre enregistrée'));
      }
      setInterval(() => {
        observer.next(this.offers);
        //observer.complete();
      }, 1000);
    }) */

  /* return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (this.offers.length === 0){
        reject(new Error('Pas d\'offre enregistrée'));
      }
      resolve(this.offers);
    },2000);
  }); */
  //return this.offers;
  }

  getOffersOn(): void{
    this.db.list('offers').query.limitToLast(10).on('value', snapshot => {
      const offersSnapshotValue = snapshot.val();
      const offers = Object.keys(offersSnapshotValue).map(id => ({id, ...offersSnapshotValue[id]}));
      console.log(offers);
    })
  }

  dispatchOffers(){
    this.offersSubject.next(this.offers);
  }


  async createOffer(offer: Offer, offerPhoto?: any): Promise<Offer>{

    try{
      const photoUrl = offerPhoto ? await this.uploadPhoto(offerPhoto) : '';
      const response = this.db.list('offers').push({...offer, photo: photoUrl});

      const createdOffer = {...offer, photo: photoUrl, id: <string>response.key};
      this.offers.push(createdOffer);
      this.dispatchOffers();

      return createdOffer;
    } catch(error) {
      throw error;
    }

    /* this.offers.push(offer);
    return this.offers; */
  }

  editOffer(offer: Offer, offerId: string): Promise<Offer> {
    return new Promise((resolve, reject) => {
      this.db.list('offers').update(offerId, offer)
      .then(() => {
        const updatedOffer = {...offer, id: offerId};
        const offerToUpdateIndex = this.offers.findIndex(el => el.id === offerId);
        this.offers[offerToUpdateIndex] = updatedOffer;
        this.dispatchOffers();
        resolve({...offer, id: offerId});
      }).catch(reject);
    });
  }

  deleteOffer(offerId: string): Promise<Offer>{
    return new Promise((resolve, reject) => {
      this.db.list('offers').remove(offerId)
      .then(() => {
        const offerToDeleteIndex = this.offers.findIndex(el => el.id === offerId);
        this.offers.splice(offerToDeleteIndex, 1);
        this.dispatchOffers();
      }).catch(console.error);
    })
  }

  private uploadPhoto(photo: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const upload = this.storage.upload('offers/' + Date.now() + '-' + photo.name, photo);
      upload.then((res) => {
        resolve(res.ref.getDownloadURL());
      }).catch(reject);
    });
  }

}
