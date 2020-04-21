import { createStore, compose } from 'redux';
import reducer from './reducers/index';

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const store = createStore(reducer, composeEnhancers(applyMiddleware(...middleware)
// ));

const stringEnhancer = (createStore) => (...args) => {
  const store = createStore(...args);
  const originalDispatch = store.dispatch;
  store.dispatch = (action) => {

    if (typeof action === 'string') {
      return originalDispatch({
        type: action
      });
    }

    return originalDispatch(action);
  };

  return store;
};

const logEnhancer = (createStore) => (...args) => {
  const store = createStore(...args);
  const originalDispatch = store.dispatch;
  store.dispatch = (action) => {
    console.log(action.type)
    return originalDispatch(action);
  };

  return store;
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(stringEnhancer, logEnhancer));

// const store = createStore(reducer, /*window.__REDUX_DEVTOOLS_EXTENSION__ && 
//   window.__REDUX_DEVTOOLS_EXTENSION__(),*/ logEnhancer);
// const store = createStore(reducer, 
//               compose(stringEnhancer, logEnhancer));


// Monkey patch
// const originalDispatch = store.dispatch;
// store.dispatch = (action) => {

//   if (typeof action === 'string') {
//     return originalDispatch({
//       type: action
//     });
//   }

//   return originalDispatch(action);
// };

store.dispatch('HELLO')

export default store;