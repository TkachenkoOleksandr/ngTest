import { Component, OnInit, Input } from '@angular/core';
import { NgRedux } from "@angular-redux/store";
import { IAppState } from "../store";
import { Actions } from "../actions";

@Component({
  selector: 'app-exception',
  templateUrl: './exception.component.html',
  styleUrls: ['./exception.component.scss']
})
export class ExceptionComponent implements OnInit {
  @Input() errorMessage: string;

  constructor(private ngRedux: NgRedux<IAppState>) { }

  ngOnInit() {
  }

  removeException() {   
    this.ngRedux.dispatch({type: Actions.REMOVE_EXCEPTION});
  }

}
