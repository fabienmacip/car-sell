import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, OnChanges {

  @Input() currentUser!: User;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

}
