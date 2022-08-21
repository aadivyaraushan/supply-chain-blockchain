import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Topbar from '../../components/common/Topbar';
import AcceptOrderTrader from '../../components/order-actions/buttons/AcceptOrderTrader';
import RejectOrderTrader from '../../components/order-actions/buttons/RejectOrderTrader';
import RevertOrder from '../../components/order-actions/buttons/RevertOrder';
import VerifyDocumentsBuyer from '../../components/order-actions/buttons/VerifyDocumentsBuyer';
import { useEth } from '../../contexts/EthContext';
import { STATES } from '../../utils/states';
import { UNITS } from '../../utils/units';
import { DataStore } from 'aws-amplify';
import { Users } from '../../models';
import { getCurrencyConversion } from '../../utils/getCurrencyConversion';
import { makeStorageClient } from '../../utils/web3storage';
import { saveAs } from 'file-saver';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEye } from '@fortawesome/free-solid-svg-icons';
import RevertOrderTraderModal from '../../components/order-actions/modals/RevertOrderTraderModal';
import { checkAmount } from '../../utils/checkAmount';
import { checkPercent } from '../../utils/checkPercent';
import CloseOrder from '../../components/order-actions/buttons/CloseOrder';
import Message from '../../components/common/Message';
import PDF from '../../components/common/PDF';

