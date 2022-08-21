import React from 'react';

const InputElement = ({
  type,
  placeholder,
  required = true,
  onChange,
  className,
}) => {
  return type === 'textarea' ? (
    <textarea
      className={`border-2 w-full rounded-md p-2 mt-3 ${className}`}
      placeholder={placeholder}
      maxLength={100}
      onChange={onChange}
    ></textarea>
  ) : (
    <input
      className={`border-2 w-full rounded-md p-2 mt-3 ${className}`}
      type={type}
      placeholder={placeholder}
      required={required}
      onChange={onChange}
    ></input>
  );
};

export default InputElement;
