import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  cars = [
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
  ]


  yes = 0;

  displayText = false;

  text = "Un essai";
  onClickButton(): void {
    console.log("Tu as cliqué, "+this.yes+"ème fois !");
    this.yes++;

    this.text = this.text === '' ? "Hello world !" : '';
  }

  onClickFirstButton(): void {
    this.displayText = !this.displayText;
  }
}
