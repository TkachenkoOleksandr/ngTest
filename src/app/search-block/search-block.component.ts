import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import {IAppState} from '../store';
import { Actions } from "../actions";

class SearchTerms {
  constructor(
    public textTerm: string='', 
    public priorityTerm: string='',
    public categoryTerm: string[] = []
  ) {}
}

@Component({
  selector: 'app-search-block',
  templateUrl: './search-block.component.html',
  styleUrls: ['./search-block.component.scss']
})
export class SearchBlockComponent implements OnInit {
  @select((s:IAppState) => s.categories) categories$;
  selectedCategories: string[] = [];

  textTerm: string = '';
  priorityTerm: string = '';

  constructor(
    private ngRedux: NgRedux<IAppState>
  ) { }

  ngOnInit() {
  }

  filterBook() {   
    this.ngRedux.dispatch({type: Actions.SEARCH_BOOK, 
      searchTerms: new SearchTerms(this.textTerm, this.priorityTerm, this.selectedCategories)});
  }

  toggleSelectedCategory(categoryName) {
    let index = this.selectedCategories.indexOf(categoryName);
    if(index === -1) {
      this.selectedCategories.push(categoryName)
    } else {
      this.selectedCategories.splice(this.selectedCategories.indexOf(categoryName), 1);
    }
    this.filterBook();
  }

  ifSelected(target: string) {
    return this.selectedCategories.indexOf(target) === -1 ? "btn-primary" : "btn-success";
  }

  resetSearch() {
    this.textTerm = '';
    this.priorityTerm = ''; 
    this.selectedCategories = [];
    this.filterBook();
  }
}
