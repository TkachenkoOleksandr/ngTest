import { IUser } from "./interfaces/iuser.interface";
import { IBook } from "./interfaces/ibook.interface";
import { Actions } from "./actions";
import { tassign } from 'tassign';
import {Priority} from './models/priority';

export interface IAppState {
	user: IUser,
	books: IBook[],
	categories: string[],
	lastUpdate: Date,
	filteredBooks: IBook[],
	editedBook: IBook,
	exception: string
}

export const INITIAL_STATE: IAppState = {
	user: null,
	books: [],
	categories: [],
	lastUpdate: new Date(),
	filteredBooks: [],
	editedBook: null,
	exception: null
};

export function rootReducer(state, action) {
	switch(action.type) {
		case Actions.ADD_BOOK:
			//action.book.id = state.books.length + 1;
			return tassign(state, {
				books: state.books.concat(tassign({},action.book)),
				lastUpdate: new Date()
			});
		case Actions.REMOVE_BOOK:
			return tassign(state, {
				books: state.books.filter(b => b.key !== state.editedBook.key),
        		filteredBooks: state.filteredBooks.filter(b => b.key !== state.editedBook.key),
				lastUpdate: new Date()
			});	
		case Actions.LOAD_BOOKS:
			return tassign(state, {
			  	books: action.books,
					filteredBooks: action.books
			});
		case Actions.SEARCH_BOOK:
			return tassign(state,{
						filteredBooks: filterBooks(action, state),
						lastUpdated: new Date()
			});

		case Actions.LOAD_CATEGORIES:
			return tassign(state, {
				categories: action.categories
			});
		case Actions.ADD_CATEGORY:
			return tassign(state, {
				categories: state.categories.concat(tassign({},action.category)),
				lastUpdate: new Date()
			});
		case Actions.REMOVE_CATEGORY:
			var index = state.categories.indexOf(action.category);
			return tassign(state, {
				categories: [
					...state.categories.slice(0, index),
					...state.categories.slice(index+1)
				],
				lastUpdated: new Date()
			});


		case Actions.ADD_EDITED_BOOK:
			return tassign(state, {
				editedBook: action.editedBook
			});
		case Actions.REMOVE_EDITED_BOOK:
			return tassign(state, {
				editedBook: null
			});
		case Actions.LOAD_USER:
			return tassign(state, {
				user: action.user
			});
		case Actions.REMOVE_USER:
			return tassign(state, {
				user: null
			});

		case Actions.ADD_EXCEPTION:
			return tassign(state, {
				exception: action.exception
			});
		case Actions.REMOVE_EXCEPTION:		
			return tassign(state, {
				exception: null
			});

	}

	return state;
}


function filterBooks(action, state) {

	let priorityFilteredBooks = action.searchTerms.priorityTerm.length > 0
			? state.books.filter(book => book.priority === action.searchTerms.priorityTerm)
			: state.books;

	let textFilteredBooks = action.searchTerms.textTerm.length > 0
			? priorityFilteredBooks.filter(
					item => item.title.toLowerCase().search(action.searchTerms.textTerm.toLowerCase()) !== -1
					|| item.author.toLowerCase().search(action.searchTerms.textTerm.toLowerCase()) !== -1
			)
			: priorityFilteredBooks;


	let categoryFilteredBooks = action.searchTerms.categoryTerm.length > 0
			? textFilteredBooks.filter(book => compareArray(book.categories, action.searchTerms.categoryTerm))
			: textFilteredBooks;

  return categoryFilteredBooks;
}


function compareArray(arr1: string[], arr2: string[]) {
	if(!arr1 || !arr2) return false;
	return arr1.some(r => arr2.indexOf(r) !== -1);
}


