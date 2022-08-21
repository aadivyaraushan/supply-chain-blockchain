import React from 'react';
import { useParams } from 'react-router-dom';
import { useEth } from '../../../contexts/EthContext';
import Button from '../../common/Button';

const GoodsShipped = () => {
  const { hash } = useParams();
  const { state, dispatch } = useEth();
  const onClick = async () => {
    await state?.contract?.methods
      .ship(hash)
      .send({ from: state?.accounts[0] });
    window.location.reload();
  };

  return (
    <Button
      type='primary'
      size='medium'
      className='w-52 rounded-2xl mr-3'
      onClick={onClick}
    >
      Goods shipped?
    </Button>
  );
};

export default GoodsShipped;
