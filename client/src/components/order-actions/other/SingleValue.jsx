import React from 'react';

function SingleValue({ children, innerProps, getValue, isDisabled }) {
  return !isDisabled ? <p className='text-black'>{children.email}</p> : null;
}

export default SingleValue;
