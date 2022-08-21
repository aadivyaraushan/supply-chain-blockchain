import React from 'react';

const SIZES = {
  small: 'w-24 text-lg',
  medium: 'w-32 text-2xl',
};

const STYLES = {
  primary:
    'bg-blue-500 text-white rounded-md text-center font-medium py-1 px-2',
  positive:
    'bg-green-500 text-white rounded-md text-center font-medium py-1 px-2',
  negative:
    'bg-red-500 text-white rounded-md text-center font-medium py-1 px-2',
};

const Button = ({ children, type, onClick, className, size = 'small' }) => {
  return (
    <div className={`${STYLES[type]} ${className} ${SIZES[size]}`}>
      <button onClick={onClick}>{children}</button>
    </div>
  );
};

export default Button;
