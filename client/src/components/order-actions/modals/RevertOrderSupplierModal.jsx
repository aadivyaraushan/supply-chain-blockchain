import React from 'react';
import Modal from '../../common/Modal';
import InputElement from '../../common/InputElement';
import Button from '../../common/Button';
import Message from '../../common/Message';
import SelectElement from '../../common/SelectElement';

function RevertOrderSupplierModal({
  setRevertOrderSupplierVisible,
  accountType,
  onChangeAmountToSupplier,
  onChangePercentForSupplier,
  error,
  messageKey,
  onSubmitRevertSupplier,
}) {
  return (
    <Modal onClose={() => setRevertOrderSupplierVisible(false)} closable={true}>
      <div className='flex items-center'>
        <h1 className='mx-auto text-3xl'>New Details</h1>
      </div>
      <InputElement
        type='text'
        placeholder={
          accountType === 'trader'
            ? 'Amount per unit to supplier'
            : 'Amount per unit from trader'
        }
        required={true}
        onChange={onChangeAmountToSupplier}
      />
      <InputElement
        type='text'
        placeholder={
          accountType === 'trader'
            ? 'Percent of advance payment to supplier'
            : 'Percent of advance payment from trader'
        }
        required={true}
        onChange={onChangePercentForSupplier}
      />
      {error && (
        <Message type='error' key={messageKey}>
          {error}
        </Message>
      )}
      <div className='flex items-center'>
        <Button
          type='primary'
          className='mx-auto mt-3'
          onClick={onSubmitRevertSupplier}
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
}

export default RevertOrderSupplierModal;
