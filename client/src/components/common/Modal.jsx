import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

const Modal = ({ children, className, closable = false, onClose }) => {
  return (
    <div
      className={`bg-white z-20 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 container m-auto w-80 flex-row align-middle py-5 px-5 rounded-2xl shadow-xl  ${className}`}
    >
      {closable && (
        <div className='flex flex-row justify-end'>
          <button onClick={onClose}>
            {' '}
            <FontAwesomeIcon icon={faX} />{' '}
          </button>
        </div>
      )}
      {children}
    </div>
  );
};

export default Modal;
