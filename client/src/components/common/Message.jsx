import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

const TYPES = {
  error: 'bg-red-100 text-red-900',
  warning: 'bg-yellow-100 text-yellow-900',
};

const Message = ({ children, type, disabled = false, className }) => {
  const [isDisabled, setIsDisabled] = useState(disabled);

  return (
    !isDisabled && (
      <div
        className={`${TYPES[type]} rounded-lg p-2 mt-2 flex flex-row justify-between ${className}`}
      >
        <div>{children}</div>
        <button
          onClick={() => {
            console.log('Button pressed');
            setIsDisabled(true);
          }}
        >
          <FontAwesomeIcon icon={faX} />
        </button>
      </div>
    )
  );
};

export default Message;
