import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEth } from '../../../contexts/EthContext';
import Button from '../../common/Button';

const CloseOrder = ({setMessageKey, setError}) => {
  const { hash } = useParams();
  const { state, dispatch } = useEth();
  const navigate = useNavigate();
  const onClick = async () => {
    await state?.contract?.methods
      .updateStateByBuyer(
        hash,
        state?.web3.utils.soliditySha3({
          type: 'string',
          value: 'Closed',
        })
      )
      .send({ from: state.accounts[0] }).on('receipt', () => {
          navigate(-1);
        }).on('error', (error) => {
            setMessageKey(messageKey => messageKey + 1);
            setError(error.message);
        });

    // payment
  };

  return (
    <Button
      type='primary'
      size='medium'
      className='w-56 rounded-2xl mr-3'
      onClick={onClick}
    >
      Close Order
    </Button>
  );
};

export default CloseOrder;
