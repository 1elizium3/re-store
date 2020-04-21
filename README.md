
-----------Новый проект на React-Redux--------------

---Redux на практике

-Новый проект - онлайн магазин Re-Store

-Будет применяться Redux для управления состоянием приложения

-Re-Store будет использовать mock (имитацию) сервера, чтобы работать 
  с данными, но проект легко использовать с насстоящим сервером



---Инициализация проекта

-Создание проекта

 create-react-app

-Установка зависимостей:

npm install prop-types react-router-dom redux react-redux



---Вспомогательные компоненты

-Большинству приложений необходимы вспомогательные компоненты:
  -ErrorBoundry
  -ErrorIndicator
  -Spinner
  -Контекст (или несколько контекстов)
  -HOC для работы с контекстом (withXyService)

-Эти и другие вспомогательные компоненты лучше создавать сразу
  (до начала работы над основным функционалом приложения)

<!-- app.js -->                                                 <----------
import React, { Component } from 'react';                         
import './app.css'

import ErrorBoundry from '../error-boundry';
import ErrorIndicator from '../error-indicator';
import Spinner from '../spinner';

const App = () => {
  return (
    <div>App</div>
  )
};

export default App;

// export default class App extends Component {

//   state = {
//     hasError: false
//   };

//   componentDidCatch() {
//     this.setState({
//       hasError: true
//     });
//   };

//   render() {

//     if (this.state.hasError) {
//       return <ErrorIndicator />
//     };

//     return (
      
//       <ErrorBoundry>
//         <Spinner />
        
//         <div>
//           hellloo
//         </div>
//       </ErrorBoundry>
//     );  
//   }
// };

<!-- error-indicator.js -->                                 ...........
import React from 'react';

import anonymous from './anonymous.png'
import './error-indicator.css';

// const ErrorIndicator = () => {
//   return (
//     <div>Error</div>
//   )
// };

// export default ErrorIndicator;

const ErrorIndicator = () => {

  return (
    <div className='error-indicator'>
      <img ser={anonymous} alt='error-icon'/>
      <span>
        Something has gone Wrong!
      </span>
      <span>
        (repair has already started)
      </span>
    </div>
  )
};

export default ErrorIndicator;

<!-- error-boundry.js -->                                     ...........
import React, { Component } from 'react';

import ErrorIndicator from '../error-indicator';

export default class ErrorBoundry extends Component {

  state = {
    hasError: false
  };

  componentDidCatch() {
    // debugger;
    this.setState({
      hasError: true
    });
  };

  render() {

    if (this.state.hasError) {
      return <ErrorIndicator />
    }

    return this.props.children
  }
};

<!-- bookstore-service-context.js -->                                 ............
import React from 'react';

const {
  Provider: BookstoreServiceProvider,
  Consumer: BookstoreServiceConsumer
} = React.createContext();

export {
  BookstoreServiceProvider,
  BookstoreServiceConsumer
};

<!-- with-bookstore-service.js -->
import React from 'react';
import { BookstoreServiceConsumer } from '../bookstore-service-context';


const withBookstoreService = () => (Wrapped) =>{

  return (props) => {
    return (
      <BookstoreServiceConsumer>
        {
          (bookstoreService) => {
            return (
              <Wrapped {...props} 
                bookstoreService={bookstoreService} /> )
          }
        }
      </BookstoreServiceConsumer>
    );
  }
};

export default withBookstoreService;                                           <----------



---Redux компоненты

-Для того чтобы создать Redux приложение нужно определить функцию-reducer

-Функции action-creator'ы не обязательно использовать, но на практике
  они присутствуют всегда

-Логику создания store удобно вынести в отдельный файл (код инициализации
  store станет немного сложнее в будущем)

<!-- reducer/index.js -->                                                      <-------

const initialState = {
  books: []
};

const reducer = (state = initialState, action) => {

  switch (action.type) {
    case 'BOOKS_LOADED':
      return {
        books: action.payload
      };

    default:
      return state;
  }

};

export default reducer;

<!-- store.js -->                                                       .........
import { createStore } from 'redux';
import reducer from './reducers/index';

const store = createStore(reducer);

export default store;

<!-- actions.js -->                                                   .........

const booksLoaded = (newBooks) => {
  return {
    type: 'BOOKS_LOADED',
    payload: newBooks
  };
};

export {
  booksLoaded
};                                                                      <-------


---Каркасс React-Redux приложения

// предоставляет доступ к Redux store
  <Provider store={store}>
    // Обработка ошибок в компонентах ниже
    <ErrorBoundry>
      // Передает сервис через ContextAPI
        <ServiceProvider value={service}>
          // Router из пакета react-router
          <Router>
            // Само приложение
            <App />

<!-- index.js -->
import React from 'react';                                                        
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom'

import App from './components/app';
import ErrorBoundry from './components/error-boundry';
import BookstoreService from './services/bookstore-service';
import { BookstoreServiceProvider } from './components/bookstore-service-context';

import store from './store';

const bookstoreService = new BookstoreService();

ReactDOM.render(
  <Provider store={store}>
    <ErrorBoundry>
      <BookstoreServiceProvider value={bookstoreService}>
        <Router>
          <App />
        </Router>
      </BookstoreServiceProvider>
    </ErrorBoundry>
  </Provider>,
  document.getElementById('root')
);

<!-- app.js -->
import React, { Component } from 'react';
import './app.css'
import { withBookstoreService } from '../hoc';      <--------

const App = ({ bookstoreService }) => {             <--------
  console.log(bookstoreService.getBooks());           <------
  return (
    <div>App</div>
  )
};

export default withBookstoreService()(App);           <---------

<!-- bookstore-service.js -->

export default class BookstoreService {

  getBooks() {
    return [
      {                                             <---------
        id:1, 
        title: 'Production-Ready Microservices',
        author: 'Susan J. Fowler' },
      {                                             <-Создан для Теста->
        id: 2,
        title: 'Release It!',
        author: 'Michael T. Nygard' }
    ];                                                <--------
  }
};



---Роутинг

// Отрисовываю максимум один Route
<Switch>
  // Route - конфигурирует адрес "/"
  <Route path="/" component={Home} exact />
  // Route - конфигурирует адрес "/cart"
  <Route path="/cart" component={Cart} />
</Switch>

<!-- app.js -->
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { HomePage, CartPage } from '../pages';

import './app.css'

const App = () => {
  return (
    <div>
      <Switch>                                              <------
        <Route path="/" component={HomePage} exact />
        <Route path="/cart" component={CartPage} />         .......
      </Switch>                                             <-------
    </div>
  )
};

export default App;

<!-- book-list-item.js -->
import React, { Fragment } from 'react';                  <-------
import './book-list-item.css';

