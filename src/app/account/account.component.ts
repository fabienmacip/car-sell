import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  currentUserSubscription!: Subscription;
  currentUser!: User;

  message!: string;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initCurrentUser();
  }

  initCurrentUser(): void{
    this.currentUserSubscription = this.authService.currentUserSubject.subscribe({
      next: user => this.currentUser = <User>user,
      error: console.error
    });
  }

  onDestroy(): void{
    this.currentUserSubscription.unsubscribe();
  }

  getMessageFromChildComponent(e: string){
    console.log('ACCOUNT COMPONENT -> ',e);
    this.message = e;
  }


}
