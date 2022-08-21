import React from 'react';
import Modal from '../../common/Modal';
import SelectElement from '../../common/SelectElement';
import InputElement from '../../common/InputElement';
import Message from '../../common/Message';
import Button from '../../common/Button';

function AddSupplierModal({
  setAddSupplierVisible,
  supplierSelectOptions,
  setSupplierDetails,
  Option,
  SingleValue,
  error,
  messageKey,
  onSubmitAddSupplier,
}) {
  return (
    <Modal onClose={() => setAddSupplierVisible(false)} closable={true}>
      <div className='flex items-center'>
        <h1 className='mx-auto text-3xl'>Add Supplier</h1>
      </div>
      <SelectElement
        prompt='Select a supplier'
        options={supplierSelectOptions}
        onChange={(selected) =>
          setSupplierDetails((supplierDetails) => ({
            ...supplierDetails,
            supplier: selected,
          }))
        }
        Option={Option}
        SingleValue={SingleValue}
      />
      <InputElement
        placeholder='Amount per unit to supplier'
        onChange={(e) =>
          setSupplierDetails((supplierDetails) => ({
            ...supplierDetails,
            amountToSupplier: Number(e.target.value),
          }))
        }
        required={true}
      />
      <InputElement
        placeholder='Percent of advance payment to supplier'
        onChange={(e) =>
          setSupplierDetails((supplierDetails) => ({
            ...supplierDetails,
            percentAdvanceForSupplier: Number(e.target.value),
          }))
        }
        required={true}
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
          onClick={onSubmitAddSupplier}
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
}

export default AddSupplierModal;
