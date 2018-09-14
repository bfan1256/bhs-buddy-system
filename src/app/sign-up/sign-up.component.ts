import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { EmailPasswordCredentials } from '../interfaces/email-password.interface';
import { questionsAssigned } from '../../../functions/src/index';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: [ './sign-up.component.css' ]
})
export class SignUpComponent implements OnInit {
  isLoading = false;
  password = '';
  userForm: User = {
    firstName: '',
    lastName: '',
    email: '',
    grade: '',
    uid: '',
    questionsAssigned: 0,
    photoURL: ''
  };
  loginType: 'sign-in' | 'sign-up' = 'sign-up';
  constructor(private _auth: AuthService) { }

  ngOnInit() {
  }

  changeLoginType(type: 'sign-in' | 'sign-up') {
    this.loginType = type;
  }

  createAccount() {
    const credentials: EmailPasswordCredentials = { password: this.password, email: this.userForm.email };
    this.isLoading = true;
    this._auth.emailSignUp(credentials, this.userForm).then(() => {
      this.isLoading = false;
    });
  }

  login() {
    const credentials: EmailPasswordCredentials = { password: this.password, email: this.userForm.email };
    this.isLoading = true;
    this._auth.emailLogin(credentials).then(() => {
      this.isLoading = false;
    });
  }

}
