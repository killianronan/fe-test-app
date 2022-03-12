import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from '../api.service';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'exads-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})

export class CreateUserComponent implements OnInit {
  form: FormGroup;
  users: any = [];
  usernameToCheck: string = ""
  nameTaken: boolean = false;
  screenWidthThresh = false;
  resizeObservable$: Observable<Event>
  resizeSubscription$: Subscription
  
  constructor(private fb: FormBuilder, private router: Router, private location: Location, private apiService: ApiService) { }

  ngOnInit() {
    this.resizeObservable$ = fromEvent(window, 'resize')
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      if(window.innerWidth<500){
        this.screenWidthThresh = true;
      }
      else{
        this.screenWidthThresh = false;
      }
    });

    this.form = this.fb.group({
      username : new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      firstName : new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastName : new FormControl('', [Validators.minLength(2)]),
      email : new FormControl('', [Validators.required, Validators.email])
    });
    if(this.location.getState()["users"]){
      this.users = this.location.getState()["users"] 
    }
  }

  createNewUser(){
    let body = {
      user:{
        username: this.form.controls["username"].value,
        first_name: this.form.controls["firstName"].value,
        last_name: this.form.controls["lastName"].value,
        email: this.form.controls["email"].value,
        id_status: 1
      }
    }
    this.apiService.postUser(body).subscribe((data) => {
      this.router.navigate(['/users'], { state: { numUsers: this.location.getState()["numUsers"]+1 } })
    })
  }

  onCancel(){
    this.router.navigate(['/users'])
  }

  checkIsUserTaken(){
    //for some reason for username cuccello0 this search does not find the index, returns -1 (this is the first item in the users array)
    let userIndex = this.users.findIndex((item, i) => {
      if(item.username.toString().toLowerCase() === this.usernameToCheck.trim().toLowerCase()) return i
    });

    if(this.form.controls["username"].value.toString().includes("{") || this.form.controls["username"].value.toString().includes("}")
    || this.form.controls["username"].value.toString().includes('"') || this.form.controls["username"].value.toString().includes("[") 
    || this.form.controls["username"].value.toString().includes("]") || this.form.controls["username"].value.toString().includes(".") || this.form.controls["username"].value.toString().includes("!")){
      this.form.controls["username"].setErrors({'hasSpecialChar': true})
    }
    else if(userIndex>0){
      this.form.controls["username"].setErrors({'usernameTaken': true})
      this.nameTaken = true;
    }
    else{
      this.nameTaken = false;
      this.form.controls["username"].markAsUntouched()
    }
  }

  getErrorMessage(type: string) {
    if(type=="username"){
      if (this.form.controls["username"].hasError('required')) {
        return 'You must enter a value';
      }
      else if(this.form.controls["username"].value.length<3){
        return 'Length must be greater than 2 characters';
      }
      else if(this.form.controls["username"].hasError('hasSpecialChar')){
        return 'Username cannot contain the following special characters: {}"[].!'
      }
      else if(this.form.controls["username"].hasError('usernameTaken')){
        return 'Username is already taken';
      }
    }
    else if(type=="firstName"){
      if (this.form.controls["firstName"].hasError('required')) {        
        return 'You must enter a value';
      }
      else if(this.form.controls["firstName"].value.length<2){
        return 'Length must be greater than 1 character';
      }
    }
    else if(type=="lastName"){
      if(this.form.controls["lastName"].value.length<2){
        return 'Length must be greater than 1 character';
      }
    }
    else if(type=="email"){
      if (this.form.controls["email"].hasError('required')) {
        return 'You must enter a value';
      }
      else if(this.form.controls["email"].hasError('email')){
        return 'Not a valid email';
      }
    }
  }
}