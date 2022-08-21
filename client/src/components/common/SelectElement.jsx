import React, { useState } from 'react';
import Select from 'react-select';

function SelectContainer({ children, innerProps, getValue, isDisabled }) {
  return !isDisabled ? (
    <div className='border-2 w-full rounded-md p-2 flex flex-row text-gray-400 border-gray-200'>
      {children}
    </div>
  ) : null;
}

const SelectElement = ({
  prompt,
  options,
  onChange,
  Option = null,
  SingleValue = null,
}) => {
  const [selected, setSelected] = useState('Account type');
  return (
    <Select
      onChange={(selected) => {
        setSelected(selected);
        onChange(selected);
      }}
      options={options}
      components={
        Option &&
        SingleValue && { Option, SingleValue, Control: SelectContainer }
      }
      placeholder={prompt}
    />
  );
};

export default SelectElement;
