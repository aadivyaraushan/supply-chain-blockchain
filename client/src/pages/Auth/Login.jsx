import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useEth } from '../../contexts/EthContext';

const Login = () => {
  const [isBuyer, setIsBuyer] = useState(false);
  const [isSupplier, setIsSupplier] = useState(false);
  const [isTrader, setIsTrader] = useState(false);
  const [isShippingLine, setIsShippingLine] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');

  const { state, dispatch } = useEth();

  useEffect(() => {
    const getAccount = async () => {
      try {
        const isBuyer = await state.contract?.methods
          .buyers(state.accounts[0])
          .call({ from: state.accounts[0] });

        const isTrader = await state.contract?.methods
          .traders(state.accounts[0])
          .call({ from: state.accounts[0] });

        const isShippingLine = await state.contract?.methods
          .shippingLines(state.accounts[0])
          .call({ from: state.accounts[0] });
        const isSupplier = await state.contract?.methods
          .suppliers(state.accounts[0])
          .call({ from: state.accounts[0] });
        console.log(isBuyer, isTrader, isShippingLine, isSupplier);
        setIsBuyer(isBuyer);
        setIsShippingLine(isShippingLine);
        setIsTrader(isTrader);
        setIsSupplier(isSupplier);
      } catch (err) {
        console.log(err.message);
      }
    };

    getAccount();
  }, [state]);

  return (
    <div className='flex h-screen flex-col justify-center items-center'>
      <div className='bg-blue-500 text-white rounded-md text-center font-medium py-1 px-2 mx-auto flex'>
        <div className='custom-loader'></div>
        Logging in...
      </div>
      <div className='mt-2 bg-white-500 rounded-md text-center font-medium py-1 px-2 mx-auto flex'>
        If this is taking too long, that probably means you don't have an
        account.
      </div>
      {isBuyer && <Navigate to={`/buyer/${state.accounts[0]}`}></Navigate>}
      {isTrader && <Navigate to={`/trader/${state.accounts[0]}`}></Navigate>}
      {isSupplier && (
        <Navigate to={`/supplier/${state.accounts[0]}`}></Navigate>
      )}
      {isShippingLine && (
        <Navigate to={`/shippingLine/${state.accounts[0]}`}></Navigate>
      )}
    </div>
  );
};

export default Login;
