import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useUserAuth } from '../../hooks/useUserAuth'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { UserContext } from '../../context/userContext'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { LuTrash } from 'react-icons/lu'
import { PRIORITY_DATA } from '../../utils/data'
import SelectDropdown from '../../components/inputs/SelectDropdown'
import SelectUsers from '../../components/inputs/SelectUsers'
import TodoListInput from '../../components/inputs/TodoListInput'
import moment from 'moment'
import Modal from '../../components/Modal'

const CreateTask = () => {
  useUserAuth()
  const { user } = useContext(UserContext)

  const { taskId } = useParams()
  const navigate = useNavigate()

  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'LOW',
    status: 'PENDING',
    dueDate: null,
    assignedToId: null, // ZMIANA: Int lub null
    createdById: user?.id, // ZMIANA: Int
    toDoCheckList: [],
    attachments: [],
  })

  const [currentTask, setCurrentTask] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false)

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }))
  }

  // Funkcja pomocnicza do budowania payloadu
  const buildPayload = () => {
    const todolist = taskData.toDoCheckList?.map((item) => ({
        text: typeof item === 'string' ? item : item.text,
        completed: typeof item === 'object' ? item.completed : false,
    }))

    return {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        toDoCheckList: todolist,
        // Upewniamy się, że wysyłamy Inty
        assignedToId: Number(taskData.assignedToId),
        createdById: Number(taskData.createdById || user?.id),
    }
  }

  const createTask = async () => {
    setLoading(true)
    try {
      const payload = buildPayload()
      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, payload)
      navigate('/tasks')
    } catch (error) {
      console.error('Błąd tworzenia: ', error)
    } finally {
      setLoading(false)
    }
  }

  const updateTask = async () => {
    setLoading(true)
    try {
      // Zachowujemy status ukończenia zadań z checklisty
      const todolist = taskData.toDoCheckList?.map((item) => {
        const textVal = typeof item === 'string' ? item : item.text
        const prevTodoCheckList = currentTask?.toDoCheckList || []
        const existingItem = prevTodoCheckList.find((todo) => todo.text === textVal)
        
        return {
          text: textVal,
          completed: existingItem ? existingItem.completed : false,
        }
      })

      const payload = {
          ...taskData,
          dueDate: new Date(taskData.dueDate).toISOString(),
          toDoCheckList: todolist,
          assignedToId: Number(taskData.assignedToId),
          createdById: Number(taskData.createdById),
      }

      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), payload)
      navigate('/tasks')
    } catch (error) {
      console.error('Błąd aktualizacji: ', error)
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
    // ZMIANA: Walidacja pojedynczego ID (czy nie jest null/0)
    if (!taskData.assignedToId) {
      setError('Przypisz użytkownika!')
      return
    }
    if (taskData.toDoCheckList?.length === 0) {
      setError('Dodaj zadanie!')
      return
    }

    if (taskId) {
      updateTask()
    } else {
      createTask()
    }
  }

  const getTaskDetailsById = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId))
      if (response.data) {
        const taskInfo = response.data
        setCurrentTask(taskInfo)
        
        // Logika wyciągania ID z assignedTo (które może być obiektem lub ID)
        let mappedAssignedToId = null
        if (taskInfo.assignedTo) {
            if (typeof taskInfo.assignedTo === 'object') {
                mappedAssignedToId = taskInfo.assignedTo.id // Jeśli backend zwraca obiekt user
            } else {
                mappedAssignedToId = taskInfo.assignedTo // Jeśli backend zwraca od razu ID
            }
        } else if (taskInfo.assignedToId) {
            // Backup na wypadek gdyby GET zwracał już nowe pole
            mappedAssignedToId = taskInfo.assignedToId
        }

        setTaskData({
          title: taskInfo.title || '',
          description: taskInfo.description || '',
          priority: taskInfo.priority || 'LOW',
          status: taskInfo.status || 'PENDING',
          dueDate: taskInfo.dueDate ? moment(taskInfo.dueDate).format('YYYY-MM-DD') : null,
          
          assignedToId: mappedAssignedToId ? Number(mappedAssignedToId) : null,
          createdById: taskInfo.createdById ? Number(taskInfo.createdById) : (taskInfo.createdBy?.id || user?.id),
          
          toDoCheckList: taskInfo?.toDoCheckList?.map((item) => item.text) || [],
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
      getTaskDetailsById()
    }
  }, [taskId])

  return (
    <DashboardLayout activeMenu='Dodaj projekt'>
      <div className='mt-5'>
        <div className='card my-5'>
          <div>
            <div className='col-span-3'>
              {/* Header i Przycisk Usuń */}
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl md:text-2xl font-bold text-gray-800'>
                  {taskId ? 'Edytuj Projekt' : 'Stwórz Projekt'}
                </h2>

                {taskId && (
                  <button
                    type="button"
                    className='flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors bg-red-50 px-3 py-2 rounded-lg'
                    onClick={() => setOpenDeleteAlert(true)}
                  >
                    <LuTrash className='text-lg' /> Usuń projekt
                  </button>
                )}
              </div>

              {/* Formularz */}
              <div>
                <label className='text-xs font-medium text-slate-600'>Tytuł</label>
                <input 
                  placeholder='Wpisz tytuł'
                  className='form-input'
                  value={taskData.title}
                  onChange={({target}) => handleValueChange('title', target.value)}
                  type="text" 
                />
              </div>

              <div className='mt-3'>
                <label className='text-xs font-medium text-slate-600'>Opis</label>
                <textarea 
                  placeholder='Wpisz opis zadania'
                  className='form-input'
                  rows={4}
                  value={taskData.description}
                  onChange={({target}) => handleValueChange('description', target.value)}
                />
              </div>
              
              <div className='grid grid-cols-12 gap-4 mt-3'>
                <div className='col-span-6 md:col-span-4'>
                  <label className='text-xs font-medium text-slate-600'>Priorytet</label>
                  <SelectDropdown
                    placeholder='Wybierz'
                    options={PRIORITY_DATA}
                    value={taskData.priority}
                    onChange={(value) => handleValueChange('priority', value)}
                    />
                </div>

                <div className='col-span-6 md:col-span-4'>
                  <label className='text-xs font-medium text-slate-600'>Data zakończenia</label>
                  <input 
                    placeholder='DD/MM/RRRR'
                    className='form-input'
                    value={taskData.dueDate || ''}
                    onChange={({target}) => handleValueChange('dueDate', target.value)}
                    type="date" 
                   />
                </div>

                <div className='col-span-12 md:col-span-3'>
                  <label className='text-xs font-medium text-slate-600'>Przypisz wykonawcę</label>
                  
                  {/* Komponent SelectUsers - przekazujemy pojedyncze ID */}
                  <SelectUsers
                    thisUserId={user?.id}
                    selectedUserId={taskData.assignedToId}
                    setSelectedUser={(id) => handleValueChange('assignedToId', id)}
                  />
                </div>
              </div>

              <div className='mt-3'>
                    <label className='text-xs font-medium text-slate-600'>Lista zadań (Checklist)</label>
                    <TodoListInput
                      todoList={taskData?.toDoCheckList}
                      setTodoList={(value)=>handleValueChange('toDoCheckList', value)}
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