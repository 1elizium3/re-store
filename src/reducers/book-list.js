const updateBookList = (state, action) => {

  if (state === undefined) {
    return {
      books: [],
      loading: true,
      error: null,
    }
  };

  switch (action.type) {
    case 'FETCH_BOOKS_REQUEST':
      return {
        // ...state, // Удаляю state. Функ. оаботает с BookList, глобальный state не нужен
        books: [],
        loading: true,
        error: null
      };

    case 'FETCH_BOOKS_SUCCESS':
      return {
        // ...state,
        books: action.payload,
        loading: false,
        error: null
      };

    case 'FETCH_BOOKS_FAILURE':
      return {
        // ...state,
        books: [],
        loading: false,
        error: action.payload
      };

    default: 
      return state.bookList;
  };
};

export default updateBookList;