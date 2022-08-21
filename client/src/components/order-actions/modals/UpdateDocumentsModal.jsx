import React from 'react';
import Modal from '../../common/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Message from '../../common/Message';
import Button from '../../common/Button';

export function UpdateDocumentsModal({
  setUploadBlVisible,
  setDocuments,
  documents,
  faDownload,
  faTimes,
  error,
  messageKey,
  onSubmitUpdatedFiles,
}) {
  return (
    <Modal closable={true} onClose={() => setUploadBlVisible(false)}>
      <div className='flex flex-col justify-center'>
        <h1 className='text-3xl mx-auto'>Update PL, BL and Invoice</h1>
        <p className='mx-auto text-xs'>Please add them in that order</p>
      </div>
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
                !documents.some(
                  (doc, index) => doc.name === e.target.files[0].name
                )
              ) {
                console.log('array doesnt include new doc');
                setDocuments((documents) => [...documents, e.target.files[0]]);
              }
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
        {Array.from(documents)?.map((doc, index) => {
          return (
            <div key={index} className='flex items-center'>
              <p className='text-xl'>{doc.name}</p>
              <FontAwesomeIcon
                icon={faTimes}
                size={'1x'}
                className='ml-4 hover:cursor-pointer'
                onClick={() => {
                  console.log(
                    Array.from(documents).filter((doc, i) => i !== index)
                  );
                  setDocuments((documents) =>
                    Array.from(documents).filter((doc, i) => i !== index)
                  );
                }}
              />
            </div>
          );
        })}
      </div>
      {error && (
        <Message type='error' key={messageKey}>
          {error}
        </Message>
      )}
      <div className='flex items-center'>
        <Button
          type='primary'
          className='mx-auto mt-3'
          onClick={onSubmitUpdatedFiles}
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
}