const BookListItem = ({ book }) => {
  const { title, author } = book;

  return (
    <Fragment>                                          .......
      <span>{title}</span>
      <span>{author}</span>
    </Fragment>
  );
};

export default BookListItem;                                <-------

<!-- book-list.js -->
import React, { Component } from 'react';                   <--------
import BookListItem from '../book-list-item';

import './book-list.css';

class BookList extends Component {

  render() {
    const { books } = this.props;
    return (
      <ul>                                                  ........
        {
          books.map((book) => {
            return (
              <li key={book.id}><BookListItem book={book}/></li>
            )
          })
        }
      </ul>
    );
  }
};

export default BookList;                                    <--------

<!-- card-page.js -->
import React from 'react';                                <------

const CartPage = () => {
  return (
    <div>                                               ........
      Cart Page
    </div>
  )
};

export default CartPage;                                  <------

<!-- home-page.js -->
import React from 'react';                                  <------
import BookList from '../book-list';

const HomePage = () => {
  const books = [
    { 
      id:1, 
      title: 'Production-Ready Microservices',
      author: 'Susan J. Fowler' },                    .........
    {
      id: 2,
      title: 'Release It!',
      author: 'Michael T. Nygard' }
  ];

  return (
    <BookList books={books} />
  )
};

export default HomePage;                                    <------



---Чтение данных из Redux store

const Person = ({name}) => {
  return <p>{name}</p>
}

// Эта функция определяет, какие свойства нужно получить из Redux
const mapStateToProps = (state) => {
  return { name: state.firstName };
} 
export default connext(mapStateToProps)(Persons);

<!-- reducer/index.js -->

const initialState = {
  books: [                                            <-------
    { 
      id:1, 
      title: 'Production-Ready Microservices',
      author: 'Susan J. Fowler' },
    {
      id: 2,
      title: 'Release It!',
      author: 'Michael T. Nygard' }
  ]                                                   <-------
};

const reducer = (state = initialState, action) => {

  switch (action.type) {
    case 'BOOKS_LOADED':
      return {
        books: action.payload
      };

    default:
      return state;
  }

};

export default reducer;

<!-- book-list.js -->
import React, { Component } from 'react';
import BookListItem from '../book-list-item';
import { connect } from 'react-redux';                    <--------

import './book-list.css';

class BookList extends Component {

  render() {
    const { books } = this.props;
    return (
      <ul>
        {
          books.map((book) => {
            return (
              <li key={book.id}><BookListItem book={book}/></li>
            )
          })
        }
      </ul>
    );
  }
};

const mapStateToProps = ({ books }) => {                <--------

  return { books };
  // return { books: state.books };
};                                                      <--------

export default connect(mapStateToProps)(BookList);      <--------

<!-- home-page.js -->
import React from 'react';
import BookList from '../book-list';

const HomePage = () => {

  return (
    <BookList />                                    <-------
  )
};

export default HomePage;



---Отправка действий в Redux Store (action dispatch)

-Что бы получить данные из сервиса и передать их в Redux Store используем HOC

-Первый HOC - withBookstoreService, получает сервис из контекста и передает
  в компонент

-Второй HOC - connect() - оборачивает функцию dispatch из Redux Store

-mapDispatchToProps может быть функцией или объектом. Если это объект, 
  то он передается в bindActionCreators()

<!-- book-list.js -->
import React, { Component } from 'react';
import BookListItem from '../book-list-item';
// import { bindActionCreators } from 'redux';                  <-------
import { connect } from 'react-redux';                          <-------

import { withBookstoreService } from '../hoc';                <-------
import { booksLoaded } from '../../actions/actions';            <-------
import { compose } from '../../utils';                            <-------
import './book-list.css';


class BookList extends Component {

  componentDidMount() {                                         <-------
    // 1. Получить данные
    const { bookstoreService } = this.props;
    const data = bookstoreService.getBooks();                 ......
    // console.log(data);

    // 2. Передать действие в store
    this.props.booksLoaded(data);                               <-------
  };

  render() {
    const { books } = this.props;
    return (
      <ul>
        {
          books.map((book) => {
            return (
              <li key={book.id}><BookListItem book={book}/></li>
            )
          })
        }
      </ul>
    );
  }
};

// HOOKS
// const BookList = ( {books, bookstoreService, booksLoaded} ) => {
//   useEffect(() => {
//     const data = bookstoreService.getBooks();
//     booksLoaded(data);
//   }, [booksLoaded, bookstoreService])

//   return (
//     <ul className='book-list'>
//       {
//         books.map((book) => {
//           return (
//             <li key={book.id}><BookListItem book={book}/></li>
//           )
//         })
//       }
//     </ul>
//   );
// };

const mapStateToProps = ({ books }) => {                        <-------
  return { books };
  // return { books: state.books };
};                                                            <-------

// const mapDispatchToProps = (dispatch) => {                       <-------
//   return bindActionCreators({
//     booksLoaded
//   }, dispatch);

//   // return {
//   //   booksLoaded: (newBooks) => {
//   //     dispatch(booksLoaded(newBooks));
//   //   }
//   // };                                                      .........
//   // // return {
//   // //   booksLoaded: (newBooks) => {     
//   // //     dispatch({
//   // //       type: 'BOOKS_LOADED',
//   // //       payload: newBooks
//   // //     });
//   // //   }
//   // };
// };                                                                 <-------

const mapDispatchToProps = {                                        <-------
  booksLoaded
};                                                                  <-------

export default compose(                                             <-------
  withBookstoreService(),                                         <-------
  connect(mapStateToProps, mapDispatchToProps)                      <-------
)(BookList);                                                      <-------

// export default withBookstoreService()(                           <-------
//   connect(mapStateToProps, mapDispatchToProps)(BookList)
// );                                                               <-------

<!-- reducer/index.js -->

const initialState = {
  books: [
    // {                                              
    //   id:1, 
    //   title: 'Production-Ready Microservices',
    //   author: 'Susan J. Fowler' },
    // {
    //   id: 2,
    //   title: 'Release It!',
    //   author: 'Michael T. Nygard' }
  ]
};

const reducer = (state = initialState, action) => {

  switch (action.type) {
    case 'BOOKS_LOADED':
      return {
        books: action.payload
      };

    default:
      return state;
  }

};

export default reducer;

<!-- utils/index.js -->

const compose = (...funcs) => (comp) => {                   <--------
  return funcs.reduceRight(
    (wrapped, f) => f(wrapped), comp);
};

export default compose;                                       <--------



---Стили

-В react-redux приложении стили работают так же как и в 
  обычном React приложении

-Сайты для подключения стилей в данном приложении:

  https://bootstrapcdn.com
  https://fonts.google.com


<!-- index.html -->
.......
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
  <link href="https://fonts.googleapis.com/css?family=Playfair+Display:700&display=swap" rel="stylesheet">  
