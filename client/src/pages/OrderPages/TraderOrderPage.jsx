import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Topbar from '../../components/common/Topbar';
import AcceptOrderSupplier from '../../components/order-actions/buttons/AcceptOrderSupplier';
import AddSupplierToOrder from '../../components/order-actions/buttons/AddSupplierToOrder';
import ConfirmOrderTraderToBuyer from '../../components/order-actions/buttons/ConfirmOrderTraderToBuyer';
import RejectOrderSupplier from '../../components/order-actions/buttons/RejectOrderSupplier';
import RejectOrderTrader from '../../components/order-actions/buttons/RejectOrderTrader';
import RevertOrder from '../../components/order-actions/buttons/RevertOrder';
import UpdateDocumentsTrader from '../../components/order-actions/buttons/UpdateDocumentsTrader';
import VerifyDocumentsTrader from '../../components/order-actions/buttons/VerifyDocumentsTrader';
import RevertOrderTraderModal from '../../components/order-actions/modals/RevertOrderTraderModal';
import AddSupplierModal from '../../components/order-actions/modals/AddSupplierModal';
import { useEth } from '../../contexts/EthContext';
import { STATES } from '../../utils/states';
import Option from '../../components/order-actions/other/Option';
import SingleValue from '../../components/order-actions/other/SingleValue';
import { UNITS } from '../../utils/units';
import RevertOrderSupplierModal from '../../components/order-actions/modals/RevertOrderSupplierModal';
import { UpdateDocumentsModal } from '../../components/order-actions/modals/UpdateDocumentsModal';
import { faDownload, faTimes, faEye } from '@fortawesome/free-solid-svg-icons';
import { checkAmount } from '../../utils/checkAmount';
import { checkPercent } from '../../utils/checkPercent';
import { getCurrencyConversion } from '../../utils/getCurrencyConversion';
import { makeStorageClient } from '../../utils/web3storage';
import { DataStore } from 'aws-amplify';
import { Users } from '../../models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { saveAs } from 'file-saver';
import Message from '../../components/common/Message';
import PDF from '../../components/common/PDF';

