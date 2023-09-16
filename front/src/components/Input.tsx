import React, {
  ChangeEvent,
  FocusEvent,
  HTMLInputTypeAttribute,
  MutableRefObject,
  useState,
} from 'react';
import { BsEyeFill, BsEyeSlashFill, BsXCircleFill } from 'react-icons/bs';

export type InputProps = {
  value?: string | number;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  id?: string;
  inputRef?: MutableRefObject<HTMLInputElement>;
  labelBgColor?: string;
};

function Input({
  value,
  type,
  placeholder,
  onChange,
  onFocus,
  onBlur,
  id,
  inputRef,
  labelBgColor = 'bg-white',
}: InputProps) {
  const [inputType, setInputType] = useState(type);
  const [inputValue, setInputValue] = useState(value || '');

  const togglePasswordVisibility = () =>
    setInputType((prevType) => (prevType === 'password' ? 'text' : 'password'));

  const clearInput = () => {
    const event = {
      target: { value: '' },
    };
    setInputValue('');
    if (onChange) onChange(event as ChangeEvent<HTMLInputElement>);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (onChange) onChange(e);
  };

  return (
    <div className="relative">
      <input
        value={inputValue}
        type={inputType}
        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded appearance-none focus:outline-none ring-2 ring-gray-200 focus:ring-lime-400 focus:border-lime-400 peer"
        placeholder=" "
        onChange={handleInputChange}
        onFocus={onFocus}
        id={id}
        ref={inputRef}
        onBlur={onBlur}
      />
      {inputValue && (
        <button
          type="button"
          tabIndex={-1}
          onClick={clearInput}
          className={`absolute top-3.5 text-lg cursor-pointer ${
            type === 'password' ? 'right-8' : 'right-2'
          }`}
        >
          <BsXCircleFill className="text-gray-400" />
        </button>
      )}
      {type === 'password' && (
        <button
          type="button"
          tabIndex={-1}
          onClick={togglePasswordVisibility}
          className="absolute right-2 top-3.5 text-lg cursor-pointer"
        >
          {inputType === 'password' ? (
            <BsEyeSlashFill className="text-gray-400" />
          ) : (
            <BsEyeFill className="text-gray-400" />
          )}
        </button>
      )}
      <label
        htmlFor={id}
        className={`cursor-text absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] ${labelBgColor} px-2 peer-focus:px-2 peer-focus:text-lime-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
      >
        {placeholder}
      </label>
    </div>
  );
}

export default Input;