......

<!-- app.js -->
.........
return (
    <main role="main" className="container">
.....

<!-- book-list.js -->
....
return (
      <ul className='book-list'>
....

<!-- book-list.css -->
.book-list {
  list-style: none;
}

<!-- book-list-item.js -->
.....
return (
    <div className="book-list-item">
      <div className="book-cover">
        <img src={coverImage} alt="cover"/>
      </div>
      <div className="book-details">
        <a href="/#" className="book-title">{title}</a>
        <div className="book-author">{author}</div>
        <div className="book-price">{price}</div>
        <button className="btn btn-info add-to-cart">Add To Cart</button>
      </div>
    </div>
......

<!-- book-list-item.css -->
.book-list-item {
  display: flex;
  margin: 15px 0;
}

.book-list-item .book-cover {
  flex-shrink: 0;
  width: 120px;
  margin-right: 30px;
}
  
.book-list-item .book-cover img {
  max-width: 100%;
}

.book-list-item .book-details {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 10px;
  align-items: flex-start;
}

.book-list-item .book-details .book-title {
  font-size: 1.2rem;
}

.book-list-item .book-details .book-title {
  font-size: 1.4rem;
}

<!-- shop-header.js -->
import React from 'react'
import './shop-header.css'

const ShopHeader = ({ numItems, total }) => {
  return (
    <header className="shop-header row">
      <a className="logo text-dark" href="/#">Re-Store</a>
      <a className="shopping-cart">
        <i className="cart-icon fa fa-shopping-cart" />
        {numItems} items (${total})
      </a>
    </header>
  );
};

export default ShopHeader;

<!-- shop-header.css -->
.shop-header {
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
}

.shop-header .logo {
  font-family: "Playfair Display", Georgia, serif;
  font-size: 2.5rem;
  padding-left: 1rem;
}

.shop-header .shopping-cart {
  align-self: center;
  font-size: 1.3rem;
  padding-right: 1rem;
}

.shop-header .shopping-cart .cart-icon {
  font-size: 2.2rem;
  color: cadetblue;
  margin-right: 10px;
}

<!-- shopping-cart-table.js -->
import React from 'react';
import './shopping-cart-table.css'

const ShoppingCartTable = () => {
  return (
    <div className="shopping-cart-table">
      <h2>Your Order</h2>
        <table className="table">
          <thead>
            <th>#</th>
            <th>Item</th>
            <th>Count</th>
            <th>Price</th>
            <th>Action</th>
          </thead>

          <tbody>
            <td>1</td>
            <td>Site Reability Engineering</td>
            <td>2</td>
            <td>$40</td>
            <td>
             <button className="btn btn-outline-danger btn-sm float-right">
                <i className="fa fa-trash-o" />
              </button>
              <button className="btn btn-outline-success btn-sm float-right">
                <i className="fa fa-plus-circle" />
              </button>
              <button className="btn btn-outline-warning btn-sm float-right">
                <i className="fa fa-minus-circle" />
              </button>
            </td>
          </tbody>  
        </table>
        
        <div className="total">
          Total: $201
        </div>
    </div>
  );
};

export default ShoppingCartTable;

<!-- shopping-cart-table.css -->
.shopping-cart-table .total {
  text-align: right;
  font-size: 1.3rem;
  margin-right: 10px;
}

.shopping-cart-table .total {
  margin-left: 5px;
  margin-top: 50px;
}

<!-- bookstore-service.js -->

export default class BookstoreService {

  getBooks() {
    return [
      { 
        id:1, 
        title: 'Production-Ready Microservices',
        author: 'Susan J. Fowler',
        price: 32,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51oxXEG6TRL._SX379_BO1,204,203,200_.jpg' },
      {
        id: 2,
        title: 'Release It!',
        author: 'Michael T. Nygard',
        price: 45,
        coverImage: 'https://images-na.ssl-images-amazon.com/images/I/419zAwJJH4L._SX415_BO1,204,203,200_.jpg' }
    ];
  }
};




---Асинхронные данные

-Реализовать загрузку данных в Redux можно так же как и в обычном
  React приложении:

  Добавить поле loading в Redux state

  Обновлять это плле в reducer, когда данные становятся доступны

  Передать значение loading в компонент, используя mapStateToProps

<!-- reducer/index.js -->

const initialState = {
  books: [],
  loading: true                                         <-------
};

const reducer = (state = initialState, action) => {

  switch (action.type) {
    case 'BOOKS_LOADED':
      return {
        books: action.payload,
        loading: false                                  <-------
      };

    default:
      return state;
  }

};

export default reducer;


<!-- book-list.js -->
import React, { Component, useEffect, useState } from 'react';
import BookListItem from '../book-list-item';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withBookstoreService } from '../hoc';
import { booksLoaded } from '../../actions/actions';
import { compose } from '../../utils';
import Spinner from '../spinner';
import './book-list.css';

class BookList extends Component {

  componentDidMount() {
    // 1. Получить данные
    const { bookstoreService, booksLoaded } = this.props;
    bookstoreService.getBooks()
    // 2. Передать действие в store
      .then((data) => booksLoaded(data));
  };

  render() {
    const { books, loading } = this.props;

    if (loading) {
      return <Spinner />
    }

    return (
      <ul className='book-list'>
        {
          books.map((book) => {
            return (
              <li key={book.id}><BookListItem book={book}/></li>
            )
          })
        }
      </ul>
    );
  }
};

// HOOKS
// const BookList = ( {books, bookstoreService, booksLoaded, loading} ) => {
//   useEffect(() => {
//     bookstoreService.getBooks()                                <----------
//     .then((data) => booksLoaded(data));                          <----------
//   }, [booksLoaded, bookstoreService])                        <----------

//   if (loading) {
//     return <Spinner />                                           <----------
//   }

//   return (
//     <ul className='book-list'>
//       {
//         books.map((book) => {
//           return (
//             <li key={book.id}><BookListItem book={book}/></li>
//           )
//         })
//       }
//     </ul>
//   );
// };

const mapStateToProps = ({ books, loading }) => {
  return { books, loading };                                  <-------
};

const mapDispatchToProps = {
  booksLoaded
};

export default compose(
  withBookstoreService(),
  connect(mapStateToProps, mapDispatchToProps)
)(BookList);

// export default withBookstoreService()(
//   connect(mapStateToProps, mapDispatchToProps)(BookList)
// );

<!-- bookstore-service.js -->

export default class BookstoreService {

  data = [                                                          <----------
    { 
      id:1, 
      title: 'Production-Ready Microservices',
      author: 'Susan J. Fowler',
      price: 32,
      coverImage: 'https://images-na.ssl-images-amazon.com/images/I/51oxXEG6TRL._SX379_BO1,204,203,200_.jpg' },
    {
      id: 2,
      title: 'Release It!',
      author: 'Michael T. Nygard',
      price: 45,
      coverImage: 'https://images-na.ssl-images-amazon.com/images/I/419zAwJJH4L._SX415_BO1,204,203,200_.jpg' }
  ];                                                                <----------

  getBooks() {
    return new Promise((resolve, reject) => {                         <----------
      setTimeout(() => {
        resolve(this.data)
      }, 1000);
    });                                                               <----------
  }
};




---Отличия setState и reducer

-В setState() можно передавать только ту часть state,
  которую нужно обновить

  setState({ updadedProp: 'new value' });

-Reduser должен вернуть полный объект state

  return {
    ...state,
    updadedProp: newValue
  }

<!-- reducers/index.js -->

const initialState = {
  books: [],                                          <--------
  loading: true                                         <--------
};

const reducer = (state = initialState, action) => {

  switch (action.type) {
    case 'BOOKS_REQUESTED':                           <--------
      return {
        books: [],                                  .....
        loading: true
      }                                               <--------
    case 'BOOKS_LOADED':
      return {
        books: action.payload,
        loading: false
      };

    default:
      return state;
  }

};

export default reducer;

<!-- actions.js -->

const booksLoaded = (newBooks) => {
  return {
    type: 'BOOKS_LOADED',
    payload: newBooks
  };
};

const booksRequested = () => {              <--------
  return {
    type: 'BOOKS_REQUESTED'             .......
  }
};                                          <--------

export {
  booksLoaded,
  booksRequested                          <--------
};

<!-- book-list.js -->
.......
 componentDidMount() {
    // 1. Получить данные
    const { bookstoreService, booksLoaded, booksRequested } = this.props;   <--------
    booksRequested();                                                         <--------
    bookstoreService.getBooks()
    // 2. Передать действие в store
      .then((data) => booksLoaded(data));
  };
..........
// HOOKS
// const BookList = ({books, bookstoreService,
//                    booksLoaded, loading, booksRequested}) => {     <--------

//   useEffect(() => {
//     booksRequested();                                              <--------
//     bookstoreService.getBooks()
//     .then((data) => booksLoaded(data));
//   }, [bookstoreService, booksRequested, booksLoaded])            <--------

..........
const mapDispatchToProps = {
  booksLoaded,
  booksRequested                              <----------
};
.............





---Обработка ошибок

-Ошибку получения данных, нужно сохранить в store. Затем компонент
  Затем компонент сможет ее отобразить

-Чтобы сохранить ошибку, нужно создать отдельное действие 
  (BOOKS_FETCH_ERROR)

-Саму ошибку можно передать вместе с store(действием) и 
  сохранить в store

<!-- book-list.js -->
import React, { Component, useEffect } from 'react';
..........
import { booksLoaded, booksRequested, booksError } from '../../actions/actions';  <------
.......

class BookList extends Component {
  componentDidMount() {
    // 1. Получить данные
    const { bookstoreService, booksLoaded, 
            booksRequested, booksError } = this.props;                  <-------
    booksRequested();           // Начать загрузку книг(спинер) 
    bookstoreService.getBooks()
      .then((data) => booksLoaded(data))  // 2. Передать действие в store
      .catch((err) => booksError(err));   //3.Передаю error в store       <-------
  };

  render() {
    const { books, loading, error } = this.props;                     <-------

    if (loading) {
      return <Spinner />
    };

    if (error) {
      return <ErrorIndicator />                                       <-------
    }

    return (
      <ul className='book-list'>
        {
          books.map((book) => {
            return (
              <li key={book.id}><BookListItem book={book}/></li>
            )
          })
        }
      </ul>
    );
  }
};

// HOOKS
// const BookList = ({books, bookstoreService,
//                    booksLoaded, loading, 
//                    booksRequested, booksError, error}) => {

//   useEffect(() => {
//     booksRequested();
//     bookstoreService.getBooks()
//       .then((data) => booksLoaded(data))
//       .catch((err) => booksError(err));
//   }, [bookstoreService, booksRequested, booksLoaded, booksError])

//   if (loading) {
//     return <Spinner />
//   }

//   if (error) {
//     return <ErrorIndicator />
//   }

//   return (
//     <ul className='book-list'>
//       {
//         books.map((book) => {
//           return (
//             <li key={book.id}><BookListItem book={book}/></li>
//           )
//         })
//       }
//     </ul>
//   );
// };

const mapStateToProps = ({ books, loading, error }) => {        <------
  return { books, loading, error };                           <------
};

const mapDispatchToProps = {
  booksLoaded,
  booksRequested,
  booksError                                                  <------
};

export default compose(
  withBookstoreService(),
  connect(mapStateToProps, mapDispatchToProps)
)(BookList);

<!-- bookstore-service.js -->

export default class BookstoreService {

  data = [
    ............
  ];

  getBooks() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
  // Тест. В 1 случае из 4 вернуть ошибку  
        if (Math.random() > 0.75) {                         <-------
          reject(new Error('Something bad happened'));    <-------
        } else {
          resolve(this.data);                             <-------
        }
      }, 1000);
    });
  }
};

