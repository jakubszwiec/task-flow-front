import React from 'react'

const TaskListTable = ({tableData}) => {
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
                        <td className='my-3 mx-4 text-gray-700 text-[13px] line-clamp-1 overflow-hidden'>{task.title}</td>
                        <td className='my-3 mx-4 text-gray-700 text-[13px] line-clamp-1 overflow-hidden'>{task.status}</td>
                        <td className='my-3 mx-4 text-gray-700 text-[13px] line-clamp-1 overflow-hidden'>{task.priority}</td>
                        <td className='my-3 mx-4 text-gray-700 text-[13px] line-clamp-1 overflow-hidden'>{task.createdAt}</td>
                    </tr>   
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default TaskListTable