const BuyerOrderPage = () => {
  const [orderState, setOrderState] = useState('');
  const { state, dispatch } = useEth();
  const [orderDetails, setOrderDetails] = useState({});
  const [documents, setDocuments] = useState([]);
  const [revertOrderTraderVisible, setRevertOrderTraderVisible] =
    useState(false);
  const { hash } = useParams();
  const [messageKey, setMessageKey] = useState(0);
  const [error, setError] = useState('');
  const [inputError, setInputError] = useState('');
  const [viewedPDF, setViewedPDF] = useState(null);

  const onSubmitRevertTrader = async () => {
    if (checkAmount(orderDetails.amountToTrader)) {
      setMessageKey((messageKey) => messageKey + 1);
      setInputError(checkAmount(orderDetails.amountToTrader));
    } else if (checkPercent(orderDetails.percentAdvanceForTrader)) {
      setMessageKey((messageKey) => messageKey + 1);
      setInputError(checkPercent(orderDetails.percentAdvanceForTrader));
    } else {
      const currencyConversion = await getCurrencyConversion();
      const amountToTrader = String(
        Math.round(
          (orderDetails.amountToTrader / Number(currencyConversion)) *
            1000000000
        )
      );
      await state.contract?.methods
        .revertOrderBuyerOrTrader(
          hash,
          amountToTrader,
          orderDetails.percentAdvanceForTrader
        )
        .send({ from: state.accounts[0] });
      window.location.reload();
    }
  };

  useEffect(() => {
    const getOrderState = async () => {
      const orderState = await state.contract?.methods
        .getState(hash)
        .call({ from: state.accounts[0] });
      console.log('order state: ', orderState);
      setOrderState(orderState);
    };
    getOrderState();

    const getCommodityAndQuantity = async () => {
      if (state.contract) {
        const {
          0: commodity,
          1: quantity,
          2: finalQuantity,
          3: unit,
        } = await state?.contract?.methods
          .getCommodityAndQuantity(hash)
          .call({ from: state.accounts[0] });
        console.log('final quantity: ', finalQuantity, typeof finalQuantity);
        console.log('condition: ', finalQuantity !== '0');

        setOrderDetails((orderDetails) => ({
          ...orderDetails,
          commodity,
          quantity: String(Number(quantity) / 100),
          finalQuantity: String(Number(finalQuantity) / 100),
          unit: UNITS[unit],
        }));
      }
    };
    getCommodityAndQuantity();

    const getTrader = async () => {
      const traderAddress = await state?.contract?.methods
        .getTrader(hash)
        .call({ from: state.accounts[0] });
      const traderDetails = await DataStore.query(Users, (c) =>
        c.address('eq', traderAddress)
      );
      console.log('got trader: ', traderDetails);
      if (traderDetails[0]) {
        setOrderDetails((orderDetails) => ({
          ...orderDetails,
          traderEmail: traderDetails[0].email,
          traderName: traderDetails[0].name,
        }));
      }
    };

    getTrader();

    const getAmountToTrader = async () => {
      const amountInGwei = await state.contract?.methods
        .getAmountToTrader(hash)
        .call({ from: state.accounts[0] });
      console.log(amountInGwei);
      const amountInDollars =
        (amountInGwei / 1000000000) * Number(await getCurrencyConversion());
      console.log(amountInDollars);
      // 1 matic = x dollars
      // x = matic/dollars
      if (amountInDollars) {
        setOrderDetails((orderDetails) => ({
          ...orderDetails,
          amountToTrader: amountInDollars,
        }));
      }
    };

    getAmountToTrader();

    const getPercentAdvanceForTrader = async () => {
      const percentAdvanceForTrader = await state.contract?.methods
        .getAdvancePercentForTrader(hash)
        .call({ from: state.accounts[0] });
      setOrderDetails((orderDetails) => ({
        ...orderDetails,
        percentAdvanceForTrader:
          percentAdvanceForTrader === '0'
            ? 'No advance payment'
            : `${percentAdvanceForTrader}%`,
      }));
    };

    getPercentAdvanceForTrader();
  }, [state, hash]);

  useEffect(() => {
    if (orderState !== '' && orderState) {
      setOrderDetails((orderDetails) => ({
        ...orderDetails,
        state: STATES[orderState]['buyer'],
      }));
    }

    if (orderState === '26' || orderState === '27') {
      const getDocuments = async () => {
        const {
          0: PlCid,
          1: BlCid,
          2: invoiceCid,
        } = await state?.contract?.methods
          .getDocumentsFromTrader(hash)
          .call({ from: state.accounts[0] });
        const client = makeStorageClient();
        const Pl = await (await client.get(PlCid)).files();
        const Bl = await (await client.get(BlCid)).files();
        const invoice = await (await client.get(invoiceCid)).files();
        setDocuments([Pl[0], Bl[0], invoice[0]]);
        // window.location.reload();
      };

      getDocuments();
    }
  }, [orderState]);

  return (
    <div>
      <Topbar />
      <h1 className='ml-9 text-5xl mt-3 font-bold flex-1'>
        Order {hash.substring(0, 10)}...
      </h1>
      <>
        <p className='ml-12 text-3xl mt-3'>
          <span className='font-medium'>Trader: </span>{' '}
          {orderDetails?.traderName}({orderDetails?.traderEmail})
        </p>
        <p className='ml-12 text-3xl mt-3'>
          <span className='font-medium'>Amount per unit to trader: </span> $
          {orderDetails?.amountToTrader?.toFixed('2')}
        </p>
        <p className='ml-12 text-3xl mt-3'>
          <span className='font-medium'>
            Percent of advance payment from trader:{' '}
          </span>{' '}
          {orderDetails?.percentAdvanceForTrader}
        </p>
        <p className='ml-12 text-3xl mt-3'>
          <span className='font-medium'>Status: </span>{' '}
          <span className=' bg-blue-200 p-2 rounded-2xl'>
            {orderDetails?.state}
          </span>
        </p>
        <p className='ml-12 text-3xl mt-3'>
          <span className='font-medium'>Commodity: </span>{' '}
          {orderDetails?.commodity}
        </p>
        <p className='ml-12 text-3xl mt-3'>
          <span className='font-medium'>Quantity: </span>{' '}
          {orderDetails?.quantity} {orderDetails?.unit}
        </p>
        {orderDetails?.finalQuantity !== '0' && (
          <p className='ml-12 text-3xl mt-3'>
            <span className='font-medium'>Final Quantity: </span>{' '}
            {orderDetails?.finalQuantity} {orderDetails?.unit}
          </p>
        )}
        {(orderState === '26' || orderState === '27') && (
          <>
            <p className='ml-12 text-3xl mt-3 font-medium'>Documents:</p>
            <p className='ml-14 text-2xl mt-3'>
              <span>PL</span>
              <button
                onClick={() => {
                  console.log(documents[0]);
                  if (orderState === '27')
                    saveAs(URL.createObjectURL(documents[0]), 'PL.pdf');
                  else {
                    setViewedPDF(documents[0]);
                  }
                }}
              >
                {orderState === '27' && (
                  <FontAwesomeIcon
                    icon={faDownload}
                    className='ml-2 text-2xl'
                  />
                )}
                {orderState === '26' && (
                  <FontAwesomeIcon icon={faEye} className='ml-2 text-2xl' />
                )}
              </button>
            </p>
            <p className='ml-14 text-2xl mt-3'>
              <span>BL</span>
              <button
                onClick={() => {
                  if (orderState === '27')
                    saveAs(URL.createObjectURL(documents[1]), 'BL.pdf');
                  else {
                    setViewedPDF(documents[1]);
                  }
                }}
              >
                {orderState === '27' && (
                  <FontAwesomeIcon
                    icon={faDownload}
                    className='ml-2 text-2xl'
                  />
                )}
                {orderState === '26' && (
                  <FontAwesomeIcon icon={faEye} className='ml-2 text-2xl' />
                )}
              </button>
            </p>
            <p className='ml-14 text-2xl mt-3'>
              <span>Invoice</span>
              <button
                onClick={() => {
                  if (orderState === '27')
                    saveAs(URL.createObjectURL(documents[2]), 'invoice.pdf');
                  else {
                    setViewedPDF(documents[2]);
                  }
                }}
              >
                {orderState === '27' && (
                  <FontAwesomeIcon
                    icon={faDownload}
                    className='ml-2 text-2xl'
                  />
                )}
                {orderState === '26' && (
                  <FontAwesomeIcon icon={faEye} className='ml-2 text-2xl' />
                )}
              </button>
            </p>
          </>
        )}
        {error && (
          <Message type='error' className='mx-5 p-4 text-2xl' key={messageKey}>
            {error}
          </Message>
        )}
      </>
      <div className='absolute bottom-2 right-2 w-full flex-1'>
        <div className='flex flex-row-reverse w-full'>
          {orderState === '2' && (
            <>
              <RejectOrderTrader />
              <RevertOrder onClick={() => setRevertOrderTraderVisible(true)} />
            </>
          )}
          {(orderState === '2' || orderState === '4') && (
            <AcceptOrderTrader
              setMessageKey={setMessageKey}
              setError={setError}
            />
          )}
          {orderState === '26' && <VerifyDocumentsBuyer />}
          {orderState === '27' && <CloseOrder />}
        </div>
      </div>
      <>
        {revertOrderTraderVisible && (
          <RevertOrderTraderModal
            key={messageKey}
            onClose={() => setRevertOrderTraderVisible(false)}
            accountType={'buyer'}
            onChangeAmount={(e) =>
              setOrderDetails((orderDetails) => ({
                ...orderDetails,
                amountToTrader: Number(e.target.value),
              }))
            }
            onChangePercent={(e) =>
              setOrderDetails((orderDetails) => ({
                ...orderDetails,
                percentAdvanceForTrader: Number(e.target.value),
              }))
            }
            error={inputError}
            onSubmit={onSubmitRevertTrader}
          />
        )}
      </>
      {viewedPDF && (
        <PDF PDF={viewedPDF} onClose={() => setViewedPDF(false)} className='' />
      )}
    </div>
  );
};

export default BuyerOrderPage;
