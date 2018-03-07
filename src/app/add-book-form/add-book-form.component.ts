import { Component, OnInit, Input } from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import { IAppState } from "../store";
import { IBook } from "../interfaces/ibook.interface";
import { Priority } from "../models/priority";
import { Actions } from "../actions";
// ng-bootstrap modal
import { NgbActiveModal, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgForm, FormControl } from "@angular/forms/";
import { BookService } from "../services/book.service";
import { BookStatus } from "../models/book-status";
import { EmailNotification } from "../models/emailNotification";
import { IDateModel, ITimeModel } from "../interfaces/idatetimemodel.interfaces";
import { EmailSendingService } from "../services/email-sending.service";
import { UserService } from "../services/user.service";
import { IUser } from "../interfaces/iuser.interface";

@Component({
	selector: 'app-add-book-form',
	templateUrl: './add-book-form.component.html',
	styleUrls: ['./add-book-form.component.scss']
})
export class AddBookFormComponent implements OnInit {
	private TIME_IN_PAST_MESSAGE = 'Time cannot be in the past';
	private SPECIFY_TIME_MESSAGE = 'Please specify the time';

	modalTitle: string;
	isEditMode: boolean;
	editedBook: IBook;
	// keeps properties values of book before editing
	prevBookState: IBook = null;
	model: IBook;   
	@select((s:IAppState) => s.categories) categories$;
	@select((s:IAppState) => s.editedBook) editedBook$;
	date: IDateModel;
	time: ITimeModel = {hour: 0, minute: 0, second: 0};
	isDateValid = true;
	dateErrorMessage = 'Date cannot be in the past';
	isTimeValid = true;
	timeErrorMessage = this.TIME_IN_PAST_MESSAGE;

	newBook: IBook = {
		title: '',
		author: '',
		categories: [],
		priority: Priority.Low,   
		sendNotification: false,
		status: BookStatus.ToRead,
		notes: ''
	};

	userEmail: string;
	userUid: string;
	userName: string;

	@select((s:IAppState) => s.user) user$;

	constructor(
		private ngRedux: NgRedux<IAppState>,    
		public activeModal: NgbActiveModal,
		private bookService: BookService,
		private emailService: EmailSendingService,
		private userService: UserService,
		config: NgbDatepickerConfig
	) { 
		// customize default values of datepickers used by this component tree
		config.minDate = {year: 1900, month: 1, day: 1};
		config.maxDate = {year: 2099, month: 12, day: 31};

		// days that don't belong to current month are not visible
		config.outsideDays = 'hidden';

		// weekends are disabled
		config.markDisabled = (date: NgbDateStruct) => {
			const d = new Date(date.year, date.month - 1, date.day);
			var currentDate = new Date(
				new Date().getFullYear(),
				new Date().getMonth(),
				new Date().getDate()  
			);   
			return currentDate.getTime() > d.getTime();
		};
	}

	ngOnInit() {
		this.editedBook$.subscribe(editedBook => {
			if(editedBook !== null ) { // edit book
				// in order not to show at the table how fields are changing
				this.model = Object.assign({},editedBook);
				this.modalTitle = "Edit Book: " + editedBook.title;
				this.editedBook = editedBook;
				this.prevBookState = editedBook;
				this.isEditMode = true;
				this.date = this.buildDate(this.model.notificationDateTime);
				this.time = this.buildTime(this.model.notificationDateTime);
			} else { // adding new book
				this.model = this.newBook;
				this.modalTitle = "Add New Book";
				this.isEditMode = false;
			}      
		});

		this.user$.subscribe((user: IUser) => {
			this.userEmail = user.email;
			this.userName = user.userName;
			this.userUid = user.userId;
		});
	}

