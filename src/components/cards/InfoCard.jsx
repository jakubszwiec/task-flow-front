import React from 'react'

const InfoCard = ({icon, label, value, color}) => {
  return (
    <div className={`flex items-center gap-3 ${color} rounded-full p-2`}>
        <p className='text-xs md:text-[14px] text-gray-800'>
            {label}: <span className='text-sm md:text-[15px] text-black font-semibold'>{value}</span>
        </p>
    </div>
  )
}

export default InfoCard