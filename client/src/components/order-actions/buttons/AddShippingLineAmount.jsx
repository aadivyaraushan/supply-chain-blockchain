import React from 'react';
import Button from '../../common/Button';

const AddShippingLineAmount = ({ onClick }) => {
  return (
    <Button
      type='primary'
      size='medium'
      className='w-60 rounded-2xl mr-3'
      onClick={onClick}
    >
      Specify amount
    </Button>
  );
};

export default AddShippingLineAmount;
