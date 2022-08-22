import React from 'react';
import Button from '../../common/Button';
import { useEth } from '../../../contexts/EthContext';
import { useParams } from 'react-router-dom';

const AcceptOrderSupplier = ({ setMessageKey, setError }) => {
  const { state} = useEth();
  const { hash } = useParams();
  const onClick = async () => {
    const advancePercent = Number(
      await state.contract.methods
        .getAdvancePercentForSupplier(hash)
        .call({ from: state.accounts[0] })
    );
    if (advancePercent > 0) {
      const { 1: _quantity } = await state.contract.methods
        .getCommodityAndQuantity(hash)
        .call({ from: state.accounts[0] });
      const quantity = _quantity / 100;
      const amount = Number(
        await state.contract.methods
          .getAmountToSupplier(hash)
          .call({ from: state.accounts[0] })
      );
      const supplier = await state.contract.methods
        .getSupplier(hash)
        .call({ from: state.accounts[0] });
      const advancePayment =
        (advancePercent / 100) * (Number(quantity) * amount);
      console.log(advancePayment);
      state.web3.eth
        .sendTransaction({
          to: supplier,
          from: state.accounts[0],
          value: state.web3.utils.toWei(String(advancePayment), 'gwei'),
        })
        .on('receipt', async () => {
          await state.contract.methods
            .acceptOrderSupplier(hash)
            .send({ from: state.accounts[0] }).on('receipt', () => {
                window.location.reload();
              }).on('error', (error) => {
                setMessageKey(messageKey => messageKey + 1);
                setError(error.message);
              })
        })
        .on('error', async () => {
          console.log('error returned');
          setMessageKey((messageKey) => messageKey + 1);
          setError(
            'You must give the advance payment before you can accept the order'
          );
        });
    } else {
      await state.contract.methods
        .acceptOrderSupplier(hash)
        .send({ from: state.accounts[0] }).on('receipt', () => {
            window.location.reload();
          }).on('error', (error) => {
            setMessageKey(messageKey => messageKey + 1);
            setError(error.message);
          })
    }
  };
  return (
    <Button
      type='positive'
      size='medium'
      className='w-48 rounded-2xl mr-3'
      onClick={onClick}
    >
      Accept Order
    </Button>
  );
};

export default AcceptOrderSupplier;
