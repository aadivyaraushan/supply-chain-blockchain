import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useEth } from '../../contexts/EthContext';
import { DataStore } from '@aws-amplify/datastore';
import { Users } from '../../models';

const Order = ({
  index,
  hash,
  trader,
  buyer,
  supplier,
  shippingLine,
  extraDetails,
}) => {
  console.log(extraDetails);
  console.log(trader, buyer, supplier, shippingLine);
  return (
    <>
      <Link key={index} to={`${hash}`}>
        <div
          key={index}
          className='flex flex-row items-center justify-between bg-white shadow-lg hover:shadow-xl h-10 mr-3 ml-10 rounded-2xl mt-3'
        >
          <p className='ml-2'>{`${hash.substring(0, 10)}...`}</p>
          {/* <p className='mr-2'>{trader}</p> */}
          <div className='flex flex-row'>
            {extraDetails.map((value, index) =>
              value === 'trader name' ? (
                <p className='mr-2'>{trader}</p>
              ) : value === 'buyer name' ? (
                <p className='mr-2'>{buyer}</p>
              ) : value === 'supplier name' ? (
                <p className='mr-2'>{supplier}</p>
              ) : value === 'shipping line name' ? (
                <p className='mr-2'>{shippingLine}</p>
              ) : null
            )}
          </div>
        </div>
      </Link>
    </>
  );
};

const Orders = ({ address, accountType, ordersType, extraDetails }) => {
  // extraDetails values: [trader name, supplier name, buyer name]
  const { state, dispatch } = useEth();
  const [hashes, setHashes] = useState();
  const [traders, setTraders] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [shippingLines, setShippingLines] = useState([]);
  const [states, setStates] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      let hashes;
      if (accountType === 'buyer') {
        hashes = await state?.contract?.methods
          .getHashesForBuyer()
          .call({ from: address });
      } else if (accountType === 'supplier') {
        hashes = await state?.contract?.methods
          .getHashesForSupplier()
          .call({ from: address });
      } else if (accountType === 'trader') {
        hashes = await state?.contract?.methods
          .getHashesForTrader()
          .call({ from: address });
      } else if (accountType === 'shippingLine') {
        hashes = await state?.contract?.methods
          .getHashesForShippingLine()
          .call({ from: address });
      }
      console.log('order hashes: ', hashes);
      setHashes(hashes);
    };

    getOrders();
  }, [state.contract, state.accounts]);

  useEffect(() => {
    if (hashes) {
      const getState = async () => {
        const states = await Promise.all(
          hashes.map(async (hash, index) => {
            const txState = await state.contract.methods
              .getState(hash)
              .call({ from: state.accounts[0] });
            return txState;
          })
        );
        console.log('states: ', states);
        setStates(states);
      };

      getState();

      if (extraDetails.includes('trader name')) {
        const getTraders = async () => {
          const traders = await Promise.all(
            hashes.map(async (hash, index) => {
              const trader = await state.contract.methods
                .getTrader(hash)
                .call({ from: state.accounts[0] });
              console.log(trader);
              const traderDetails = await DataStore.query(Users, (c) =>
                c.address('eq', trader)
              );
              if (traderDetails[0]) return traderDetails[0].name;
            })
          );
          console.log('getting traders: ', traders);
          setTraders(traders);
        };
        getTraders();
      }

      if (extraDetails.includes('buyer name')) {
        const getBuyers = async () => {
          const buyers = await Promise.all(
            hashes.map(async (hash, index) => {
              const buyer = await state.contract.methods
                .getBuyer(hash)
                .call({ from: state.accounts[0] });
              console.log(buyer);
              const buyerDetails = await DataStore.query(Users, (c) =>
                c.address('eq', buyer)
              );
              if (buyerDetails[0]) {
                return buyerDetails[0].name;
              }
            })
          );
          console.log('getting buyers: ', buyers);
          setBuyers(buyers);
        };
        getBuyers();
      }

      if (extraDetails.includes('supplier name')) {
        const getSuppliers = async () => {
          const suppliers = await Promise.all(
            hashes.map(async (hash, index) => {
              const supplier = await state.contract.methods
                .getSupplier(hash)
                .call({ from: state.accounts[0] });
              const supplierDetails = await DataStore.query(Users, (c) =>
                c.address('eq', supplier)
              );
              if (supplierDetails[0]) {
                return supplierDetails[0].name;
              }
            })
          );
          console.log('getting suppliers: ', suppliers);
          setSuppliers(suppliers);
        };
        getSuppliers();
      }

      if (extraDetails.includes('shipping line name')) {
        const getShippingLines = async () => {
          const shippingLines = await Promise.all(
            hashes.map(async (hash, index) => {
              const shippingLine = await state.contracts.method
                .getShippingLine(hash)
                .call({ from: state.accounts[0] });
              const shippingLineDetails = await DataStore.query(Users, (c) =>
                c.address('eq', shippingLine)
              );
              return shippingLineDetails[0].name;
            })
          );
          setShippingLines(shippingLines);
        };
        getShippingLines();
      }
    }
  }, [hashes]);

  return (
    <div className=''>
      <h1 className='text-5xl ml-9 mt-3 font-bold'>
        {ordersType === 'new' ? 'New Orders' : 'Your Orders'}
      </h1>
      {((traders !== [] && extraDetails.includes('trader name')) ||
        (suppliers !== [] && extraDetails.includes('supplier name')) ||
        (buyers !== [] && extraDetails.includes('buyer name')) ||
        (shippingLines !== [] &&
          extraDetails.includes('shipping line name'))) &&
        states !== [] &&
        hashes?.map((hash, index) => {
          console.log(states[index]);
          if (
            states[index] !== '0' &&
            Number(states[index]) >= 1 &&
            Number(states[index]) < 28
          ) {
            if (
              (((accountType === 'trader' && states[index] === '1') ||
                (accountType === 'supplier' && states[index] === '6') ||
                (accountType === 'shippingLine' && states[index] === '16')) &&
                ordersType === 'new') ||
              (ordersType !== 'new' &&
                ((accountType === 'trader' && states[index] !== '1') ||
                  (accountType === 'supplier' && states[index] !== '6') ||
                  (accountType === 'shippingLine' &&
                    states[index] !== '16'))) ||
              accountType === 'buyer'
            ) {
              return (
                <Order
                  hash={hash}
                  index={index}
                  trader={traders[index]}
                  buyer={buyers[index]}
                  extraDetails={extraDetails}
                  key={index}
                />
              );
            }
          }
        })}
    </div>
  );
};

export default Orders;
