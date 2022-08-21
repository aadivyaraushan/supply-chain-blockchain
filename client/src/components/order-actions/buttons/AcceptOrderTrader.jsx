import React from 'react';
import { useParams } from 'react-router-dom';
import { useEth } from '../../../contexts/EthContext';
import Button from '../../common/Button';

const AcceptOrderTrader = ({ setMessageKey, setError }) => {
  const { state} = useEth();
  const { hash } = useParams();
  const onPress = async () => {
    const advancePercent = Number(
      await state.contract.methods
        .getAdvancePercentForTrader(hash)
        .call({ from: state.accounts[0] })
    );
    if (advancePercent > 0) {
      const { 1: _quantity } = await state.contract.methods
        .getCommodityAndQuantity(hash)
        .call({ from: state.accounts[0] });
      const quantity = _quantity / 100;
      const amount = Number(
        await state.contract.methods
          .getAmountToTrader(hash)
          .call({ from: state.accounts[0] })
      );
      const trader = await state.contract.methods
        .getTrader(hash)
        .call({ from: state.accounts[0] });
      const advancePayment =
        (advancePercent / 100) * (Number(quantity) * amount);
      console.log(advancePayment);
      state.web3.eth
        .sendTransaction({
          to: trader,
          from: state.accounts[0],
          value: state.web3.utils.toWei(String(advancePayment), 'gwei'),
        })
        .on('transactionHash', async () => {
          await state.contract.methods
            .acceptOrderTrader(hash)
            .send({ from: state.accounts[0] });
          window.location.reload();
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
        .acceptOrderTrader(hash)
        .send({ from: state.accounts[0] });
      window.location.reload();
    }
  };

  return (
    <Button
      type='positive'
      size='medium'
      className='w-48 rounded-2xl mr-3'
      onClick={onPress}
    >
      Accept Order
    </Button>
  );
};

export default AcceptOrderTrader;
