import React from 'react';
import { useParams } from 'react-router-dom';
import { useEth } from '../../../contexts/EthContext';
import Button from '../../common/Button';

const VerifyDocumentsTrader = ({ setMessageKey, setError }) => {
  const { hash } = useParams();
  const { state, dispatch } = useEth();
  const onClick = async () => {
    const advancePercent = Number(
      await state.contract.methods
        .getAdvancePercentForSupplier(hash)
        .call({ from: state.accounts[0] })
    );
    const { 2: _quantity } = await state.contract.methods
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
    const paidAmount =
      ((100 - advancePercent) / 100) * (Number(quantity) * amount);
    console.log(paidAmount);
    await state.web3.eth
      .sendTransaction({
        to: supplier,
        from: state.accounts[0],
        value: state.web3.utils.toWei(String(paidAmount), 'gwei'),
      })
      .on('transactionHash', async () => {
        await state?.contract?.methods
          .updateStateByTrader(
            hash,
            state?.web3.utils.soliditySha3({
              type: 'string',
              value: 'DocumentsVerifiedByTrader',
            })
          )
          .send({ from: state.accounts[0] });
        window.location.reload();
      })
      .on('error', async () => {
        setMessageKey((messageKey) => messageKey + 1);
        setError(
          'You must send the amount to the supplier before you can verify(and later update) the documents'
        );
      });
  };

  return (
    <Button
      type='positive'
      size='medium'
      className='w-56  rounded-2xl mr-3'
      onClick={onClick}
    >
      Verify Documents
    </Button>
  );
};

export default VerifyDocumentsTrader;
