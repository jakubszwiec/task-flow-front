import React from 'react'
import { LuCross } from 'react-icons/lu'

const Modal = ({children, isOpen, onClose, title}) => {
    if (!isOpen) return

  return (
    <div className='fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden bg-black/20 bg-opacity-50'>
      <div className='relative p-4 w-full max-w-2xl max-h-full'>
        <div className='relative bg-white rounded-lg shadow-sm'>
          <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t'>
            <h5 className='text-lg font-medium'>{title}</h5>

            <button type='button' className='' onClick={onClose}>
              <LuCross className='text-lg rotate-45 hover:text-red-600'/>
            </button>
              
          </div>
          <div className='p-4 md:p-5 space-y-4'>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}


export default Modal