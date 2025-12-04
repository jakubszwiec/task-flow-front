import React, { useState, useEffect } from 'react'
import axiosInstance from '../../utils/axiosInstance' // Dostosuj ścieżkę
import { API_PATHS } from '../../utils/apiPaths'       // Dostosuj ścieżkę
import moment from 'moment' // Opcjonalnie do formatowania daty (npm install moment)
import { LuCalendar } from 'react-icons/lu'
import DashboardLayout from '../../components/layouts/DashboardLayout'

const ManageTasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  // Pobieranie zadań z API
  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS || '/tasks')
      if (response.data) {
        setTasks(response.data)
      }
    } catch (error) {
      console.error("Błąd pobierania zadań:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllTasks()
  }, [])

  // Funkcja pomocnicza do kolorów priorytetów
  const getPriorityColor = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'WYSOKI':
      case 'HIGH':
        return 'bg-red-100 text-red-600';
      case 'ŚREDNI':
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-600';
      case 'NISKI':
      case 'LOW':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  // Filtrowanie zadań do odpowiednich kolumn
  // UWAGA: Sprawdź w bazie jakie masz dokładnie statusy (PENDING czy TODO?)
  const todoTasks = tasks.filter(task => task.status === 'PENDING' || task.status === 'TODO')
  const inProgressTasks = tasks.filter(task => task.status === 'IN_PROGRESS')
  const completedTasks = tasks.filter(task => task.status === 'COMPLETED')

  // Komponent pojedynczej karty zadania
  const TaskCard = ({ task }) => (
    <div className='bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 mb-3 hover:shadow-md transition-shadow cursor-pointer'>
      <div className='flex justify-between items-start mb-2'>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </div>
      
      <h4 className='font-semibold text-gray-800 mb-1 line-clamp-2'>{task.title}</h4>
      <p className='text-xs text-gray-500 mb-3 line-clamp-2'>{task.description}</p>
      
      <div className='flex items-center justify-between pt-2 border-t border-gray-100'>
        <div className='flex items-center gap-1 text-xs text-gray-500'>
            <LuCalendar className='text-gray-400'/>
            {task.dueDate ? moment(task.dueDate).format("DD MMM") : 'Brak daty'}
        </div>

        <div className='flex items-center gap-1 text-xs text-gray-500'>
            {task.dueDate ? moment(task.dueDate).format("DD MMM") : 'Brak daty'}
        </div>
        
        {/* Tu możesz dodać avatary przypisanych osób */}
        {task.assignedTo?.length > 0 && (
            <div className='flex -space-x-2'>
                {task.assignedTo.slice(0,3).map((u, i) => (
                    <div key={i} className='w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] border-2 border-white'>
                        {/* Pierwsza litera imienia */}
                        {u.name ? u.name[0] : 'U'}
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  )

  if (loading) return <div className='p-8 text-center'>Ładowanie zadań...</div>

  return (
    <DashboardLayout activeMenu='Moje projekty'>
    <div className='w-full p-6'>
      
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        
        {/* Kolumna 1: Do zrobienia */}
        <div className='card min-h-[500px]'>
            <div className='flex items-center justify-between mb-4'>
                <h3 className='font-semibold text-orange-800'>Do zrobienia</h3>
                <span className='bg-orange-300 text-gray-600 text-xs font-bold px-2 py-1 rounded-md'>
                    {todoTasks.length}
                </span>
            </div>
            <div className='space-y-3'>
                {todoTasks.map(task => <TaskCard key={task._id} task={task} />)}
                {todoTasks.length === 0 && <p className='text-sm text-gray-400 text-center py-4'>Brak zadań</p>}
            </div>
        </div>

        {/* Kolumna 2: W trakcie */}
        <div className='card min-h-[500px]'>
            <div className='flex items-center justify-between mb-4'>
                <h3 className='font-semibold text-blue-800'>W trakcie</h3>
                <span className='bg-blue-200 text-blue-800 text-xs font-bold px-2 py-1 rounded-md'>
                    {inProgressTasks.length}
                </span>
            </div>
            <div className='space-y-3'>
                {inProgressTasks.map(task => <TaskCard key={task._id} task={task} />)}
                {inProgressTasks.length === 0 && <p className='text-sm text-blue-300 text-center py-4'>Pusto tutaj</p>}
            </div>
        </div>

        {/* Kolumna 3: Zrobione */}
        <div className='card min-h-[500px]'>
            <div className='flex items-center justify-between mb-4'>
                <h3 className='font-semibold text-green-800'>Zrobione</h3>
                <span className='bg-green-200 text-green-800 text-xs font-bold px-2 py-1 rounded-md'>
                    {completedTasks.length}
                </span>
            </div>
            <div className='space-y-3'>
                {completedTasks.map(task => <TaskCard key={task._id} task={task} />)}
                {completedTasks.length === 0 && <p className='text-sm text-green-300 text-center py-4'>Brak ukończonych zadań</p>}
            </div>
        </div>

      </div>
    </div>
    </DashboardLayout>
  )
}

export default ManageTasks