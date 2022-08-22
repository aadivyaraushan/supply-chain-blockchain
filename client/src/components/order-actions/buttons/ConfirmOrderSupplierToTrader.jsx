import React from 'react';
import { useParams } from 'react-router-dom';
import { useEth } from '../../../contexts/EthContext';
import Button from '../../common/Button';

const ConfirmOrderSupplierToTrader = ({setMessageKey, setError}) => {
  const { state, dispatch } = useEth();
  const { hash } = useParams();
  const onClick = async () => {
    console.log('pressed');
    await state.contract.methods
      .confirmOrderSupplierToTrader(hash)
      .send({ from: state.accounts[0] }).on('receipt', (receipt) => {
          window.location.reload();
        }).on('error', (error) => {
          setMessageKey(messageKey => messageKey + 1);
          setError(error.message);
        });
  };
  return (
    <Button
      type='positive'
      size='medium'
      className='w-48 rounded-2xl mr-3'
      onClick={onClick}
    >
      Confirm Order
    </Button>
  );
};

export default ConfirmOrderSupplierToTrader;