<!-- reducer/index.js -->

const initialState = {
  books: [],
  loading: true,
  error: null
  
};

const reducer = (state = initialState, action) => {

  switch (action.type) {
    case 'BOOKS_REQUESTED':
      return {
        books: [],
        loading: true,
        error: null
      };

    case 'BOOKS_LOADED':
      return {
        books: action.payload,
        loading: false,
        error: null
      };

    case 'BOOKS_ERROR':                           <--------
      return {
        books: [],                            ........
        loading: false, 
        error: action.payload
      }                                         <--------

    default:
      return state;
  }
};
export default reducer;




---Аргумент ownProps

-У mapDispatchToProps есть второй аргумент

<Person details="full" />

mapDispatchToProps = (dispatch, ownProps) => {
  console.log(ownProps.details);  // full
}

export default connect(.....)(Person)

<!-- book-list.js -->
import React, { Component, useEffect } from 'react';
import BookListItem from '../book-list-item';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withBookstoreService } from '../hoc';
import { booksLoaded, booksRequested, booksError } from '../../actions/actions';
import { compose } from '../../utils';
import Spinner from '../spinner';
import ErrorIndicator from '../error-indicator';
import './book-list.css';

class BookList extends Component {

  componentDidMount() {
    this.props.fetchBooks();

    // // 1. Получить данные
    // const { bookstoreService, booksLoaded, 
    //         booksRequested, booksError } = this.props;

    // booksRequested();           // Начать загрузку книг(спинер) 
    // bookstoreService.getBooks()
    //   .then((data) => booksLoaded(data))  // 2. Передать действие в store
    //   .catch((err) => booksError(err));   //3.Передаю error в store
  };

