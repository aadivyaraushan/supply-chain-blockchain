import React from 'react';
import Button from '../../common/Button';

const AddSupplierToOrder = ({ onClick }) => {
  return (
    <Button
      type='primary'
      onClick={onClick}
      className='w-48 rounded-2xl mr-3'
      size='medium'
    >
      Add Supplier
    </Button>
  );
};

export default AddSupplierToOrder;
