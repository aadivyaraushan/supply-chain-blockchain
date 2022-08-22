import React from 'react';
import { useParams } from 'react-router-dom';
import { useEth } from '../../../contexts/EthContext';
import Button from '../../common/Button';
import message from "../../common/Message";

const ConfirmOrderShippingLineToSupplier = ({setMessageKey, setError}) => {
  const { state, dispatch } = useEth();
  const { hash } = useParams();
  const onClick = async () => {
    await state?.contract?.methods
      .confirmOrderShippingLineToSupplier(hash)
      .send({ from: state.accounts[0] }).on('receipt', () => {
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

export default ConfirmOrderShippingLineToSupplier;
