import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Offer } from 'src/app/interfaces/offer';
import { OffersService } from 'src/app/services/offers.service';
/* import { ActivatedRoute } from '@angular/router'; */

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  offerForm!: FormGroup;

  offers: Offer[] = [];

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
    this.offers = this.offersService.getOffers();
  }

  initOfferForm(): void {
    this.offerForm = this.formBuilder.group({
      index: [0],
      title: ['', [Validators.required, Validators.maxLength(100)]],
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
    const offerIndex = this.offerForm.value.index;
    let offer = this.offerForm.value;
    if(offerIndex == null || offerIndex == undefined){
      delete offer.index;
      //this.offers.push(offer);
      this.offers = this.offersService.createOffer(offer);
    }
    else {
      delete offer.index;
      //this.offers[offerIndex] = offer;
      this.offers = this.offersService.editOffer(offer, offerIndex);
    }

    //this.offers.push(this.offerForm.value);
    this.offerForm.reset();
    console.log(this.offers);
  }

  onEditOffer(offer: Offer, index:number): void{
    this.offerForm.setValue({...offer, index});
  }

  onDeleteOffer(index: number): void{
    //this.offers.splice(index, 1);
    this.offers = this.offersService.deleteOffer(index);
  }

}
