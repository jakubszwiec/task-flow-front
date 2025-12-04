import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { LuUsers } from 'react-icons/lu'
import Modal from '../Modal'

const SelectUsers = ({selectedUsers, setSelectedUser}) => {
  const [allUsers, setAllUsers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tempSelectedUsers, setTempSelectedUsers] = useState([])

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.USERS.GET_ALL_USERS
      )
      if (response.data?.length>0) {
        setAllUsers(response.data)
      }
    } catch (e) {
      console.error('Błąd wczytywania użytkowników ', e)
    }
  }

  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    )
  }

  const handleAssign = () => {
    setSelectedUser(tempSelectedUsers)
    setIsModalOpen(false)
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  useEffect(() => {
    if (selectedUsers.length === 0) {
        setTempSelectedUsers([])
    }

    return () => {}
  }, [selectedUsers])

  return (
    <div className='space-y-4 mt-2'>
        <button className='card-btn-lg' onClick={() => setIsModalOpen(true)}>
            <LuUsers className='text-sm'/> Wybierz
        </button>

        <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title='Wybierz członków'
        >
            <div className='space-y-4 h-[60vh] overflow-y-auto'>
                {allUsers.map((user) => (
                    <div key={user.id} className='flex items-center gap-4 p-3 border-b border-gray-200'>
                        <div className='flex-1'>
                            <p className='font-medium text-gray-800'>{user.name}</p>
                            <p className='text-[13px] text-gray-500'>{user.email}</p>
                        </div>
                        <input 
                            type="checkbox" 
                            className='w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none' 
                            checked={tempSelectedUsers.includes(user.id)}
                            onChange={()=>toggleUserSelection(user.id)}
                        />
                    </div>
                ))}
            </div>

            <div className='flex justify-end gap-4 pt-4'>
                <button className='card-btn' onClick={()=>setIsModalOpen(false)}>
                    Anuluj
                </button>
                <button className='card-btn-fill' onClick={handleAssign}>
                    Zatwierdź
                </button>
            </div>
        </Modal>
    </div>
  )
}

export default SelectUsers