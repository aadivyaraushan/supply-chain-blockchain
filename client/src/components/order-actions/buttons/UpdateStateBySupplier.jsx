import React from 'react';
import Button from '../../common/Button';

const UpdateStateBySupplier = ({ onClick }) => {
  return (
    <Button
      type='primary'
      size='medium'
      className='rounded-2xl mr-3 w-48'
      onClick={onClick}
    >
      Update Status
    </Button>
  );
};

export default UpdateStateBySupplier;
