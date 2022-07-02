import { Injectable, resolveForwardRef } from '@angular/core';
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

  getOfferById(offerId: string): Promise<Offer>{
    return new Promise((resolve, reject) => {
      this.db.database.ref(`offers/${offerId}`).once('value',(snapshot, err) => {
        if(err){
          reject(err);
        }
        resolve(snapshot.val());
      })
    })
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

  async editOffer(offer: Offer, offerId: string, newOfferPhoto?: any): Promise<Offer> {
    try {

      if(newOfferPhoto && offer.photo && offer.photo !== ''){
        await this.removePhoto(offer.photo);
      }
      if(newOfferPhoto){
        const newPhotoUrl = await this.uploadPhoto(newOfferPhoto);
        offer.photo = newPhotoUrl;
      }
      await this.db.list('offers').update(offerId, offer);
      const offerIndexToUpdate = this.offers.findIndex(el => el.id === offerId);
      this.offers[offerIndexToUpdate] = {...offer, id: offerId};
      this.dispatchOffers();
      return {...offer, id: offerId};

    } catch (error) {
      throw error;
    }


/*     return new Promise((resolve, reject) => {
      this.db.list('offers').update(offerId, offer)
      .then(() => {
        const updatedOffer = {...offer, id: offerId};
        const offerToUpdateIndex = this.offers.findIndex(el => el.id === offerId);
        this.offers[offerToUpdateIndex] = updatedOffer;
        this.dispatchOffers();
        resolve({...offer, id: offerId});
      }).catch(reject);
    }); */
  }

  async deleteOffer(offerId: string): Promise<Offer>{

    try {
      const offerToDeleteIndex = this.offers.findIndex(el => el.id === offerId);
      const offerToDelete = this.offers[offerToDeleteIndex];

      if(offerToDelete.photo && offerToDelete.photo !== ''){
        await this.removePhoto(offerToDelete.photo);
      }
      await this.db.list('offers').remove(offerId);
      this.offers.splice(offerToDeleteIndex, 1);
      this.dispatchOffers();

      return offerToDelete;
    } catch(error) {
      throw error;
    }
  }

  private uploadPhoto(photo: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const upload = this.storage.upload('offers/' + Date.now() + '-' + photo.name, photo);
      upload.then((res) => {
        resolve(res.ref.getDownloadURL());
      }).catch(reject);
    });
  }

  private removePhoto(photoUrl: string): Promise<any>{
    return new Promise((resolve, reject) => {
      this.storage.refFromURL(photoUrl).delete().subscribe({
        complete: () => resolve({}),
        error: reject
      })
    })
  }

}