	addBook(addBookForm : NgForm) {
		// is send notification true - validate entered date and time
		if(this.model.sendNotification) {
			if(!this.validateDateTime()) return;
		}
		
		let bookKey: string = '';
		// set notificationDateTime  fro model
		if(this.model.sendNotification && this.date !== null) this.model.notificationDateTime = this.convertToDateTime(this.date, this.time);

		if(this.isEditMode) {			
			// in order to save the same object
			this.editedBook = Object.assign({}, this.model);
			this.bookService.updateBook(this.editedBook);
			bookKey = this.editedBook.key;
		} else {
			bookKey = this.bookService.addBook(this.model);
		}

		if(this.model.sendNotification && this.date !== null) {		
			if(this.isEditMode) {
				this.addUpdateEmailNotification(bookKey, true);
			} else {
				this.addUpdateEmailNotification(bookKey);
			}
		} else {
			// if send notification was true but now is false - delete it from our DB
			if(this.prevBookState && this.prevBookState.sendNotification) {
				this.emailService.deleteNotification(bookKey, this.userUid);
			}
		}

		// reset the form values
		addBookForm.reset();
		// close the modal
		this.activeModal.close('Close click');
		// remove edited book from state
		this.ngRedux.dispatch({type: Actions.REMOVE_EDITED_BOOK});   
	}

	addBookCategory(categoryName: string) {
		if(!categoryName) return;
		this.model.categories = this.model.categories !== undefined ? this.model.categories : [];
		this.model.categories.indexOf(categoryName) === -1 ? this.model.categories.push(categoryName) : null;
	}

	removeBookCategory(categoryName: string) {
		const categoriesArray = this.model.categories;
		categoriesArray.splice(categoriesArray.indexOf(categoryName), 1);
	}


	closeModal() {
		this.ngRedux.dispatch({type: Actions.REMOVE_EDITED_BOOK});
		this.activeModal.close('Close click');
	}
	
	private addUpdateEmailNotification(bookKey: string, isUpdate: boolean = false) {
		if(bookKey && this.userEmail && this.userName && this.userUid) {
			let notification = new EmailNotification(
				this.userEmail, 
				this.userUid, 
				this.userName, 
				bookKey, 
				this.model.title, 
				this.model.author, 
				this.model.notificationDateTime
			);

			// if edit mode - update notification
			if(isUpdate) {
				if(!this.prevBookState.sendNotification) {
					this.emailService.addNotification(notification);
				} else {
					this.emailService.updateNotification(notification);
				}				
			} else {
				this.emailService.addNotification(notification);
			}
			
		}
	}


	private convertToDateTime(date: IDateModel, time: ITimeModel): Date {
		let newDate = new Date(date.year, date.month-1, date.day, time.hour, time.minute, time.second);
		// our api converts to utc automatically. That's why let's send local datetime  
		return newDate;
	}

	private buildDate(dateTime: Date): IDateModel {
		dateTime = new Date(dateTime);   
		let date = {
			year: dateTime.getFullYear(),
			month: dateTime.getMonth() + 1,
			day: dateTime.getDate(),      
		};
		 return date;
	}

	private buildTime(dateTime: Date): ITimeModel {
		dateTime = new Date(dateTime);
		let time = {
			hour: dateTime.getHours(),
			minute: dateTime.getMinutes(),
			second: 0
		};
		return time;
	}

	private validateDateTime(): boolean {	
		this.isDateValid = true;
		this.isTimeValid = true;

		if(!this.model.sendNotification) return;

		let d = new Date(this.date.year, this.date.month - 1, this.date.day);
		var currentDate = new Date(
			new Date().getFullYear(),
			new Date().getMonth(),
			new Date().getDate()  
		);

		if(d.getTime() < currentDate.getTime()) {
			this.isDateValid = false;
		}

		if(isNaN(this.time.hour) || isNaN(this.time.minute)) {
			this.isTimeValid = false;
			this.timeErrorMessage = this.SPECIFY_TIME_MESSAGE;
			return false;
		}

	 let currentDateTime = this.getDate(
		 new Date().getFullYear(),
		 new Date().getMonth(),
		 new Date().getDate(),
		 new Date().getHours(), 
		 new Date().getMinutes()
		);
	 let enteredDateTime= this.getDate(
		this.date.year,
		this.date.month - 1,
		this.date.day,
		this.time.hour, 
		this.time.minute
	 );
	 if(enteredDateTime < currentDateTime) {
		 this.isTimeValid = false;
		 this.timeErrorMessage = this.TIME_IN_PAST_MESSAGE;
	 }

	 if(!this.isDateValid || !this.isTimeValid) {
		 return false;
	 }

	 return true;
	}

	private getDate(year:number, month:number, date: number,hours: number, minutes: number): Date {
		return new Date(
			year,
			month,
			date,
			hours,
			minutes,
			0
		);
	}

 

}


