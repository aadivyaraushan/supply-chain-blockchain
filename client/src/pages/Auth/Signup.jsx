import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Modal from '../../components/common/Modal.jsx';
import InputElement from '../../components/common/InputElement.jsx';
import SelectElement from '../../components/common/SelectElement.jsx';
import Button from '../../components/common/Button';
import { useEth } from '../../contexts/EthContext';
import '../../main.css';
import Message from '../../components/common/Message.jsx';
import { DataStore } from '@aws-amplify/datastore';
import { Users, AccountType } from '../../models';
import { validateEmail } from '../../utils/validateEmail.js';

function SingleValue({ children, innerProps, getValue, isDisabled }) {
  return !isDisabled ? <p className='text-black'>{children}</p> : null;
}

function Option({ children, innerProps, getValue, isDisabled }) {
  return !isDisabled ? (
    <div {...innerProps} className='my-2 ml-2'>
      <p className='text-normal'>{children}</p>
    </div>
  ) : null;
}

const Signup = () => {
  const { state, dispatch } = useEth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState('');
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [messageKey, setMessageKey] = useState(0);

  const handleSubmit = async () => {
    console.log(email, type.value);
    const users = await DataStore.query(Users);
    const userEmails = users.map((user) => user.email);
    console.log(userEmails);
    setMessageKey(messageKey + 1);
    try {
      if (userEmails.includes(email)) {
        setError(
          'An account is already registered with that email. Please use another one.'
        );
      } else if (!validateEmail(email)) {
        setError('Please enter a valid email.');
      } else if (type === '') {
        setError('Please select an account type');
      } else if (name === '') {
        setError('Please enter a company name');
      } else if (desc === '') {
        setError('Please enter a description.');
      } else {
        setError(null);
        console.log(state);
        console.log(type);
        let accType;
        if (type.value === 'Buyer') {
          await state?.contract?.methods
            .signUpBuyer()
            .send({ from: state.accounts[0] });
          accType = 'BUYER';
        } else if (type.value === 'Supplier') {
          await state?.contract?.methods
            .signUpSupplier()
            .send({ from: state.accounts[0] });
          accType = 'SUPPLIER';
        } else if (type.value === 'Shipping line') {
          await state?.contract?.methods
            .signUpShippingLine()
            .send({ from: state.accounts[0] });
          accType = 'SHIPPING_LINE';
        } else if (type.value === 'Trader') {
          await state?.contract?.methods
            .signUpTrader()
            .send({ from: state.accounts[0] });
          accType = 'TRADER';
        }
        await DataStore.save(
          new Users({
            id: crypto.randomUUID(),
            address: state.accounts[0],
            email: email,
            name: name,
            desc: desc,
            type: accType,
          })
        );
        setLoggedIn(true);
      }
    } catch (err) {
      console.error('Error submitting: ', err.message);
    }
  };

  useEffect(() => {
    const verifyAccountDoesntExist = async () => {
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

      if (isBuyer || isTrader || isShippingLine || isSupplier) {
        setError(
          'You already have an account. You will not be allowed to make a new one.'
        );
      }
    };

    verifyAccountDoesntExist();
  }, []);

  return (
    <div className='flex h-screen'>
      <Modal>
        <div>
          <h1 className='text-4xl text-center'>Sign Up</h1>
          <InputElement
            type='email'
            placeholder='Email'
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputElement
            type='text'
            placeholder='Company Name'
            onChange={(e) => setName(e.target.value)}
          />
          <InputElement
            type='textarea'
            placeholder='Description'
            onChange={(e) => setDesc(e.target.value)}
          />
          <SelectElement
            prompt='Account type'
            options={[
              { value: 'Buyer', label: 'Buyer' },
              { value: 'Supplier', label: 'Supplier' },
              { value: 'Trader', label: 'Trader' },
              { value: 'Shipping line', label: 'Shipping line' },
            ]}
            onChange={(change) => setType(change)}
            SingleValue={SingleValue}
            Option={Option}
          />
          {error && (
            <Message type='error' key={messageKey}>
              {error}
            </Message>
          )}
          <div className='flex justify-center mt-4'>
            <Button type='primary' onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </Modal>
      {loggedIn && (
        <Navigate
          to={`/${
            type.value === 'Buyer'
              ? 'buyer'
              : type.value === 'Supplier'
              ? 'supplier'
              : type.value === 'Trader'
              ? 'trader'
              : type.value === 'Shipping line'
              ? 'shippingLine'
              : 'error'
          }/${state.accounts[0]}`}
        />
      )}
    </div>
  );
};
export default Signup;
