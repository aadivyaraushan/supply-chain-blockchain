import React from 'react';
import Modal from '../../common/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Message from '../../common/Message';
import Button from '../../common/Button';

export function UploadBLModal({
  setUploadBlVisible,
  setBl,
  faUpload,
  Bl,
  error,
  messageKey,
  onSubmitBL,
}) {
  return (
    <>
      <Modal closable={true} onClose={() => setUploadBlVisible(false)}>
        <div className='flex items-center'>
          <h1 className='text-3xl mx-auto'>Upload BL</h1>
        </div>
        <label htmlFor='inputTag' className='hover:cursor-pointer'>
          <div className='flex items-center'>
            <input
              type='file'
              id='inputTag'
              className='hidden'
              accept='application/pdf'
              onChange={(e) => {
                console.log('file added: ', e.target.files[0]);
                setBl(e.target.files[0]);
              }}
            />
            <FontAwesomeIcon
              icon={faUpload}
              size={'6x'}
              className={'mt-4 mx-auto'}
            />
          </div>
        </label>
        <div className='mt-2'>
          {Bl && (
            <div className='flex items-center'>
              <p className='text-xl'>{Bl.name}</p>
            </div>
          )}
        </div>
        {error && (
          <Message type='error' key={messageKey}>
            {error}
          </Message>
        )}
        <div className='flex items-center'>
          <Button type='primary' className='mx-auto mt-3' onClick={onSubmitBL}>
            Submit
          </Button>
        </div>
      </Modal>
    </>
  );
}
