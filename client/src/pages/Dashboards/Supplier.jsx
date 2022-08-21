import React from 'react';
import Orders from '../../components/common/Orders';
import Topbar from '../../components/common/Topbar';
import { useEth } from '../../contexts/EthContext';

const Supplier = () => {
  const { state, dispatch } = useEth();

  return (
    state.accounts && (
      <div>
        <Topbar />
        <Orders
          address={state?.accounts[0]}
          accountType='supplier'
          extraDetails={['trader name']}
        />
        <Orders
          address={state?.accounts[0]}
          accountType='supplier'
          extraDetails={['trader name']}
          ordersType='new'
        />
      </div>
    )
  );
};

export default Supplier;
