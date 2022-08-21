import React, { useEffect, useState } from 'react';
import Button from '../../components/common/Button';
import InputElement from '../../components/common/InputElement';
import SelectElement from '../../components/common/SelectElement';
import Modal from '../../components/common/Modal';
import Orders from '../../components/common/Orders';
import Topbar from '../../components/common/Topbar';
import { useEth } from '../../contexts/EthContext';
import { DataStore } from '@aws-amplify/datastore';
import { Users, AccountType } from '../../models';
import Message from '../../components/common/Message';
import { validateEmail } from '../../utils/validateEmail';
import { getCurrencyConversion } from '../../utils/getCurrencyConversion';
import Option from '../../components/order-actions/other/Option';
import SingleValue from '../../components/order-actions/other/SingleValue';
import { checkAmount } from '../../utils/checkAmount';
import { checkPercent } from '../../utils/checkPercent';
import { UNIT_OPTIONS } from '../../utils/units';

const BuyerDashboard = () => {
  const { state, dispatch } = useEth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [messageKey, setMessageKey] = useState(0);
  const [selectOptions, setSelectOptions] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [isAddingOrder, setIsAddingOrder] = useState(false);

  const handleSubmit = async () => {
    // console.log(orderDetails);
    // console.log(Object.entries(orderDetails));
    console.log(orderDetails);
    if (!orderDetails || !orderDetails[0]) {
      setMessageKey((messageKey) => messageKey + 1);
      setError('Please select a trader.');
    } else if (!orderDetails[1]) {
      setMessageKey((messageKey) => messageKey + 1);
      setError('Please enter an amount.');
    } else if (checkAmount(orderDetails[1][1])) {
      setMessageKey((messageKey) => messageKey + 1);
      setError(checkAmount(orderDetails[1][1]));
    } else if (!orderDetails[2]) {
      setMessageKey((messageKey) => messageKey + 1);
      setError('Please enter an advance percent.');
    } else if (checkPercent(orderDetails[2][1])) {
      setMessageKey((messageKey) => messageKey + 1);
      setError(checkPercent(orderDetails[2][1]));
    } else if (!orderDetails[3]) {
      setMessageKey((messageKey) => messageKey + 1);
      setError('Please enter a commodity.');
    } else if (!orderDetails[4]) {
      setMessageKey((messageKey) => messageKey + 1);
      setError('Please enter a quantity.');
    } else if (!orderDetails[5]) {
      setMessageKey((messageKey) => messageKey + 1);
      setError('Please select a unit');
    } else if (checkPercent(orderDetails[4][1], true)) {
      setMessageKey((messageKey) => messageKey + 1);
      setError(checkPercent(orderDetails[4][1], true));
    } else {
      if (orderDetails[3][1] === '') {
        setMessageKey(messageKey + 1);
        setError('Please enter a non-empty commodity');
      } else {
        const hash = state.web3.utils.soliditySha3({
          type: 'string',
          value: crypto.randomUUID(),
        });
        const traderDetails = await DataStore.query(Users, (c) =>
          c.email('eq', orderDetails[0][1].label.email)
        );
        const currencyConversion = await getCurrencyConversion();
        // console.log(currencyConversion);
        const amountToTrader = String(
          Math.round(
            (orderDetails[1][1] / Number(currencyConversion)) * 1000000000
          )
        );
        const quantity = String(Number(orderDetails[4][1]) * 100);
        console.log(
          hash,
          amountToTrader,
          traderDetails[0].address,
          orderDetails[2][1],
          orderDetails[3][1],
          quantity
        );
        await state.contract.methods
          .createOrder(
            hash,
            amountToTrader,
            traderDetails[0].address,
            orderDetails[2][1],
            orderDetails[3][1],
            quantity,
            orderDetails[5][1]
          )
          .send({ from: state.accounts[0] });
        window.location.reload();
      }
    }
  };

  useEffect(() => {
    const getTraders = async () => {
      try {
        const { ...traders } = await DataStore.query(Users, (t) =>
          t.type('eq', 'TRADER')
        );
        Object.entries(traders).map((entry, index) => {
          const [key, trader] = entry;
          if (
            !selectOptions.includes({
              value: trader,
              label: trader,
            })
          ) {
            setSelectOptions([
              ...selectOptions,
              { value: trader, label: trader },
            ]);
          }
        });
      } catch (err) {
        console.error('Error getting traders: ', err.message);
      }
    };
    getTraders();
  }, [state.contract, state.accounts]);

  return (
    state.accounts && (
      <div>
        {isAddingOrder && (
          <div className='fixed bg-gray-900 bg-opacity-60 z-10 h-screen w-screen' />
        )}
        <div className='z-0'>
          <Topbar />
          <Orders
            address={state.accounts[0]}
            accountType='buyer'
            extraDetails={['trader name']}
          />
          <Button
            type='primary'
            className=' absolute right-6 bottom-3 w-32 rounded-2xl'
            onClick={() => setIsAddingOrder(!isAddingOrder)}
          >
            Add Order
          </Button>
        </div>

        {isAddingOrder && (
          <Modal
            className='z-20 w-96'
            closable={true}
            onClose={() => {
              setIsAddingOrder(false);
            }}
          >
            <div className='flex items-center'>
              <h1 className='text-2xl mx-auto'>Add Order</h1>
            </div>
            <SelectElement
              prompt='Trader emails'
              options={selectOptions}
              onChange={(selected) => {
                // console.log(selected);
                // setOrderDetails((orderDetails) => [
                //   ['trader', selected],
                //   ...orderDetails,
                // ]);
                orderDetails[0] = ['trader', selected];
                setOrderDetails(orderDetails);
              }}
              Option={Option}
              SingleValue={SingleValue}
            />
            <InputElement
              value='amountToTrader'
              placeholder='Amount per unit to the trader(in USD)'
              onChange={(e) => {
                console.log('amount to trader', e.target.value);
                // setOrderDetails((orderDetails) => ({
                //   ...orderDetails,
                //   amountToTrader: Number(e.target.value),
                // }));
                orderDetails[1] = ['amountToTrader', Number(e.target.value)];
                setOrderDetails(orderDetails);
              }}
            />
            <InputElement
              value='percentAdvanceForTrader'
              placeholder='% of payment to the trader in advance(0 by default)'
              onChange={(e) => {
                console.log(e.target.value);
                // setOrderDetails((orderDetails) => ({
                //   ...orderDetails,
                //   percentAdvanceForTrader: 0 ? 0 : Number(e.target.value),
                // }));
                orderDetails[2] = [
                  'percentAdvanceForTrader',
                  e.target.value === 0 ? 0 : Number(e.target.value),
                ];
                setOrderDetails(orderDetails);
              }}
            />
            <InputElement
              value='commodity'
              placeholder='Commodity you require'
              onChange={(e) => {
                // setOrderDetails((orderDetails) => ({
                //   ...orderDetails,
                //   commodity: e.target.value,
                // }))
                orderDetails[3] = ['commodity', e.target.value];
                setOrderDetails(orderDetails);
              }}
            />
            <div className='flex items-center'>
              <InputElement
                value='quantity'
                placeholder='Quantity of goods you require'
                className='w-60'
                onChange={(e) => {
                  orderDetails[4] = ['quantity', Number(e.target.value)];
                  setOrderDetails(orderDetails);
                }}
              />
              <div className='mt-3 ml-1 bg-red-200'>
                <SelectElement
                  prompt='unit'
                  options={UNIT_OPTIONS}
                  onChange={(selected) => {
                    orderDetails[5] = ['unit', selected.value];
                    setOrderDetails(orderDetails);
                  }}
                />
              </div>
            </div>
            {error && (
              <Message key={messageKey} type='error'>
                {error}
              </Message>
            )}
            <div className='items-center flex mt-4'>
              <Button
                size='medium'
                className='mx-auto'
                type='primary'
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </Modal>
        )}
      </div>
    )
  );
};

export default BuyerDashboard;
