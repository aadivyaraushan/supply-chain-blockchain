import React from 'react';
import {useParams} from 'react-router-dom';
import {useEth} from '../../../contexts/EthContext';
import Button from '../../common/Button';

const VerifyDocumentsBuyer = ({setMessageKey, setError}) => {
    const {hash} = useParams();
    const {state} = useEth();
    const onClick = async () => {
        const advancePercent = Number(
            await state.contract.methods
                .getAdvancePercentForTrader(hash)
                .call({from: state.accounts[0]})
        );
        const {2: _quantity} = await state.contract.methods
            .getCommodityAndQuantity(hash)
            .call({from: state.accounts[0]});
        const quantity = _quantity / 100;
        const amount = Number(
            await state.contract.methods
                .getAmountToTrader(hash)
                .call({from: state.accounts[0]})
        );
        const trader = await state.contract.methods
            .getTrader(hash)
            .call({from: state.accounts[0]});
        const paidAmount =
            ((100 - advancePercent) / 100) * (Number(quantity) * amount);
        console.log(paidAmount);
        await state.web3.eth
            .sendTransaction({
                to: trader,
                from: state.accounts[0],
                value: state.web3.utils.toWei(String(Math.round(paidAmount)), 'gwei'),
            })
            .on('transactionHash', async () => {
                await state?.contract?.methods
                    .updateStateByBuyer(
                        hash,
                        state?.web3.utils.soliditySha3({
                            type: 'string',
                            value: 'DocumentsVerifiedByBuyer',
                        })
                    )
                    .send({from: state.accounts[0]}).on('receipt', () => {
                        window.location.reload();
                    }).on('error', (error) => {
                        setMessageKey(messageKey => messageKey + 1);
                        setError(error.message);
                    });
            })
            .on('error', async () => {
                setMessageKey((messageKey) => messageKey + 1);
                setError(
                    'You must send the amount to the trader before you can verify the documents'
                );
            });
    };

    return (
        <Button
            type='positive'
            size='medium'
            className='w-56 rounded-2xl mr-3'
            onClick={onClick}
        >
            Verify Documents & Pay Trader
        </Button>
    );
};

export default VerifyDocumentsBuyer;