  render() {
    const { books, loading, error } = this.props;

    if (loading) {
      return <Spinner />
    };

    if (error) {
      return <ErrorIndicator />
    }

    return (
      <ul className='book-list'>
        {
          books.map((book) => {
            return (
              <li key={book.id}><BookListItem book={book}/></li>
            )
          })
        }
      </ul>
    );
  }
};

// HOOKS
// const BookList = ({books, bookstoreService,
//                    booksLoaded, loading, 
//                    booksRequested, booksError, error, fetchBooks}) => {

//   useEffect(() => {
//     fetchBooks();

//     // booksRequested();
//     // bookstoreService.getBooks()
//     //   .then((data) => booksLoaded(data))
//     //   .catch((err) => booksError(err));
//   }, [bookstoreService, booksRequested, booksLoaded, booksError, fetchBooks])

//   if (loading) {
//     return <Spinner />
//   }

//   if (error) {
//     return <ErrorIndicator />
//   }

//   return (
//     <ul className='book-list'>
//       {
//         books.map((book) => {
//           return (
//             <li key={book.id}><BookListItem book={book}/></li>
//           )
//         })
//       }
//     </ul>
//   );
// };

const mapStateToProps = ({ books, loading, error }) => {
  return { books, loading, error };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { bookstoreService } = ownProps;
  return {
    fetchBooks: () => {
      // 1. Получить данные
      dispatch(booksRequested());           // Начать загрузку книг(спинер) 
      bookstoreService.getBooks()
        .then((data) => dispatch(booksLoaded(data)))  // 2. Передать действие в store
        .catch((err) => dispatch(booksError(err)));   //3.Передаю error в store
    }
  }
};
// const mapDispatchToProps = {
//   booksLoaded,
//   booksRequested,
//   booksError
// };

export default compose(
  withBookstoreService(),
  connect(mapStateToProps, mapDispatchToProps)
)(BookList);




---Naming Convection (правила выбора имен) для действий

-[тип запроса]_[объект]_[действие]

-FETCH_BOOKS_REQUEST - запрос отправлен

-FETCH_BOOKS_SUCCESS - получен результат
  (в payload передаются полученные данные)

-FETCH_BOOKS_FAILURE - произошла ошибка
  (в payload передается объект Error)

<!-- book-list.js -->
import React, { Component, useEffect } from 'react';
......

import { fetchBooks } from '../../actions/actions';    <-------
............

class BookList extends Component {

  ..............
};

// HOOKS
// const BookList = ({books, bookstoreService,
//                    booksLoaded, loading, 
//                    booksRequested, booksError, error, fetchBooks}) => {

//   useEffect(() => {
//     fetchBooks();

//     // booksRequested();
//     // bookstoreService.getBooks()
//     //   .then((data) => booksLoaded(data))
//     //   .catch((err) => booksError(err));
//   }, [bookstoreService, booksRequested, booksLoaded, booksError, fetchBooks])

//   if (loading) {
//     return <Spinner />
//   }

//   if (error) {
//     return <ErrorIndicator />
//   }

//   return (
//     <ul className='book-list'>
//       {
//         books.map((book) => {
//           return (
//             <li key={book.id}><BookListItem book={book}/></li>
//           )
//         })
//       }
//     </ul>
//   );
// };

const mapStateToProps = ({ books, loading, error }) => {
  return { books, loading, error };
};

const mapDispatchToProps = (dispatch, { bookstoreService }) => {      <-------
  // const { bookstoreService } = ownProps;                         <-------
  return {
    fetchBooks: fetchBooks(dispatch, bookstoreService)                <-------
  }
};

export default compose(
  withBookstoreService(),
  connect(mapStateToProps, mapDispatchToProps)
)(BookList);

<!-- actions.js -->

const booksLoaded = (newBooks) => {
  return {
    type: 'FETCH_BOOKS_SUCCESS',                            <--------
    payload: newBooks
  };
};

const booksRequested = () => {
  return {
    type: 'FETCH_BOOKS_REQUEST'                               <--------
  }
};

const booksError = (error) => {
  return {
    type: 'FETCH_BOOKS_FAILURE',                              <--------
    payload: error
  }
};

const fetchBooks = (dispatch, bookstoreService ) => () => {   <--------
  dispatch(booksRequested());          
  bookstoreService.getBooks()                               ........
    .then((data) => dispatch(booksLoaded(data)))  
    .catch((err) => dispatch(booksError(err)));   
}                                                             <--------

export {
  // booksLoaded,
  // booksRequested,
  // booksError
  fetchBooks                                                <--------
};

<!-- reducer/index.js -->

const initialState = {
  books: [],
  loading: true,
  error: null
  
};

const reducer = (state = initialState, action) => {

  switch (action.type) {
    case 'FETCH_BOOKS_REQUEST':                         <------
      return {
        books: [],
        loading: true,
        error: null
      };

    case 'FETCH_BOOKS_SUCCESS':                       <------
      return {
        books: action.payload,
        loading: false,
        error: null
      };

    case 'FETCH_BOOKS_FAILURE':                         <------
      return {
        books: [],
        loading: false,
        error: action.payload
      }

    default:
      return state;
  }
};

export default reducer;




---Компоненты-контейнеры

-Презентационные компоненты - отвечают только за рендеринг

-Компоненты-контейнеры - работают с Redux, реализуют loading,
  error и другую логику

-Компоненты-контейнеры иногда выносят в отдельные 
  файлы (PersonContainer) или папки (/containers)

<!-- book-list.js -->
import React, { Component, useEffect } from 'react';
import BookListItem from '../book-list-item';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withBookstoreService } from '../hoc';
import { fetchBooks } from '../../actions/actions';
import { compose } from '../../utils';
import Spinner from '../spinner';
import ErrorIndicator from '../error-indicator';
import './book-list.css';

const BookList = ({ books }) => {                               <-------
  return (
    <ul className='book-list'>
      {
        books.map((book) => {
          return (
            <li key={book.id}><BookListItem book={book}/></li>  ........
          )
        })
      }
    </ul>
  );
};                                                              <-------

class BookListContainer extends Component {                   <-------

  componentDidMount() {
    this.props.fetchBooks();
  };

  render() {
    const {books, loading, error } = this.props;

    if (loading) {
      return <Spinner />
    };

    if (error) {
      return <ErrorIndicator />
    }

    return <BookList books={books} />
  }
};

// // HOOKS
// const BookListContainer = ({books, loading, 
//                             error, fetchBooks}) => {

//   useEffect(() => {
//     fetchBooks();

//     // booksRequested();
//     // bookstoreService.getBooks()
//     //   .then((data) => booksLoaded(data))
//     //   .catch((err) => booksError(err));
//   }, [fetchBooks])

