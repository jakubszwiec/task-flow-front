import React, { useContext, useEffect, useState } from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import { useUserAuth } from '../../hooks/useUserAuth'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { UserContext } from '../../context/userContext'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import InfoCard from '../../components/cards/InfoCard'
import { LuTrash } from 'react-icons/lu'
import { PRIORITY_DATA } from '../../utils/data'
import SelectDropdown from '../../components/inputs/SelectDropdown'
import SelectUsers from '../../components/inputs/SelectUsers'
import TodoListInput from '../../components/inputs/TodoListInput'

const CreateTask = () => {
  useUserAuth()
  const {user} = useContext(UserContext)

  const location = useLocation()
  const {taskId} = location.state || {}
  const navigate = useNavigate()

  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'LOW',
    status: 'PENDING',
    dueDate: null,
    assignedTo: [],
    toDoChecklist: [],
    attachments: [],
  })

  const [currentTask, setCurrentTask] = useState(null)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value}))
  }

  const clearData = () => {
    setTaskData({
      title: '',
      description: '',
      priority: 'LOW',
      status: 'PENDING',
      dueDate: null,
      assignedTo: [],
      toDoChecklist: [],
      attachments: [],
    })
  }

  const createTask = async () => {
    setLoading(true)

    try {
      const todolist = taskData.toDoChecklist?.map((item)=>({
        text: item,
        completed: false,
      }))

      const response = await axiosInstance.post(
        API_PATHS.TASKS.CREATE_TASK, {...taskData, dueDate: new Date(taskData.dueDate).toISOString(), todoChecklist: todolist,}
      )

      //toast.success('Projekt stworzony pomyślnie')
    } catch (error) {
      console.error('Błąd tworzenia: ', error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const updateTask = async () => {}
  
  const handleSubmit = async () => {
    setError(null)

    if (!taskData.title.trim()) {
      setError('Wprowadź tytuł!')
      return
    }

    if (!taskData.description.trim()) {
      setError('Wprowadź opis!')
      return
    }

    if (!taskData.dueDate) {
      setError('Wprowadź datę!')
      return
    }

    if (taskData.assignedTo?.length === 0) {
      setError('Przypisz użytkowników!')
      return
    }

    if (taskData.toDoChecklist?.length === 0) {
      setError('Dodaj zadanie!')
      return
    }

    if (taskId) {
      updateTask()
      return
    }

    createTask()
  }

  const getTaskDetailsById = async () => {}

  const deleteTask = async () => {}

  return (
    <DashboardLayout activeMenu='Dodaj projekt'>
      <div className='mt-5'>
        <div className='card my-5'>
          <div>
            <div className='col-span-3'>
              <h2 className='text-xl md:text-2xl'>
                {taskId ? 'Edytuj Projekt' : 'Stwórz Projekt'}
              </h2>

              {taskId && (
                <button
                className='flex items-center gap-2 text-[13px] font-medium text-red-600'
                onClick={() => setOpenDeleteAlert(true)}>
                  <LuTrash className='text-base' /> Usuń
                </button>
              )}

              <div>
                <label className='text-xs font-medium text-slate-600'>Tytuł</label>

                <input 
                  placeholder=''
                  className='form-input'
                  value={taskData.title}
                  onChange={({target}) =>
                   handleValueChange('title', target.value)}
                  type="text" />
              </div>

              <div>
                <label className='text-xs font-medium text-slate-600'>Opis</label>

                <textarea 
                  placeholder=''
                  className='form-input'
                  rows={4}
                  value={taskData.description}
                  onChange={({target}) =>
                   handleValueChange('description', target.value)}
                  type="text" />
              </div>
              
              <div className='grid grid-cols-12 gap-4 mt-2'>
                <div className='col-span-6 md:col-span-4'>
                  <label className='text-xs font-medium text-slate-600'>Priorytet</label>

                  <SelectDropdown
                    placeholder='Wybierz'
                    options={PRIORITY_DATA}
                    value={taskData.priority}
                    onChange={(value) =>
                    handleValueChange('priority', value)}
                    />
                </div>

                <div className='col-span-6 md:col-span-4'>
                  <label className='text-xs font-medium text-slate-600'>Data zakończenia</label>

                  <input 
                    placeholder='DD/MM/RRRR'
                    className='form-input'
                    value={taskData.dueDate}
                    onChange={({target}) =>
                    handleValueChange('dueDate', target.value)}
                    type="date" />
                </div>

                <div className='col-span-12 md:col-span-3'>
                  <label className='text-xs font-medium text-slate-600'>Dodaj członków</label>

                  <SelectUsers
                    selectedUsers={taskData.assignedTo}
                    setSelectedUser={(value) => {
                      handleValueChange('assignedTo', value)
                    }}
                  />
                </div>
              </div>

              <div className='mt-3'>
                    <label className='text-xs font-medium text-slate-600'>Zadania</label>

                    <TodoListInput
                      todoList={taskData?.toDoChecklist}
                      setTodoList={(value)=>handleValueChange('toDoChecklist', value)}
                    />
              </div>

              {error && (
                <p className='text-xs font-medium text-red-500 mt-5'>{error}</p>
              )}

              <div className='flex justify-end mt-7'>
                <button className='add-btn'
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {taskId ? 'Aktualizuj projekt' : 'Utwórz projekt'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CreateTask