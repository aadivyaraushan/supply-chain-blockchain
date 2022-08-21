import React from 'react';
import Button from '../../common/Button';

const ProductionComplete = ({ onClick }) => {
  return (
    <Button
      type='positive'
      size='medium'
      className='w-72 rounded-2xl mr-3'
      onClick={onClick}
    >
      Complete Production
    </Button>
  );
};

export default ProductionComplete;
