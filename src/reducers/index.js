import updateBookList from './book-list';
import updateShoppingCart from './shopping-cart';

const reducer = (state, action) => {
  return {
    bookList: updateBookList(state, action),
    shoppingCart: updateShoppingCart(state, action)
  }

  // switch (action.type) {    
  //   case 'FETCH_BOOKS_REQUEST':
  //   case 'FETCH_BOOKS_SUCCESS':
  //   case 'FETCH_BOOKS_FAILURE':
  //     return {
  //       ...state,
  //       bookList: updateBookList(state, action)
  //     };

  //   case 'BOOK_ADDED_TO_CART':
  //   case 'BOOK_REMOVED_FROM_CART':
  //   case 'ALL_BOOKS_REMOVED_FROM_CART':
  //     return {
  //       ...state,
  //       shoppingCart: updateShoppingCart(state, action)
  //     }
  //   default:
  //     return state;
  
};

export default reducer;