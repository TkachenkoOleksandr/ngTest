import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from "@angular-redux/store";
import { IAppState } from "./store";
import { Actions } from "./actions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Lib-Note';
  hasException: boolean;
  exception: string; 

  @select((s:IAppState) => s.exception) exception$;

  
  constructor(private ngRedux: NgRedux<IAppState>) {    
  }

  ngOnInit() {
    this.exception$.subscribe(ex => {      
      if(ex) {
        this.hasException = true;
        this.exception = ex;
      } else {
        this.hasException = false;
      }
    });
  }
}
