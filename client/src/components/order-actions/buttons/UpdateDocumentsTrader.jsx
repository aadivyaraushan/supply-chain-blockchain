import React from 'react';
import Button from '../../common/Button';

const UpdateDocumentsTrader = ({ onClick }) => {
  return (
    <Button
      type='primary'
      size='medium'
      className='w-60 rounded-2xl mr-3'
      onClick={onClick}
    >
      Update Documents
    </Button>
  );
};

export default UpdateDocumentsTrader;
