import React, { useState } from 'react';
import Button from '../../common/Button';

const RevertOrder = ({ onClick }) => {
  return (
    <div>
      <Button
        type='primary'
        size='medium'
        className='w-48 rounded-2xl mr-3'
        onClick={onClick}
      >
        Revert Order
      </Button>
    </div>
  );
};

export default RevertOrder;
