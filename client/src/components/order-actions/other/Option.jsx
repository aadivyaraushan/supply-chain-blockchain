import React from 'react';

function Option({ children, innerProps, getValue, isDisabled }) {
  return !isDisabled ? (
    <div {...innerProps} className='my-2 ml-2'>
      <p className=' text-base'>{children?.email}</p>
      <p className='text-xs'>{children?.desc}</p>
    </div>
  ) : null;
}

export default Option;
