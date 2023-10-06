import React, { ReactNode } from 'react';
import { RxCross2 } from 'react-icons/rx';

interface ModalType {
  children?: ReactNode;
  isOpen: boolean;
  toggle: () => void;
}

const Modal = (props: ModalType) => {
  return (
    <>
      {props.isOpen && (
        <div
          className="z-50 bg-black/40 w-screen h-screen top-0 left-0 flex justify-center items-center fixed"
          onClick={props.toggle}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative block bg-white p-4 sm:rounded-xl sm:w-[548px] h-full sm:h-4/6 w-full"
          >
            <RxCross2
              onClick={props.toggle}
              className="cursor-pointer absolute top-0 right-0 mr-4 mt-4 p-1.5 rounded-full bg-violet-50 hover:bg-violet-100"
              size={30}
              color={'#8b5cf6'}
            />
            {props.children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
