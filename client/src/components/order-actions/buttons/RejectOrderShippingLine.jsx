import React, { useEffect, useState } from 'react';
import { useEth } from '../../../contexts/EthContext';
import Button from '../../common/Button';
import { useNavigate, useParams } from 'react-router-dom';

const RejectOrderShippingLine = ({setMessageKey, setError}) => {
  const { state, dispatch } = useEth();
  const { hash, address } = useParams();
  const [shippingLine, setShippingLine] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const getShippingLine = async () => {
      if (
        await state?.contract?.methods?.shippingLines(state.accounts[0]).call()
      ) {
        setShippingLine(state.accounts[0]);
      } else {
        setShippingLine(
          await state?.contract?.methods
            ?.getShippingLine(hash)
            .call({ from: state.accounts[0] })
        );
      }
    };

    getShippingLine();
  }, []);

  const onClick = async () => {
    await state?.contract?.methods
      .rejectOrderShippingLine(hash, shippingLine)
      .send({ from: state.accounts[0] }).on('receipt', () => {
          if (shippingLine === state.accounts[0]) {
            navigate(-1);
          } else {
            window.location.reload();
          }
      }).on('error', (error) => {
          setMessageKey(messageKey => messageKey + 1);
          setError(error.message);
        })
  };

  return (
    <Button
      type='negative'
      size='medium'
      className='w-48 rounded-2xl'
      onClick={onClick}
    >
      Reject Order
    </Button>
  );
};

export default RejectOrderShippingLine;
