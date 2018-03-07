import { Component, Input } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from "../store";
import { Book } from "../models/book";
import { Actions } from "../actions";
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { BookService } from "../services/book.service";
import { EmailSendingService } from "../services/email-sending.service";
import { UserService } from "../services/user.service";
import { IUser } from "../interfaces/iuser.interface";

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {
  @Input() book;
  @select() editedBook;
  @select((s: IAppState) => s.user) user$;
  userId: string;

  constructor(
    private ngRedux: NgRedux<IAppState>,
    public activeModal: NgbActiveModal,
    private bookService: BookService,
    private emailService: EmailSendingService,
    private userService: UserService
  ) { 
    this.user$.subscribe((user: IUser) => {
      if(user) {
        this.userId = user.userId;
      }
    });
  }

  removeBook() {
    this.emailService.deleteNotification(this.book.key, this.userId);
    this.ngRedux.dispatch({type: Actions.REMOVE_BOOK});
    this.bookService.deleteBook(this.book);
    this.ngRedux.dispatch({type: Actions.REMOVE_EDITED_BOOK});
    this.activeModal.close('Close click');
  }

  cancelRemoval() {
    this.ngRedux.dispatch({type: Actions.REMOVE_EDITED_BOOK});
    this.activeModal.close('Close click');
  }
}
