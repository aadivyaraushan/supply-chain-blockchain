import React from 'react';
import Modal from '../../common/Modal';
import InputElement from '../../common/InputElement';
import Message from '../../common/Message';
import Button from '../../common/Button';

export function RevertOrderShippingLine({
  setRevertOrderShippingLineVisible,
  accountType,
  setShippingLineDetails,
  error,
  messageKey,
  onSubmitRevertShippingLine,
}) {
  return (
    <Modal
      closable={true}
      onClose={() => setRevertOrderShippingLineVisible(false)}
    >
      <div className='flex items-center'>
        <h1 className='text-3xl mx-auto'>New Details</h1>
      </div>
      <InputElement
        placeholder={`New ${
          accountType === 'shippingLine'
            ? 'Amount per unit from supplier'
            : 'Amount per unit to shipping line'
        }`}
        type='text'
        required={true}
        onChange={(e) =>
          setShippingLineDetails((shippingLineDetails) => ({
            ...shippingLineDetails,
            amountToShippingLine: Number(e.target.value),
          }))
        }
      />
      {error && (
        <Message type='error' key={messageKey}>
          {error}
        </Message>
      )}
      <div className='flex items-center mt-3'>
        <Button
          className='mx-auto'
          type='primary'
          onClick={onSubmitRevertShippingLine}
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
}
