import React from 'react';
import Topbar from '../../components/common/Topbar';
import Orders from '../../components/common/Orders';
import { useEth } from '../../contexts/EthContext';

const Trader = () => {
  const { state, dispatch } = useEth();
  console.log('account: ', state.accounts);
  return (
    <div>
      <Topbar />
      <Orders
        address={state.accounts && state.accounts[0]}
        accountType='trader'
        extraDetails={['supplier name', 'buyer name']}
      />
      <Orders
        address={state.accounts && state.accounts[0]}
        accountType='trader'
        extraDetails={['buyer name']}
        ordersType='new'
      />
    </div>
  );
};

export default Trader;
