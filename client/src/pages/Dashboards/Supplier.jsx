import React from 'react';
import Orders from '../../components/common/Orders';
import Topbar from '../../components/common/Topbar';
import { useEth } from '../../contexts/EthContext';
import {useEffect} from "react";

const Supplier = () => {
  const { state, dispatch } = useEth();
    useEffect(() => {
        document.title = 'Dashboard | Supply Chain Assistant';
    }, []);
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