const TraderOrderPage = () => {
  const { state } = useEth();
  const { hash } = useParams();
  const [orderDetails, setOrderDetails] = useState({});
  const [newOrderDetails, setNewOrderDetails] = useState({});
  const [orderState, setOrderState] = useState('');
  const [documents, setDocuments] = useState([]);
  const [revertOrderTraderVisible, setRevertOrderTraderVisible] =
    useState(false);
  const [addSupplierVisible, setAddSupplierVisible] = useState(false);
  const [revertOrderSupplierVisible, setRevertOrderSupplierVisible] =
    useState(false);
  const [updateDocumentsVisible, setUpdateDocumentsVisible] = useState(false);
  const [supplierSelectOptions, setSupplierSelectOptions] = useState([{}]);
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
          .send({ from: state.accounts[0] }).on('receipt', () => {
            window.location.reload();
          }).on('error', (error) => {
            setMessageKey(messageKey => messageKey + 1);
            setError(error.message);
          });
    }
  };

  const onSubmitAddSupplier = async () => {
    console.log(newOrderDetails);
    if (!newOrderDetails.supplier) {
      setMessageKey((messageKey) => messageKey + 1);
      setInputError('Please select a supplier');
    } else if (checkAmount(newOrderDetails.amountToSupplier)) {
      console.log('amountToSupplier is invalid');
      setMessageKey((messageKey) => messageKey + 1);
      setInputError(checkAmount(newOrderDetails.amountToSupplier));
    } else if (checkPercent(newOrderDetails.percentAdvanceForSupplier)) {
      setMessageKey((messageKey) => messageKey + 1);
      setInputError(checkPercent(newOrderDetails.percentAdvanceForSupplier));
    } else {
      const currencyConversion = await getCurrencyConversion();
      const amountToSupplier = String(
        Math.round(
          (newOrderDetails.amountToSupplier / Number(currencyConversion)) *
            1000000000
        )
      );
      await state?.contract?.methods
        .addSupplierToOrder(
          newOrderDetails.supplier.value.address,
          amountToSupplier,
          newOrderDetails.percentAdvanceForSupplier,
          hash
        )
        .send({ from: state.accounts[0] }).on('receipt', () => {
            window.location.reload();
          }).on('error', (error) => {
            setMessageKey(messageKey => messageKey + 1);
            setError(error.message);
          });
    }
  };

  const onSubmitRevertSupplier = async () => {
    if (checkAmount(orderDetails.amountToSupplier)) {
      setMessageKey((messageKey) => messageKey + 1);
      setInputError(checkAmount(orderDetails.amountToSupplier));
    } else if (checkPercent(orderDetails.percentAdvanceForSupplier)) {
      setMessageKey((messageKey) => messageKey + 1);
      setInputError(checkPercent(orderDetails.percentAdvanceForSupplier));
    } else {
      const amountToSupplier = String(
        Math.round(
          (orderDetails.amountToSupplier /
            Number(await getCurrencyConversion())) *
            1000000000
        )
      );
      await state.contract?.methods
        .revertOrderSupplierOrTrader(
          hash,
          amountToSupplier,
          orderDetails.percentAdvanceForSupplier
        )
        .send({ from: state.accounts[0] }).on('receipt', () => {
            window.location.reload();
          }).on('error', () => {
            setMessageKey(messageKey => messageKey + 1);
            setError(error.message);
          })
    }
  };

  const onSubmitUpdatedFiles = async () => {
    if (documents.length !== 3) {
      setMessageKey((messageKey) => messageKey + 1);
      setInputError('Please add PL, BL and Invoice(no extra documents');
    } else {
      const client = makeStorageClient();
      const cidPl = await client.put([documents[0]]);
      const cidBl = await client.put([documents[1]]);
      const cidInvoice = await client.put([documents[2]]);
      await state?.contract?.methods
        ?.updateDocumentsFromSupplier(cidInvoice, cidPl, cidBl, hash)
        .send({ from: state.accounts[0] }).on('receipt', () => {
            window.location.reload();
          }).on('error', (error) => {
            setMessageKey(messageKey => messageKey + 1);
            setError(error.message);
          })
    }
  };

  useEffect(() => {
    if (state && hash) {
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
          console.log('quantity: ', quantity, typeof quantity);
          console.log('condition: ', finalQuantity !== '0');
          if (UNITS[unit]) {
            setOrderDetails((orderDetails) => ({
              ...orderDetails,
              commodity,
              quantity: String(Number(quantity) / 100),
              finalQuantity: String(Number(finalQuantity) / 100),
              unit: UNITS[unit],
            }));
          }
        }
      };
      getCommodityAndQuantity();

      const getBuyer = async () => {
        const buyerAddress = await state.contract?.methods
          .getBuyer(hash)
          .call({ from: state.accounts[0] });
        const buyerDetails = await DataStore.query(Users, (c) =>
          c.address('eq', buyerAddress)
        );
        if (buyerDetails[0]) {
          setOrderDetails((orderDetails) => ({
            ...orderDetails,
            buyer: buyerDetails[0].name,
            buyerEmail: buyerDetails[0].email,
          }));
        }
      };

      getBuyer();

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
        if (percentAdvanceForTrader) {
          setOrderDetails((orderDetails) => ({
            ...orderDetails,
            percentAdvanceForTrader:
              percentAdvanceForTrader === '0'
                ? 'No advance payment'
                : `${percentAdvanceForTrader}%`,
          }));
        }
      };

      getPercentAdvanceForTrader();

      const getAmountToSupplier = async () => {
        const amountInGwei = await state.contract?.methods
          .getAmountToSupplier(hash)
          .call({ from: state.accounts[0] });
        console.log(amountInGwei);
        const amountInDollars =
          (amountInGwei / 1000000000) * Number(await getCurrencyConversion());
        // console.log(amountInDollars);
        if (amountInDollars) {
          setOrderDetails((orderDetails) => ({
            ...orderDetails,
            amountToSupplier: amountInDollars,
          }));
        }
      };

      getAmountToSupplier();

      const getPercentAdvanceForSupplier = async () => {
        const percentAdvanceForSupplier = await state.contract?.methods
          .getAdvancePercentForSupplier(hash)
          .call({ from: state.accounts[0] });
        if (percentAdvanceForSupplier) {
          setOrderDetails((orderDetails) => ({
            ...orderDetails,
            percentAdvanceForSupplier:
              percentAdvanceForSupplier === '0'
                ? 'No advance payment'
                : `${percentAdvanceForSupplier}%`,
          }));
        }
      };

      getPercentAdvanceForSupplier();
    }
  }, [state, hash]);

  useEffect(() => {
    console.log('order state just changed: ', orderState, typeof orderState);

    if (orderState !== '' && orderState) {
      setOrderDetails((orderDetails) => ({
        ...orderDetails,
        state: STATES[orderState]['trader'],
      }));
    }

    if (orderState === '5' || orderState === '10') {
      const getSuppliers = async () => {
        console.log('getting suppliers');
        const { ...suppliers } = await DataStore.query(Users, (s) =>
          s.type('eq', 'SUPPLIER')
        );
        console.log(suppliers);
        Object.entries(suppliers).map((entry, index) => {
          const [key, supplier] = entry;
          console.log(
            'supplier: ',
            supplier,
            typeof supplier,
            typeof supplierSelectOptions
          );

          if (
            !supplierSelectOptions.includes({
              value: supplier,
              label: supplier,
            })
          ) {
            setSupplierSelectOptions((supplierSelectOptions) => [
              ...supplierSelectOptions,
              {
                value: supplier,
                label: supplier,
              },
            ]);
          }
        });
      };

      getSuppliers();
    }

    if (orderState === '24' || orderState === '25') {
      const getDocuments = async () => {
        const {
          0: PlCid,
          1: BlCid,
          2: invoiceCid,
        } = await state.contract?.methods
          .getDocumentsFromShippingLine(hash)
          .call({ from: state.accounts[0] });
        const client = makeStorageClient();
        const Pl = await (await client.get(PlCid)).files();
        const Bl = await (await client.get(BlCid)).files();
        const invoice = await (await client.get(invoiceCid)).files();
        setDocuments([Pl[0], Bl[0], invoice[0]]);
      };

      getDocuments();
    }

    if (Number(orderState) >= 6) {
      console.log('orderState: ', Number(orderState));
      const getSupplier = async () => {
        const supplierAddress = await state.contract?.methods
          .getSupplier(hash)
          .call({ from: state.accounts[0] });
        const supplierDetails = await DataStore.query(Users, (c) =>
          c.address('eq', supplierAddress)
        );
        if (supplierDetails[0]) {
          setOrderDetails((orderDetails) => ({
            ...orderDetails,
            supplierName: supplierDetails[0].name,
            supplierEmail: supplierDetails[0].email,
          }));
        }
      };

      getSupplier();
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
          <span className='font-medium'>Buyer: </span>
          {orderDetails.buyer}({orderDetails.buyerEmail})
        </p>
        <p className='ml-12 text-3xl mt-3'>
          <span className='font-medium'>Amount per unit from buyer: </span> $
          {orderDetails?.amountToTrader?.toFixed('2')}
        </p>
        <p className='ml-12 text-3xl mt-3'>
          <span className='font-medium'>
            Percent of advance payment from buyer:{' '}
          </span>
          {orderDetails?.percentAdvanceForTrader}
        </p>
        {Number(orderState) >= 6 && orderState !== '10' && (
          <>
            <p className='ml-12 text-3xl mt-3'>
              <span className='font-medium'>Supplier: </span>{' '}
              {orderDetails?.supplierName}({orderDetails?.supplierEmail})
            </p>
            <p className='ml-12 text-3xl mt-3'>
              <span className='font-medium'>Amount per unit to supplier: </span>
              {' $'}
              {orderDetails?.amountToSupplier?.toFixed(2)}
            </p>
            <p className='ml-12 text-3xl mt-3'>
              <span className='font-medium'>
                Percent of advance payment to supplier:{' '}
              </span>
              {orderDetails?.percentAdvanceForSupplier}
            </p>
          </>
        )}
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
        {(orderState === '24' || orderState === '25') && (
          <>
            <p className='ml-12 text-3xl mt-3 font-medium'>Documents:</p>
            <p className='ml-14 text-2xl mt-3'>
              <span>PL</span>
              <button
                onClick={() => {
                  console.log(documents[0]);
                  if (orderState === '25')
                    saveAs(URL.createObjectURL(documents[0]), 'PL.pdf');
                  else {
                    setViewedPDF(documents[0]);
                  }
                }}
              >
                {orderState === '25' && (
                  <FontAwesomeIcon
                    icon={faDownload}
                    className='ml-2 text-2xl'
                  />
                )}
                {orderState === '24' && (
                  <FontAwesomeIcon icon={faEye} className='ml-2 text-2xl' />
                )}
              </button>
            </p>
            <p className='ml-14 text-2xl mt-3'>
              <span>BL</span>
              <button
                onClick={() => {
                  if (orderState === '25')
                    saveAs(URL.createObjectURL(documents[1]), 'BL.pdf');
                  else {
                    setViewedPDF(documents[1]);
                  }
                }}
              >
                {orderState === '25' && (
                  <FontAwesomeIcon
                    icon={faDownload}
                    className='ml-2 text-2xl'
                  />
                )}
                {orderState === '24' && (
                  <FontAwesomeIcon icon={faEye} className='ml-2 text-2xl' />
                )}
              </button>
            </p>
            <p className='ml-14 text-2xl mt-3'>
              <span>Invoice</span>
              <button
                onClick={() => {
                  if (orderState === '25')
                    saveAs(URL.createObjectURL(documents[2]), 'invoice.pdf');
                  else {
                    setViewedPDF(documents[2]);
                  }
                }}
              >
                {orderState === '25' && (
                  <FontAwesomeIcon
                    icon={faDownload}
                    className='ml-2 text-2xl'
                  />
                )}
                {orderState === '24' && (
                  <FontAwesomeIcon icon={faEye} className='ml-2 text-2xl' />
                )}
              </button>
            </p>
          </>
        )}
      </>
      <div className='absolute bottom-2 right-3 w-full flex-1'>
        <div className='flex flex-row-reverse w-full'>
          {(orderState === '1' || orderState === '3') && (
            <>
              <RejectOrderTrader setError={setError} setMessageKey={setMessageKey}/>
              <RevertOrder onClick={() => setRevertOrderTraderVisible(true)} />
            </>
          )}
          {(orderState === '5' || orderState === '10') && (
            <AddSupplierToOrder onClick={() => setAddSupplierVisible(true)} />
          )}
          {orderState === '7' && (
            <>
              <RejectOrderSupplier setError={setError} setMessageKey={setMessageKey} />
              <RevertOrder
                onClick={() => setRevertOrderSupplierVisible(true)}
              />
            </>
          )}
          {(orderState === '1' || orderState === '3') && (
            <ConfirmOrderTraderToBuyer setMessageKey={setMessageKey} setError={setError} />
          )}
          {(orderState === '7' || orderState === '9') && (
            <AcceptOrderSupplier
              setError={setError}
              setMessageKey={setMessageKey}
            />
          )}
          {orderState === '24' && <VerifyDocumentsTrader />}
          {orderState === '25' && (
            <UpdateDocumentsTrader
              onClick={() => setUpdateDocumentsVisible(true)}
            />
          )}
        </div>
      </div>
      {error && (
        <Message type='error' className='mx-5 p-4 text-2xl' key={messageKey}>
          {error}
        </Message>
      )}
      {revertOrderTraderVisible && (
        <RevertOrderTraderModal
          key={messageKey}
          onClose={() => setRevertOrderTraderVisible(false)}
          accountType='trader'
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
      {addSupplierVisible && (
        <AddSupplierModal
          setAddSupplierVisible={setAddSupplierVisible}
          supplierSelectOptions={supplierSelectOptions}
          setSupplierDetails={setNewOrderDetails}
          Option={Option}
          SingleValue={SingleValue}
          error={inputError}
          messageKey={messageKey}
          onSubmitAddSupplier={onSubmitAddSupplier}
        />
      )}
      {revertOrderSupplierVisible && (
        <RevertOrderSupplierModal
          setRevertOrderSupplierVisible={setRevertOrderSupplierVisible}
          accountType='trader'
          onChangeAmountToSupplier={(e) =>
            setOrderDetails((orderDetails) => ({
              ...orderDetails,
              amountToSupplier: Number(e.target.value),
            }))
          }
          onChangePercentForSupplier={(e) =>
            setOrderDetails((orderDetails) => ({
              ...orderDetails,
              percentAdvanceForSupplier: Number(e.target.value),
            }))
          }
          error={inputError}
          messageKey={messageKey}
          onSubmitRevertSupplier={onSubmitRevertSupplier}
        />
      )}
      {updateDocumentsVisible && (
        <UpdateDocumentsModal
          setUploadBlVisible={setUpdateDocumentsVisible}
          setDocuments={setDocuments}
          documents={documents}
          faDownload={faDownload}
          faTimes={faTimes}
          error={inputError}
          messageKey={messageKey}
          onSubmitUpdatedFiles={onSubmitUpdatedFiles}
        />
      )}
      {viewedPDF && <PDF PDF={viewedPDF} onClose={() => setViewedPDF(false)} />}
    </div>
  );
};

export default TraderOrderPage;