//   if (loading) {
//     return <Spinner />
//   }

//   if (error) {
//     return <ErrorIndicator />
//   }

//   return <BookList books={books} />
// };

const mapStateToProps = ({ books, loading, error }) => {
  return { books, loading, error };
};

const mapDispatchToProps = (dispatch, { bookstoreService }) => {
  // const { bookstoreService } = ownProps;
  return {
    fetchBooks: fetchBooks(dispatch, bookstoreService)
  }
};

export default compose(
  withBookstoreService(),
  connect(mapStateToProps, mapDispatchToProps)
)(BookListContainer);                                         <-------




---Новый компонент

-Создание нового компонента который не должен "знать" о Redux

-Обновить state. Добавить туда новые поля

-Для начала заполнить state тестовыми данными

-Реализовать функции для connect() и подключить компонент к Redux

<!-- shopping-cart-table.js -->
import React from 'react';
import './shopping-cart-table.css'
import { connect } from 'react-redux';                              <---------

const ShoppingCartTable = ({ items, total, onIncrease, onDecrease, onDelete }) => {

  const renderRow = (item, idx) => {                                <---------
    const { id, name, count, total } = item;
    return (
      <tr key={id}>
        <td>{idx + 1}</td>
        <td>{name}</td>
        <td>{count}</td>
        <td>${total}</td>
        <td>
        <button 
          onClick={() => onDelete(id)}
          className="btn btn-outline-danger btn-sm float-right">
          <i className="fa fa-trash-o" />                           ......
        </button>
        <button 
          onClick={() => onIncrease(id)} 
          className="btn btn-outline-success btn-sm float-right">
          <i className="fa fa-plus-circle" />
        </button>
        <button                                                     ........
          onClick={() => onDecrease(id)} 
          className="btn btn-outline-warning btn-sm float-right">
          <i className="fa fa-minus-circle" />
        </button>
        </td>
      </tr>
    )
  }                                                                 <---------

  return (
    <div className="shopping-cart-table">
      <h2>Your Order</h2>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>Count</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
          {
            items.map(renderRow)                            <---------
          }
          </tbody>  
        </table>
        
        <div className="total">
          Total: ${total}                                   <---------
        </div>
    </div>
  );
};

const mapStateToProps = ({ cartItems, orderTotal }) => {    <---------
  return {
    items: cartItems,                                   ......
    total: orderTotal
  };
};                                                        <---------

const mapDispatchToProps = () => {                        <---------
  return {
    onIncrease: (id) => {
      console.log(`Inc ${id}`)
    },
    onDecrease: (id) => {                         ..........
      console.log(`Dec ${id}`)
    },
    onDelete: (id) => {
      console.log(`Dell ${id}`)
    }
  }
}                                                         <---------

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCartTable); <---------

<!-- reducer/index.js -->

const initialState = {
  books: [],
  loading: true,
  error: null,
  cartItems: [                                      <---------
    {                                           <---------
      id: 1,
      name: 'B 1',
      count: 3,
      total: 150
    },
    {                                           ....testText....
      id: 2,
      name: 'B 2',
      count: 2,
      total: 30
    }
  ],
  orderTotal: 180                                 <---------
};                

const reducer = (state = initialState, action) => {

  switch (action.type) {
    case 'FETCH_BOOKS_REQUEST':
      return {
        // cartItems: state.cartItems,      <---------
        // orderTotal: state.orderTotal,    <--------- or..
        ...state,                                     <---------
        books: [],
        loading: true,
        error: null
      };

    case 'FETCH_BOOKS_SUCCESS':
      return {
        // cartItems: state.cartItems,    <---------
        // orderTotal: state.orderTotal,  <--------- or..
        ...state,                                     <---------  
        books: action.payload,
        loading: false,
        error: null
      };

    case 'FETCH_BOOKS_FAILURE':
      return {
        // cartItems: state.cartItems,    <---------
        // orderTotal: state.orderTotal,  <--------- or..
        ...state,                                       <---------
        books: [],
        loading: false,
        error: action.payload
      }

    default:
      return state;
  }

};

export default reducer;




---Добавление элементов в массив

-В Redux приложениях так же как и в React нельзя модифицировать state

-Добавить элемент в массив можно так:

  case 'ADD_TO_ARRAY':
    const item = action.payload;
    return {
      items: [...state.items, item]
    }

<!-- book-list-item.js -->
import React from 'react';
import './book-list-item.css';

const BookListItem = ({ book, onAddedToCart }) => {     <-------
  const { title, author, price, coverImage } = book;

  return (
    <div className="book-list-item">
      <div className="book-cover">
        <img src={coverImage} alt="cover"/>
      </div>
      <div className="book-details">
        <a href="/#" className="book-title">{title}</a>
        <div className="book-author">{author}</div>
        <div className="book-price">{price}</div>
        <button 
          onClick={onAddedToCart}                         <-------
          className="btn btn-info add-to-cart">
            Add To Cart
        </button>
      </div>
    </div>
  );
};

export default BookListItem;

<!-- reducer/index.js -->

const initialState = {
  books: [],
  loading: true,
  error: null,
  cartItems: [],                                  <------
  orderTotal: 180
};

const reducer = (state = initialState, action) => {
  
  switch (action.type) {
    case 'FETCH_BOOKS_REQUEST':
      return {
        ...state,
        books: [],
        loading: true,
        error: null
      };

    case 'FETCH_BOOKS_SUCCESS':
      return {
        ...state,
        books: action.payload,
        loading: false,
        error: null
      };

    case 'FETCH_BOOKS_FAILURE':
      return {
        ...state,
        books: [],
        loading: false,
        error: action.payload
      };

    case 'BOOK_ADDED_TO_CART':                                    <------
      const bookId = action.payload;    // Поиск id книги
      const book = state.books.find((book) => book.id === bookId);
      const newItem = {
        id: book.id,                                              ......
        name: book.title,
        count: 1,
        total: book.price
      };                                                          <------
      
      return {                                                      <------
        ...state,            // возвращаю старый state кроме cartItems ...
        cartItems: [          // который возвращает новый массив ...
          ...state.cartItems, // с тем же элементом которые будут у ...state.cartItems ...
          newItem             // прлюс newItem
        ]
      };                                                            <------

    default:
      return state;
  }

};

export default reducer;

<!-- book-list.js -->
import React, { Component, useEffect } from 'react';
...........

import { fetchBooks, bookAddedToCart } from '../../actions/actions';  <-------
......

const BookList = ({ books, onAddedToCart }) => {              <-------
  return (
    <ul className='book-list'>
      {
        books.map((book) => {
          return (
            <li key={book.id}>
              <BookListItem 
                onAddedToCart={() => onAddedToCart(book.id)}  <-------
                book={book} />
            </li>
          )
        })
      }
    </ul>
  );
};

