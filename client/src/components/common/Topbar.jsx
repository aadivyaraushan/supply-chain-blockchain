import React, { useEffect } from 'react';
import Button from './Button.jsx';
import { useState } from 'react';
import useEth from '../../contexts/EthContext/useEth.js';
import Web3 from 'web3';
import { Link } from 'react-router-dom';
import { getCurrencyConversion } from '../../utils/getCurrencyConversion.js';

const Topbar = () => {
  const { state } = useEth();
  const [currencyConversion, setCurrencyConversion] = useState();

  useEffect(() => {
    const web3 = new Web3('https://rpc.ankr.com/eth');
    getCurrencyConversion().then((val) => {
      setCurrencyConversion(val);
    });
  }, [state]);

  return (
    <div className='flex flex-row h-16 justify-between'>
      <div className='bg-neutral-50 flex items-center shadow-lg w-42 h-10 rounded-xl mt-4 ml-4 py-4 px-8'>
        <p>1MATIC = ${currencyConversion}</p>
      </div>
      <Button className='bg-neutral-50 flex justify-self-end items-center justify-center shadow-lg w-28 h-10 rounded-xl mt-4 ml-4 mr-4 '>
        <Link to='/'>
          <p className='text-xl'>Log Out</p>
        </Link>
      </Button>
    </div>
  );
};

export default Topbar;
