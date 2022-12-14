import React from 'react';
import { useParams } from 'react-router-dom';
import { useEth } from '../../../contexts/EthContext';
import Button from '../../common/Button';

const ConfirmOrderTraderToBuyer = ({setMessageKey, setError}) => {
  const { state, dispatch } = useEth();
  const { hash } = useParams();
  const onPress = async () => {
    console.log('pressed');
    await state.contract.methods
      .confirmOrderTraderToBuyer(hash)
      .send({ from: state.accounts[0] }).on('receipt', () => {
          window.location.reload();
        }).on('error', error => {
          setMessageKey(messageKey => messageKey + 1);
          setError(error.message);
        });
  };

  return (
    <Button
      type='positive'
      size='medium'
      className='w-48 rounded-2xl mr-3'
      onClick={onPress}
    >
      Confirm Order
    </Button>
  );
};

export default ConfirmOrderTraderToBuyer;
