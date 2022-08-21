import React from 'react';
import Orders from '../../components/common/Orders';
import Topbar from '../../components/common/Topbar';
import { useEth } from '../../contexts/EthContext';

const ShippingLine = () => {
  const { state, dispatch } = useEth();

  return (
    state.accounts && (
      <div>
        <Topbar />
        <Orders
          address={state?.accounts[0]}
          accountType='shippingLine'
          extraDetails={['supplier name', 'buyer name']}
        />
        <Orders
          address={state?.accounts[0]}
          accountType='shippingLine'
          extraDetails={['supplier name']}
          ordersType='new'
        />
      </div>
    )
  );
};

export default ShippingLine;
