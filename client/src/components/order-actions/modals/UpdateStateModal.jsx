import React from 'react';
import Modal from '../../common/Modal';
import SelectElement from '../../common/SelectElement';
import Message from '../../common/Message';
import Button from '../../common/Button';

function UpdateStateModal({
  setUpdateStateBySupplierVisible,
  stateOptions,
  selected,
  setSuppliersState,
  SingleValue,
  error,
  messageKey,
  onSubmitState,
}) {
  return (
    <Modal
      closable={true}
      onClose={() => setUpdateStateBySupplierVisible(false)}
    >
      <div className='flex items-center'>
        <h1 className='mx-auto text-3xl'>New Status</h1>
      </div>
      <div className='mt-2'>
        <SelectElement
          prompt='Select a status'
          options={stateOptions}
          onChange={(selected) => setSuppliersState(selected.value)}
          SingleValue={SingleValue}
        />
      </div>
      {error && (
        <Message key={messageKey} type='error'>
          {error}
        </Message>
      )}
      <div className='flex items-center'>
        <Button type='primary' className='mx-auto mt-3' onClick={onSubmitState}>
          Submit
        </Button>
      </div>
    </Modal>
  );
}

export default UpdateStateModal;
