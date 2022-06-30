import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Offer } from 'src/app/interfaces/offer';
import { OffersService } from 'src/app/services/offers.service';
/* import { ActivatedRoute } from '@angular/router'; */

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  offerForm!: FormGroup;

  offers: Offer[] = [];

  subscription!: Subscription;

  currentOfferPhotoFile!: any;
  currentOfferPhotoUrl!: string;

  /* cars2 = [
    {
      id: 0,
      brand: 'Renault',
      model: 'Laguna',
      color: 'blue'
    },
    {
      id: 1,
      brand: 'Peugeot',
      model: '508',
      color: 'red'
    },
    {
      id: 2,
      brand: 'Opel',
      model: 'Astra',
      color: 'grey'
    },
    {
      id: 3,
      brand: 'Renault',
      model: 'Safari',
      color: 'green'
    }
  ];
 */
/*   currentCar: any; */

  constructor(
    /* private activatedRoute: ActivatedRoute */
    private formBuilder: FormBuilder,
    private offersService: OffersService
  ) { }

  ngOnInit(): void {
/*     const carId = this.activatedRoute.snapshot.paramMap.get('id');
    setTimeout(() => {
      this.currentCar = this.cars2.find(el => el.id === +<string>carId)
    }, 1000); */
    this.initOfferForm();
    //this.offers = this.offersService.getOffers();
    this.subscription = this.offersService.offersSubject
    .subscribe({
      next: (offers: Offer[]) => {

        this.offers = offers
      },
/*       complete: () => {
        console.log('Observable complété');
      }, */
      error: (error) => { console.error(error);}
    });

    this.offersService.getOffers();
    /* .then((offers: Offer[]) => {
      this.offers = offers;
    }).catch((error) => {
      console.error(error);
    }).finally(() => {
      console.log('C\'est ok');
    }); */
  }

  initOfferForm(): void {
    this.offerForm = this.formBuilder.group({
      id: [null],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      photo: [],
      brand: '',
      model: '',
      description: '',
      price: 0
    });
  }

/*   onSubmitOfferForm(form: NgForm): void {
    console.log(form.value);
  }
 */
  onSubmitOfferForm(): void {
    /* console.log(this.offerForm.value); */
    const offerId = this.offerForm.value.id;
    let offer = this.offerForm.value;

    const offerPhotoUrl = this.offers.find(el => el.id === offerId)?.photo;
    offer = {...offer, photo: offerPhotoUrl};

    if(!offerId || offerId && offerId === ''){ // CREATION
      delete offer.id;
      //this.offers.push(offer);
      this.offersService.createOffer(offer, this.currentOfferPhotoFile)
      .catch(console.error);
    }
    else { // MODIFICATION
      delete offer.id;
      //this.offers[offerIndex] = offer;
      this.offersService.editOffer(offer, offerId, this.currentOfferPhotoFile).catch(console.error);
    }

    //this.offers.push(this.offerForm.value);
    this.offerForm.reset();
    this.currentOfferPhotoFile = null;
    this.currentOfferPhotoUrl = '';
  }

  onChangeOfferPhoto($event: any): void{

    this.currentOfferPhotoFile = $event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(this.currentOfferPhotoFile);
    fileReader.onloadend = (e) => {
      this.currentOfferPhotoUrl = <string>e.target?.result;
    }
  }

  onEditOffer(offer: Offer): void{
    this.currentOfferPhotoUrl = offer.photo ? offer.photo : '';
    this.offerForm.setValue({
      id: offer.id ? offer.id : '',
      title: offer.title ? offer.title : '',
      photo: '',
      brand: offer.brand ? offer.brand : '',
      model: offer.model ? offer.model : '',
      price : offer.price ? offer.price : 0,
      description: offer.description ? offer.description : ''
    });
  }

  onDeleteOffer(offerId?: string): void{
    //this.offers.splice(index, 1);
    if(offerId){
      this.offersService.deleteOffer(offerId).catch(console.error);
    } else {
      console.error('Un id doit être fourni pour effacer');
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
