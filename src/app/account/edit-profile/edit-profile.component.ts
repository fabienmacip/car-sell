import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, OnChanges {

  @Input() currentUser!: User;
  @Output() messageEvent = new EventEmitter<string>();

  usernameForm!: FormGroup;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
      this.initUsernameForm();
  }

  initUsernameForm(): void{
    this.usernameForm = this.formBuilder.group({
      username: ['', [Validators.required]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  onEditUsername(modal: any): void{
    this.usernameForm.get('username')?.setValue(this.currentUser.displayName);
    this.modalService.open(modal, { centered: true});
  }

  onSubmitUsernameForm(): void{
    this.currentUser.updateProfile({displayName: this.usernameForm.value.username})
    .then(() => {
      this.modalService.dismissAll();
    }).catch(console.error);
  }

  // Utilisée pour tester le @Output
  onClick(){
    this.messageEvent.emit('Hello world');
  }

}
