import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { AuthService } from "../services/auth.service";
import * as firebase from 'firebase/app';
import { select, NgRedux } from '@angular-redux/store';
import {IAppState} from '../store';
import { Actions } from "../actions";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user: Observable<firebase.User>;
  @select((s:IAppState) => s.user) user$;
  logo: string = "assets/image/beta-logo.png";
  logoRoute: string = "/books";
  userEmail: string;

  isNavbarCollapsed: boolean = true;

  constructor(private authService: AuthService, private ngRedux: NgRedux<IAppState>) { }

  ngOnInit() {   
  }

  logout() {
    this.authService.logout();
    this.ngRedux.dispatch({type: Actions.REMOVE_USER});
    this.logoRoute = "/login"
  }
}
