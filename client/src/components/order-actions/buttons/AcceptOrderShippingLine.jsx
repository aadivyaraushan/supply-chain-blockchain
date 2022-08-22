import React from 'react';
import { useParams } from 'react-router-dom';
import { useEth } from '../../../contexts/EthContext';
import Button from '../../common/Button';

const AcceptOrderShippingLine = ({ setMessageKey, setError }) => {
  const { state} = useEth();
  const { hash } = useParams();
  const onClick = async () => {
    const shippingLineAddress = await state.contract.methods
      .getShippingLine(hash)
      .call({ from: state.accounts[0] });
    const amount = Number(
      await state.contract.methods
        .getAmountToShippingLine(hash)
        .call({ from: state.accounts[0] })
    );
    const { 2: _quantity } = await state.contract.methods
      .getCommodityAndQuantity(hash)
      .call({ from: state.accounts[0] });
    const quantity = _quantity / 100;
    state.web3.eth
      .sendTransaction({
        from: state.accounts[0],
        to: shippingLineAddress,
        value: state.web3.utils.toWei(
          String(amount * Number(quantity)),
          'gwei'
        ),
      })
      .on('receipt', async () => {
        await state?.contract?.methods
          .acceptOrderShippingLine(hash)
          .send({ from: state.accounts[0] }).on('receipt', () => {
              window.location.reload();
            }).on('error', (error) => {
              setMessageKey(messageKey => messageKey + 1);
              setError(error.message);
            })
      })
      .on('error', async () => {
        setMessageKey((messageKey) => messageKey + 1);
        setError('You must pay the amount before you accept the order');
      });
  };

  return (
    <Button
      type='positive'
      onClick={onClick}
      size='medium'
      className='w-48 rounded-2xl mr-3'
    >
      Accept Order
    </Button>
  );
};

export default AcceptOrderShippingLine;
