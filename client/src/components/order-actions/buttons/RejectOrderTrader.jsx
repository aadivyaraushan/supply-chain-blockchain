import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEth } from '../../../contexts/EthContext';
import Button from '../../common/Button';

const RejectOrderTrader = ({setMessageKey, setError}) => {
  const { state, dispatch } = useEth();
  const { hash, address } = useParams();
  const [accountType, setAccountType] = useState('');
  const [buyer, setBuyer] = useState(null);
  const [trader, setTrader] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getAccountType = async () => {
      if (await state.contract?.methods.buyers(state.accounts[0]).call()) {
        setAccountType('buyer');
      } else if (
        await state.contract?.methods.traders(state.accounts[0]).call()
      ) {
        setAccountType('trader');
      }
    };
    getAccountType();
  }, []);
  useEffect(() => {
    if (accountType !== '') {
      if (accountType === 'buyer') {
        setBuyer(state.accounts[0]);
        const getTrader = async () => {
          setTrader(
            await state.contract?.methods
              .getTrader(hash)
              .call({ from: state.accounts[0] })
          );
        };
        getTrader();
      } else if (accountType === 'trader') {
        setTrader(state.accounts[0]);
        const getBuyer = async () => {
          setBuyer(
            await state.contract?.methods
              .getBuyer(hash)
              .call({ from: state.accounts[0] })
          );
        };
        getBuyer();
      }
    }
  }, [accountType]);

  const onClick = async () => {
    await state.contract.methods
      .rejectOrderBuyerOrTrader(hash, buyer, trader)
      .send({ from: state.accounts[0] }).on('receipt', () => {
          navigate(-1);
        }).on('error', (error) => {
          setMessageKey(messageKey => messageKey + 1);
          setError(error.message);
        });
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

export default RejectOrderTrader;
