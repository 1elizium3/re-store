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
      <img src={anonymous} alt='error-icon'/>
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