class BookListContainer extends Component {

  componentDidMount() {
    this.props.fetchBooks();
  };

  render() {
    const {books, loading, error, onAddedToCart } = this.props;   <-------

    if (loading) {
      return <Spinner />
    };

    if (error) {
      return <ErrorIndicator />
    };

    return <BookList books={books} onAddedToCart={onAddedToCart} />   <-------
  }
};

// // HOOKS
// const BookListContainer = ({books, loading, 
//                           error, fetchBooks, onAddedToCart}) => {    <-------

//   useEffect(() => {
//     fetchBooks();

//     // booksRequested();
//     // bookstoreService.getBooks()
//     //   .then((data) => booksLoaded(data))
//     //   .catch((err) => booksError(err));
//   }, [fetchBooks])

//   if (loading) {
//     return <Spinner />
//   }

//   if (error) {
//     return <ErrorIndicator />
//   }

//   return <BookList books={books} onAddedToCart={onAddedToCart}/>
// };

const mapStateToProps = ({ books, loading, error }) => {
  return { books, loading, error };
};

const mapDispatchToProps = (dispatch, { bookstoreService }) => {
  // const { bookstoreService } = ownProps;
  return {
    fetchBooks: fetchBooks(dispatch, bookstoreService),
    onAddedToCart: (id) => dispatch(bookAddedToCart(id))          <-------
  }
};

export default compose(
  withBookstoreService(),
  connect(mapStateToProps, mapDispatchToProps)
)(BookListContainer);

<!-- actions.js -->

const booksRequested = () => {
  return {
    type: 'FETCH_BOOKS_REQUEST'
  }
};

const booksLoaded = (newBooks) => {
  return {
    type: 'FETCH_BOOKS_SUCCESS',
    payload: newBooks
  };
};

const booksError = (error) => {
  return {
    type: 'FETCH_BOOKS_FAILURE',
    payload: error
  }
};

export const bookAddedToCart = (bookId) => {              <-------
  return {  
    type: 'BOOK_ADDED_TO_CART',                       .......
    payload: bookId
  }
}                                                         <-------

const fetchBooks = (dispatch, bookstoreService ) => () => {   
  dispatch(booksRequested());          
  bookstoreService.getBooks()
    .then((data) => dispatch(booksLoaded(data)))  
    .catch((err) => dispatch(booksError(err)));   
}                                                         

export {
  fetchBooks
};




---Обновление элементов массива

-обновить элементы в массиве можно так:

  case 'UPDATE_IN_ARRAY':
    const {item, index} = action.payload;

    return {
      items: [
        ...state.items.slice(0, index),
        item,
        ...state.items.slice(index + 1),
      ]
    }

<!-- reducer/index.js -->
const initialState = {
  books: [],
  loading: true,
  error: null,
  cartItems: [],
  orderTotal: 180
};

const updateCartItems = (cartItems, item, idx) => {         <------

  if (idx === -1) {                                           <------
    return [
      ...cartItems,
      item
    ]
  }                                                     ........

  return [
    ...cartItems.slice(0, idx),
    item,
    ...cartItems.slice(idx + 1)
  ]                                                         <------
};

const updateCartItem = (book, item = {}) => {             <------

  const { id = book.id, count = 0, 
          title = book.title, total = 0 } = item;

  return {
    id,
    title,                                <-------
    count: count + 1,
    total: total + book.price
  }

  // if (item) {                                        ........
  //   return  {
  //     ...item,
  //     count: item.count + 1,
  //     total: item.total + book.price
  //   };
  // } else {
  //   return  {
  //     id: book.id,
  //     title: book.title,
  //     count: 1,
  //     total: book.price
  //   };
  // };
};                                                          <------

const reducer = (state = initialState, action) => {
  
  switch (action.type) {
    case 'FETCH_BOOKS_REQUEST':
      return {
        ...state,
        books: [],
        loading: true,
        error: null
      };

    case 'FETCH_BOOKS_SUCCESS':
      return {
        ...state,
        books: action.payload,
        loading: false,
        error: null
      };

    case 'FETCH_BOOKS_FAILURE':
      return {
        ...state,
        books: [],
        loading: false,
        error: action.payload
      };

    case 'BOOK_ADDED_TO_CART':                                  <------
      const bookId = action.payload;          // Поиск id книги
      const book = state.books.find((book) => book.id === bookId);  // Поиск элемента с книгой
      const itemIndex = state.cartItems.findIndex(({id}) => id === bookId); // Поиск индекса элемента в массиве
      const item = state.cartItems[itemIndex];
                                                                      
      const newItem = updateCartItem(book, item);                         ......
      return {
        ...state,           
        cartItems: updateCartItems(state.cartItems, newItem, itemIndex)
      };                                                                   <------
      
    default:
      return state;
  }

};

export default reducer;

<!-- shopping-cart-table.js -->
import React from 'react';
import './shopping-cart-table.css'
import { connect } from 'react-redux';

