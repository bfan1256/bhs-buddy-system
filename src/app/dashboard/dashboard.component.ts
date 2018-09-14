import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../interfaces/user.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  user: User;
  constructor(private _auth: AuthService) {
    setTimeout(() => {
      _auth.user.subscribe((user: User) => {
        this.isLoading = false;
        this.user = user;
      });
    }, 800);
  }

  ngOnInit() {
  }

  signOut() {
    this._auth.signOut();
  }

}
