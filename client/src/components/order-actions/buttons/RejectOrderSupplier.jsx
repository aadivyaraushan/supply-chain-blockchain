import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEth } from '../../../contexts/EthContext';
import Button from '../../common/Button';

const RejectOrderSupplier = () => {
  const { state, dispatch } = useEth();
  const { hash, address } = useParams();
  const [accountType, setAccountType] = useState('');
  const [supplier, setSupplier] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getAccountType = async () => {
      if (await state.contract?.methods.traders(state.accounts[0]).call()) {
        setAccountType('trader');
      } else if (
        await state.contract?.methods.suppliers(state.accounts[0]).call()
      ) {
        setAccountType('supplier');
      }
    };
    getAccountType();
  }, []);

  useEffect(() => {
    if (accountType === 'trader') {
      const getSupplier = async () => {
        setSupplier(
          await state.contract?.methods
            .getSupplier(hash)
            .call({ from: state.accounts[0] })
        );
      };
      getSupplier();
    } else if (accountType === 'supplier') {
      setSupplier(state.accounts[0]);
    }
  }, [accountType]);

  const onClick = async () => {
    await state?.contract?.methods
      .rejectOrderSupplierOrTrader(hash, supplier)
      .send({ from: state.accounts[0] });
    if (accountType === 'supplier') {
      navigate(-1);
    } else {
      window.location.reload();
    }
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

export default RejectOrderSupplier;
