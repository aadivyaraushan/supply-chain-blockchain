import React from 'react';
import Modal from '../../common/Modal';
import SelectElement from '../../common/SelectElement';
import InputElement from '../../common/InputElement';
import Message from '../../common/Message';
import Button from '../../common/Button';

export function AddShippingLineModal({
  setAddShippingLineVisible,
  shippingLineSelectOptions,
  Option,
  SingleValue,
  setShippingLineDetails,
  error,
  messageKey,
  onSubmitAddShippingLine,
}) {
  return (
    <>
      <Modal closable={true} onClose={() => setAddShippingLineVisible(false)}>
        <div className='flex items-center'>
          <h1 className='text-3xl mx-auto'>Add Shipping Line</h1>
        </div>
        <SelectElement
          options={shippingLineSelectOptions}
          prompt='Select a shipping line'
          Option={Option}
          SingleValue={SingleValue}
          onChange={(selected) => {
            setShippingLineDetails((shippingLineDetails) => ({
              ...shippingLineDetails,
              shippingLine: selected,
            }));
          }}
        />
        {error && (
          <Message type='error' key={messageKey}>
            {error}
          </Message>
        )}
        <div className='flex items-center mt-2'>
          <Button
            type='primary'
            onClick={onSubmitAddShippingLine}
            className='mx-auto'
          >
            Submit
          </Button>
        </div>
      </Modal>
    </>
  );
}