const ShoppingCartTable = ({ items, total, onIncrease, onDecrease, onDelete }) => {
  const renderRow = (item, idx) => {
    const { id, title, count, total } = item;     <--------
    return (
      <tr key={id}>
        <td>{idx + 1}</td>
        <td>{title}</td>                          <--------
        <td>{count}</td>
        <td>${total}</td>

............




---Удаление элементов массива

-Удалить элемент из массива можно таким способом:

  case "DELETE_FROM_ARRAY":
    const { index } = action.payload;
    return {
      items: [
        ...state.items.slice(0, index),
        ...state.items.slice(index + 1)
      ]
    }

<!-- reducer/index.js -->
const initialState = {
  books: [],
  loading: true,
  error: null,
  cartItems: [],
  orderTotal: 180
};

const updateCartItems = (cartItems, item, idx) => {
  // Удаляю элемент 
  if (item.count < 1) {                                   <------
    return [
      ...cartItems.slice(0, idx),                         .......
      ...cartItems.slice(idx + 1)
    ]
  };                                                      <------
  // Добавляю элемент
  if (idx === -1) {
    return [
      ...cartItems,
      item
    ]
  };
  // Обновляю существующий массив
  return [
    ...cartItems.slice(0, idx),
    item,
    ...cartItems.slice(idx + 1)
  ]
};

const updateCartItem = (book, item = {}, quantity) => {     <------

  const { id = book.id, count = 0, 
          title = book.title, total = 0 } = item;

  return {
    id,
    title,
    count: count + quantity,                      <------
    total: total + quantity * book.price  // Уменьшаем и увеличение кол-во книг на 1  <------
  }
};

const updateOrder = (state, bookId, quantity) => {              <------
  const { books, cartItems } = state;

  const book = books.find(({id}) => id === bookId);  // Поиск книги
  const itemIndex = cartItems.findIndex(({id}) => id === bookId); // Поиск индекса элемента в массиве
  const item = cartItems[itemIndex];            
  
  const newItem = updateCartItem(book, item, quantity);       ..........
  return {
    ...state,           
    cartItems: updateCartItems(cartItems, newItem, itemIndex)
  };
}                                                               <------

const reducer = (state = initialState, action) => {
  
  switch (action.type) {
    
    case 'FETCH_BOOKS_REQUEST':
      return {
        ...state,
        books: [],
        loading: true,
        error: null
      };

    case 'FETCH_BOOKS_SUCCESS':
      return {
        ...state,
        books: action.payload,
        loading: false,
        error: null
      };

    case 'FETCH_BOOKS_FAILURE':
      return {
        ...state,
        books: [],
        loading: false,
        error: action.payload
      };
    // Увеличиваю кол-во книг
    case 'BOOK_ADDED_TO_CART':                                  <------
      return updateOrder(state, action.payload, 1);           <------
    // Уменьшаю кол-во книг
    case 'BOOK_REMOVED_FROM_CART':                                <------
      return updateOrder(state, action.payload, -1);            <------
    // Удаляю все книги
    case 'ALL_BOOKS_REMOVED_FROM_CART':                                   <------
      const item = state.cartItems.find(({id}) => id === action.payload);   <------
      return updateOrder(state, action.payload, -item.count);               <------
    
    default:
      return state;
  }
};

export default reducer;

<!-- actions.js -->
......
export const bookRemoveFromCart = (bookId) => {
  return {
    type: 'BOOK_REMOVED_FROM_CART',
    payload: bookId
  }
};

export const allBooksRemoveFromCart = (bookId) => {
  return {
    type: 'ALL_BOOKS_REMOVED_FROM_CART',
    payload: bookId
  }
};
......

<!-- shopping-cart-table.js -->
import React from 'react';
import './shopping-cart-table.css'
import { connect } from 'react-redux';
import {                                                     <------
  bookAddedToCart,                                        .......
  bookRemoveFromCart,                                 
  allBooksRemoveFromCart } from '../../actions/actions';      <------

const ShoppingCartTable = ({ items, total, onIncrease, onDecrease, onDelete }) => {
  const renderRow = (item, idx) => {
    .............
  }

  return (
    <div className="shopping-cart-table">
     ..............
    </div>
  );
};

const mapStateToProps = ({ cartItems, orderTotal }) => {
  return {
    items: cartItems,
    total: orderTotal
  };
};

const mapDispatchToProps = {                                <------
  onIncrease: bookAddedToCart,
  onDecrease: bookRemoveFromCart,                             .......
  onDelete: allBooksRemoveFromCart
}                                                           <------


export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCartTable);




---Организация кода reducer'а

-Как только reducer становится сложным - сразу нужно его упрощать

-Нужно работать со структурой глобального state:
  объединять свойства в объекты

-Выносить логику обновления объектов из глобального state в отдельные функции

<!-- reducer/index.js -->
import updateBookList from './book-list';                           <------
import updateShoppingCart from './shopping-cart';                 <------

const reducer = (state, action) => {                                
  return {
    bookList: updateBookList(state, action),                      <------
    shoppingCart: updateShoppingCart(state, action)             <------
  }

  // switch (action.type) {                                       <------
  //   case 'FETCH_BOOKS_REQUEST':
  //   case 'FETCH_BOOKS_SUCCESS':
  //   case 'FETCH_BOOKS_FAILURE':
  //     return {
  //       ...state,
  //       bookList: updateBookList(state, action)            ........
  //     };

  //   case 'BOOK_ADDED_TO_CART':
  //   case 'BOOK_REMOVED_FROM_CART':
  //   case 'ALL_BOOKS_REMOVED_FROM_CART':
  //     return {
  //       ...state,
  //       shoppingCart: updateShoppingCart(state, action)
  //     }
  //   default:
  //     return state;                                             <------
  
};

export default reducer;

<!-- shopping-cart-table.js -->
......
const mapStateToProps = ({ shoppingCart: {cartItems, orderTotal} }) => {    <-------
  return {
    items: cartItems,
    total: orderTotal
  };
};
............

<!-- book-list.js -->
........
const mapStateToProps = ({ bookList: {books, loading, error} }) => {    <------
  return { books, loading, error };
};
........

<!-- shopping-cart.js -->

const updateCartItems = (cartItems, item, idx) => {                 <------
  // Удаляю элемент 
  if (item.count === 0 || item.count < 0) {
    return [
      ...cartItems.slice(0, idx),
      ...cartItems.slice(idx + 1)
    ]
  };
  // Добавляю элемент
  if (idx === -1) {
    return [
      ...cartItems,
      item
    ]
  };
  // Обновляю существующий массив
  return [
    ...cartItems.slice(0, idx),
    item,
    ...cartItems.slice(idx + 1)
  ]
};                                                                <------

const updateCartItem = (book, item = {}, quantity) => {             <------

  const { id = book.id, count = 0, 
          title = book.title, total = 0 } = item;

  return {
    id,
    title,
    count: count + quantity,
    total: total + quantity * book.price  // Уменьшаем и увеличение кол-во книг на 1
  }
};                                                                  <------

const updateOrder = (state, bookId, quantity) => {                        <------
  const { bookList: {books}, shoppingCart: {cartItems} } = state;

  const book = books.find(({id}) => id === bookId);  // Поиск книги
  const itemIndex = cartItems.findIndex(({id}) => id === bookId); // Поиск индекса элемента в массиве
  const item = cartItems[itemIndex];
  
  const newItem = updateCartItem(book, item, quantity);
  return {
    orderTotal: 0,           
    cartItems: updateCartItems(cartItems, newItem, itemIndex)
  };
};                                                                          <------

const updateShoppingCart = (state, action) => {                           <------

  if (state === undefined) {
    return {
      cartItems: [],
      orderTotal: 0
    }
  };

  switch (action.type) {
     // Увеличиваю кол-во книг
    case 'BOOK_ADDED_TO_CART':
      return updateOrder(state, action.payload, 1);
    // Уменьшаю кол-во книг
    case 'BOOK_REMOVED_FROM_CART':
      return updateOrder(state, action.payload, -1);
    // Удаляю все книги
    case 'ALL_BOOKS_REMOVED_FROM_CART':
      const item = state.shoppingCart.cartItems.find(({id}) => id === action.payload);
      return updateOrder(state, action.payload, -item.count);
      
    default:
      return state.shoppingCart;
  };
};                                                                    <------

export default updateShoppingCart;

<!-- book-list.js -->
const updateBookList = (state, action) => {                           <---------

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

export default updateBookList;                                        <---------
