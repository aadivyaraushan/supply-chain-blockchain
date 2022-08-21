import React from 'react';
import Modal from '../../common/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Message from '../../common/Message';
import Button from '../../common/Button';
import InputElement from '../../common/InputElement';

function CompleteProductionModal({
  setCompleteProductionVisible,
  setSupplierDocuments,
  supplierDocuments,
  faDownload,
  faTimes,
  error,
  messageKey,
  onSubmitSupplierFiles,
  setFinalQuantity,
}) {
  return (
    <>
      <Modal
        closable={true}
        onClose={() => setCompleteProductionVisible(false)}
        className='w-96'
      >
        <div className='flex flex-col justify-center'>
          <h1 className='mx-auto text-3xl'>Complete Production</h1>
        </div>
        <div className='border-2 w-full rounded-md p-2 mt-3'>
          <h2 className=' text-gray-400'>Add PL and invoice:</h2>
          <p className='text-xs text-gray-400'>
            (Please add them in that order)
          </p>
          <label htmlFor='inputTag' className='hover:cursor-pointer'>
            <div className='flex items-center'>
              <input
                type='file'
                id='inputTag'
                className='hidden'
                multiple
                accept='application/pdf'
                onChange={(e) => {
                  console.log('file added: ', e.target.files[0]);

                  if (
                    !supplierDocuments.some(
                      (doc, index) => doc?.name === e.target.files[0].name
                    )
                  ) {
                    console.log('array doesnt include new doc');
                    setSupplierDocuments((supplierDocuments) => [
                      ...supplierDocuments,
                      e.target.files[0],
                    ]);
                  } else console.log('array includes new doc');
                }}
              />
              <FontAwesomeIcon
                icon={faDownload}
                size={'6x'}
                className={'mt-4 mx-auto'}
              />
            </div>
          </label>
          <div className='mt-2'>
            {Array.from(supplierDocuments)?.map((doc, index) => {
              return (
                <div key={index} className='flex items-center'>
                  <p className='text-xl'>{doc.name}</p>
                  <FontAwesomeIcon
                    icon={faTimes}
                    size={'1x'}
                    className='ml-4 hover:cursor-pointer'
                    onClick={() => {
                      console.log(
                        Array.from(supplierDocuments).filter(
                          (doc, i) => i !== index
                        )
                      );
                      setSupplierDocuments((supplierDocuments) =>
                        Array.from(supplierDocuments).filter(
                          (doc, i) => i !== index
                        )
                      );
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <InputElement
          placeholder='Final quantity of goods produced'
          onChange={(e) => setFinalQuantity(e.target.value)}
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
            onClick={onSubmitSupplierFiles}
          >
            Submit
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default CompleteProductionModal;
