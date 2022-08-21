import React from 'react';
import Button from '../../common/Button';

const UploadBL = ({ onClick }) => {
  return (
    <Button
      type='primary'
      size='medium'
      className='w-52 rounded-2xl mr-3'
      onClick={onClick}
    >
      Upload BL
    </Button>
  );
};

export default UploadBL;
