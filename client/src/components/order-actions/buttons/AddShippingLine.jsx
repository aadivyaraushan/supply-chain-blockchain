import React from 'react';
import Button from '../../common/Button';

const AddShippingLine = ({ onClick }) => {
  return (
    <Button type='primary' onClick={onClick} className='w-48 rounded-2xl mr-3'>
      Add Shipping Line
    </Button>
  );
};

export default AddShippingLine;
