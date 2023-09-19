import React, { ComponentProps, ReactNode } from 'react';

type ButtonProps = ComponentProps<'button'> & {
  label?: string;
  labelClassName?: string;
  variant?: 'text' | 'contained';
  children?: ReactNode;
};

function Button({
  onClick,
  className,
  variant = 'contained',
  type = 'button',
  label,
  labelClassName,
  style,
  children,
  disabled = false,
  ...props
}: ButtonProps) {
  let buttonClassName = '';
  if (variant === 'text') {
    buttonClassName +=
      'font-semibold text-gray-400 hover:underline hover:underline-offset-4 hover:text-violet-500';
  } else {
    buttonClassName +=
      'text-white bg-violet-500 hover:bg-violet-600 focus:ring-2 focus:outline-none focus:ring-violet-600 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0';
  }
  if (disabled) {
    buttonClassName =
      'text-white bg-gray-400 hover:bg-gray-500 cursor-not-allowed font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0';
  }
  if (className) {
    buttonClassName += ` ${className}`;
  }

  return (
    <button
      className={buttonClassName}
      style={style}
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {label ? <span className={labelClassName}>{label}</span> : null}
      {children}
    </button>
  );
}

export default Button;
