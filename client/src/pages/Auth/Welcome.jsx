import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Message from '../../components/common/Message';
import Modal from '../../components/common/Modal';
import { useEth } from '../../contexts/EthContext';

const Welcome = ({ signOut, user, data }) => {
  const { state, dispatch } = useEth();
  const [message, setMessage] = useState(null);
  const [messageKey, setMessageKey] = useState(0);

  useEffect(() => {
    document.title = 'Welcome | Supply Chain Assistant';
  }, []);


  useEffect(() => {
    const checkIfMetaMask = async () => {
      if (state?.accounts?.length === 0) {
        setMessage(
          <Message type='error' messageKey={messageKey}>
            Please connect to MetaMask.
          </Message>
        );
        setMessageKey((messageKey) => messageKey + 1);
      }
    };

    checkIfMetaMask();
  }, []);

  useEffect(() => {
    const checkNet = async () => {
      const netId = await state.web3?.eth.net.getId();
      console.log(netId);
      if (netId && netId !== 80001) {
        setMessage(
          <Message type='error'>
            Please connect to the Polygon Mumbai testnet.
          </Message>
        );
        setMessageKey((messageKey) => messageKey + 1);
      }
    };
    checkNet();
  }, [state]);

  return (
    <div className='flex h-screen'>
      <Modal className='m-auto'>
        <h1 className='text-2xl text-center'>Welcome</h1>
        <Button type='primary' className='mt-2 mx-auto' size='medium'>
          <Link to='/signUp'>Sign Up</Link>
        </Button>
        <Button type='primary' className='mt-2 mx-auto' size='medium'>
          <Link to='/login'>Log In</Link>
        </Button>
        {message && message}
      </Modal>
    </div>
  );
};

export default Welcome;
