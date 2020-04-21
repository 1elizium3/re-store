import React from 'react';
import { BookstoreServiceConsumer } from '../bookstore-service-context';


const withBookstoreService = () => (Wrapped) =>{

  return function WithBookstoreService(props) {
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

export default withBookstoreService;