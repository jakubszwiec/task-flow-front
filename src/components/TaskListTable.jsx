import React from 'react'

const TaskListTable = ({ tableData }) => {
  return (
    <div className='overflow-x-auto p-0 rounded-lg mt-3'>
        <table className='min-w-full'>
            <thead>
                <tr className='text-left'>
                    <th className='py-3 px-4 text-gray-800 font-medium text-[13px]'>Nazwa</th>
                    <th className='py-3 px-4 text-gray-800 font-medium text-[13px]'>Status</th>
                    <th className='py-3 px-4 text-gray-800 font-medium text-[13px]'>Waga</th>
                    <th className='py-3 px-4 text-gray-800 font-medium text-[13px] hidden md:table-cell'>Data zakończenia</th>
                </tr>
            </thead>
            <tbody>
                {tableData.map((task)=> (
                    <tr key={task._id} className='border-t border-gray-200'>
                        <td className='py-3 px-4 text-gray-700 text-[13px]'>
                            <div className='line-clamp-1'>{task.title}</div>
                        </td>
                        
                        <td className='py-3 px-4 text-gray-700 text-[13px]'>
                            <div className='line-clamp-1'>{task.status}</div>
                        </td>

                        <td className='py-3 px-4 text-gray-700 text-[13px]'>
                            <div className='line-clamp-1'>{task.priority}</div>
                        </td>

                        <td className='py-3 px-4 text-gray-700 text-[13px] hidden md:table-cell'>
                            <div className='line-clamp-1'>{task.createdAt}</div>
                        </td>
                    </tr>   
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default TaskListTable