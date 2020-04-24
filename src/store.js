import { createStore, compose, applyMiddleware } from 'redux';
import reducer from './reducers/index';

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const store = createStore(reducer, composeEnhancers(applyMiddleware(...middleware)
// ));

// const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && 
//   window.__REDUX_DEVTOOLS_EXTENSION__());

const logMiddleware = ({getState, dispatch}) => (next) => (action) => {
  console.log(action.type, getState())
  return next(action);
};

const stringMiddleware =() => (next) => (action) => {
  if (typeof action === 'string') {
    return next({
      type: action
    });
  }
  return next(action);
};

// const logEnhancer = (createStore) => (...args) => {
//   const store = createStore(...args);
//   const originalDispatch = store.dispatch;
//   store.dispatch = (action) => {
//     console.log(action.type)
//     return originalDispatch(action);
//   };

//   return store;
// };

// const stringEnhancer = (createStore) => (...args) => {
//   const store = createStore(...args);
//   const originalDispatch = store.dispatch;
//   store.dispatch = (action) => {

//     if (typeof action === 'string') {
//       return originalDispatch({
//         type: action
//       });
//     }

//     return originalDispatch(action);
//   };

//   return store;
// };

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(applyMiddleware(
  stringMiddleware, logMiddleware )));

store.dispatch('HELLO')

export default store;