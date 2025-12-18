import React, { useContext, useEffect, useState } from 'react'
import {useLocation, useNavigate, useParams} from 'react-router-dom'
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
import moment from 'moment'
import Modal from '../../components/Modal'

const CreateTask = () => {
  useUserAuth()
  const {user} = useContext(UserContext)

  // const location = useLocation()
  // const { taskId } = location.state || {}

  const { taskId } = useParams()
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

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false)

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
      navigate('/tasks')
  }

  const updateTask = async () => {
    setLoading(true)

    try {
      const todolist = taskData.toDoChecklist?.map((item)=>{
        const prevTodoChecklist = currentTask?.toDoChecklist || []
        const existingItem = prevTodoChecklist.find((todo) => todo.text === item)
        return {
          text: item,
          completed: existingItem ? existingItem.completed : false,
        }
      })

      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TASK(taskId),
        {...taskData, dueDate: new Date(taskData.dueDate).toISOString(), todoChecklist: todolist,}
      )
    } catch (error) {
      console.error('Błąd aktualizacji: ', error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }
  
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

  const getTaskDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
      )
      if (response.data) {
        const taskInfo = response.data
        setCurrentTask(taskInfo)
        setTaskData({
          title: taskInfo.title || '',
          description: taskInfo.description || '',
          priority: taskInfo.priority || 'LOW',
          status: taskInfo.status || 'PENDING',
          dueDate: taskInfo.dueDate 
            ? moment(taskInfo.dueDate).format('YYYY-MM-DD') 
            : null,
          //assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
          assignedTo: [],
          toDoChecklist: taskInfo?.toDoChecklist?.map((item) => item.text) || [],
          attachments: [],
        })
      }
    } catch (error) {
      console.error("Błąd pobierania szczegółów zadania:", error)
    }
  }

  const deleteTask = async () => {
    try {
      setLoading(true)
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId))
      navigate('/tasks')
    } catch (error) {
      console.error("Błąd usuwania zadania:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (taskId) {
      getTaskDetailsById(taskId)
    }

    return () => {}
  }, [taskId])

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
      <Modal isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Usuń zadanie">
        <p>Czy na pewno chcesz usunąć to zadanie? Tej operacji nie można cofnąć.</p>
        <div className='flex items-center justify-end gap-3 mt-4'>
            <button className='px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300'
                onClick={() => setOpenDeleteAlert(false)}>
                Anuluj
            </button>
            <button className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
                onClick={deleteTask}>
                Usuń
            </button>
        </div>

    </Modal>
    </DashboardLayout>
  )
}

export default CreateTask