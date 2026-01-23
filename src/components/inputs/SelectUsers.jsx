import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { LuUsers } from 'react-icons/lu'
import Modal from '../Modal'

const SelectUsers = ({ thisUserId, selectedUserId, setSelectedUser }) => {
  const [allUsers, setAllUsers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Stan tymczasowy wewnątrz modala (przechowuje ID jako Int lub null)
  const [tempSelectedId, setTempSelectedId] = useState(null)

  const getAllUsers = async () => {
    try {
      // Upewnij się, że ten endpoint zwraca listę userów z polem 'id' (Int)
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS)
      
      if (response.data?.length > 0) {
        // Filtrujemy zalogowanego użytkownika (porównanie ID)
        const filteredUsers = response.data.filter(
            (u) => u.id !== thisUserId
        )
        setAllUsers(filteredUsers)
      }
    } catch (e) {
      console.error('Błąd wczytywania użytkowników ', e)
    }
  }

  // Funkcja zmiany zaznaczenia (Radio logic)
  const handleRadioChange = (userId) => {
    setTempSelectedId(Number(userId)) // Wymuszamy Number
  }

  // Kliknięcie "Zatwierdź"
  const handleAssign = () => {
    setSelectedUser(tempSelectedId) // Przekazujemy pojedyncze ID do rodzica
    setIsModalOpen(false)
  }

  // Pobranie userów przy starcie
  useEffect(() => {
    getAllUsers()
  }, [])

  // Synchronizacja stanu po otwarciu modala lub zmianie propa z zewnątrz
  useEffect(() => {
    if (selectedUserId) {
        setTempSelectedId(Number(selectedUserId))
    } else {
        setTempSelectedId(null)
    }
  }, [selectedUserId, isModalOpen])

  return (
    <div className='space-y-4 mt-2'>
        <button 
            type="button" // Ważne: zapobiega submitowi formularza CreateTask
            className='card-btn-lg' 
            onClick={() => setIsModalOpen(true)}
        >
            <LuUsers className='text-sm'/> 
            {selectedUserId ? 'Zmień wykonawcę' : 'Wybierz wykonawcę'}
        </button>

        <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title='Wybierz wykonawcę'
        >
            <div className='space-y-4 h-[60vh] overflow-y-auto'>
                {allUsers.map((user) => (
                    <label 
                        key={user.id} 
                        className={`flex items-center gap-4 p-3 border-b border-gray-200 cursor-pointer transition-colors ${
                            tempSelectedId === user.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                    >
                        <div className='flex-1'>
                            <p className='font-medium text-gray-800'>{user.fullName || user.username || user.name}</p>
                            <p className='text-[13px] text-gray-500'>{user.email}</p>
                        </div>
                        
                        <input 
                            type="radio" 
                            name="assignedUser" // Grupowanie radio buttonów
                            className='w-4 h-4 text-primary border-gray-300 focus:ring-primary' 
                            checked={tempSelectedId === user.id}
                            onChange={() => handleRadioChange(user.id)}
                        />
                    </label>
                ))}
            </div>

            <div className='flex justify-end gap-4 pt-4'>
                <button 
                    type="button"
                    className='card-btn' 
                    onClick={()=>setIsModalOpen(false)}
                >
                    Anuluj
                </button>
                <button 
                    type="button"
                    className='card-btn-fill disabled:opacity-50' 
                    onClick={handleAssign}
                    disabled={!tempSelectedId} // Blokada jeśli nikt nie wybrany
                >
                    Zatwierdź
                </button>
            </div>
        </Modal>
    </div>
  )
}

export default SelectUsers