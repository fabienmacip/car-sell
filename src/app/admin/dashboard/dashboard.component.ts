import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
/* import { ActivatedRoute } from '@angular/router'; */

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  offerForm!: FormGroup;

  offers: any[] = [];

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
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
/*     const carId = this.activatedRoute.snapshot.paramMap.get('id');
    setTimeout(() => {
      this.currentCar = this.cars2.find(el => el.id === +<string>carId)
    }, 1000); */
    this.initOfferForm();
  }

  initOfferForm(): void {
    this.offerForm = this.formBuilder.group({
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
    this.offers.push(this.offerForm.value);
    this.offerForm.reset();
    console.log(this.offers);
  }
}
