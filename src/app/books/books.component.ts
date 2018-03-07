import { Component, OnInit } from '@angular/core';
import { AddBookFormComponent } from "../add-book-form/add-book-form.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Book } from "../models/book";
import { Priority } from "../models/priority";

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  showAddBookModal() {    
    const modalRef = this.modalService.open(AddBookFormComponent);    
  }

}
