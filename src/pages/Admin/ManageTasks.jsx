import React, { useState, useEffect } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import moment from 'moment'
import { LuCalendar } from 'react-icons/lu'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom'
// Importujemy komponenty do Drag & Drop
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

const ManageTasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Pobieranie zadań
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

  // --- LOGIKA DRAG & DROP ---

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result

    // 1. Jeśli upuszczono poza obszarem listy lub w to samo miejsce -> nic nie rób
    if (!destination) return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    // 2. Pobieramy nowy status z ID kolumny, do której upuszczono
    // destination.droppableId będzie równy np. 'PENDING', 'IN_PROGRESS' lub 'COMPLETED'
    const newStatus = destination.droppableId

    // 3. OPTYMISTYCZNA AKTUALIZACJA UI (żeby użytkownik nie czekał na API)
    // Tworzymy nową tablicę zadań z zaktualizowanym statusem przesuniętego zadania
    const updatedTasks = tasks.map((task) => {
        // Sprawdzamy ID (zabezpieczenie czy id to string/number)
        if (task.id.toString() === draggableId || task._id === draggableId) {
            return { ...task, status: newStatus }
        }
        return task
    })
    
    setTasks(updatedTasks)

    // 4. WYWOŁANIE API
    try {
        // Endpoint: /tasks/{taskId}/status
        // Body: { status: 'IN_PROGRESS' } - dostosuj format do swojego backendu
        // Jeśli backend przyjmuje sam string w body, zmień payload.
        await axiosInstance.patch(API_PATHS.TASKS.UPDATE_TASK_STATUS(draggableId, newStatus))
        console.log(`Zaktualizowano status zadania ${draggableId} na ${newStatus}`)
    } catch (error) {
        console.error("Błąd aktualizacji statusu:", error)
        // Opcjonalnie: Cofnij zmiany w UI w przypadku błędu (pobierz zadania ponownie)
        getAllTasks() 
        alert("Nie udało się zaktualizować statusu zadania.")
    }
  }

  // --- POMOCNICZE ---

  const getPriorityColor = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'WYSOKI': case 'HIGH': return 'bg-red-100 text-red-600';
      case 'ŚREDNI': case 'MEDIUM': return 'bg-yellow-100 text-yellow-600';
      case 'NISKI': case 'LOW': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  const handleClick = (taskId) => {
    navigate(`/edit-task/${taskId}`)
  }

  // Filtrowanie zadań do odpowiednich kolumn
  const todoTasks = tasks.filter(task => task.status === 'PENDING' || task.status === 'TODO')
  const inProgressTasks = tasks.filter(task => task.status === 'IN_PROGRESS')
  const completedTasks = tasks.filter(task => task.status === 'COMPLETED')

  // Komponent pojedynczej karty (teraz wewnątrz renderowania, aby mieć dostęp do propsów Draggable)
  // Przeniosłem logikę renderowania bezpośrednio do pętli map, co jest wymagane przez bibliotekę dnd dla poprawnego refowania
  
  const renderTaskCard = (task, index) => {
    // Używamy task.id lub task._id (zależnie co zwraca backend) jako klucz
    const taskId = task.id ? task.id.toString() : task._id;

    return (
      <Draggable key={taskId} draggableId={taskId} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
                ...provided.draggableProps.style,
                opacity: snapshot.isDragging ? 0.8 : 1,
            }}
            className='bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 mb-3 hover:shadow-md transition-shadow cursor-pointer'
            onClick={() => handleClick(taskId)}
          >
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
            </div>
          </div>
        )}
      </Draggable>
    )
  }

  if (loading) return <div className='p-8 text-center'>Ładowanie zadań...</div>

  return (
    <DashboardLayout activeMenu='Moje projekty'>
    <div className='w-full p-6'>
      
      {/* Kontekst Drag and Drop obejmuje całą siatkę kolumn */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          
          {/* Kolumna 1: Do zrobienia (PENDING) */}
          <Droppable droppableId="PENDING">
            {(provided, snapshot) => (
                <div 
                    className={`card min-h-[500px] flex flex-col ${snapshot.isDraggingOver ? 'bg-orange-50' : ''}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='font-semibold text-orange-800'>Do zrobienia</h3>
                        <span className='bg-orange-300 text-gray-600 text-xs font-bold px-2 py-1 rounded-md'>
                            {todoTasks.length}
                        </span>
                    </div>
                    
                    <div className='space-y-1 flex-1'>
                        {todoTasks.map((task, index) => renderTaskCard(task, index))}
                        {provided.placeholder}
                    </div>
                    
                    {todoTasks.length === 0 && !snapshot.isDraggingOver && (
                        <p className='text-sm text-gray-400 text-center py-4'>Brak zadań</p>
                    )}
                </div>
            )}
          </Droppable>

          {/* Kolumna 2: W trakcie (IN_PROGRESS) */}
          <Droppable droppableId="IN_PROGRESS">
            {(provided, snapshot) => (
                <div 
                    className={`card min-h-[500px] flex flex-col ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='font-semibold text-blue-800'>W trakcie</h3>
                        <span className='bg-blue-200 text-blue-800 text-xs font-bold px-2 py-1 rounded-md'>
                            {inProgressTasks.length}
                        </span>
                    </div>
                    
                    <div className='space-y-1 flex-1'>
                        {inProgressTasks.map((task, index) => renderTaskCard(task, index))}
                        {provided.placeholder}
                    </div>

                    {inProgressTasks.length === 0 && !snapshot.isDraggingOver && (
                        <p className='text-sm text-blue-300 text-center py-4'>Pusto tutaj</p>
                    )}
                </div>
            )}
          </Droppable>

          {/* Kolumna 3: Zrobione (COMPLETED) */}
          <Droppable droppableId="COMPLETED">
            {(provided, snapshot) => (
                <div 
                    className={`card min-h-[500px] flex flex-col ${snapshot.isDraggingOver ? 'bg-green-50' : ''}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='font-semibold text-green-800'>Zrobione</h3>
                        <span className='bg-green-200 text-green-800 text-xs font-bold px-2 py-1 rounded-md'>
                            {completedTasks.length}
                        </span>
                    </div>
                    
                    <div className='space-y-1 flex-1'>
                        {completedTasks.map((task, index) => renderTaskCard(task, index))}
                        {provided.placeholder}
                    </div>

                    {completedTasks.length === 0 && !snapshot.isDraggingOver && (
                         <p className='text-sm text-green-300 text-center py-4'>Brak ukończonych zadań</p>
                    )}
                </div>
            )}
          </Droppable>

        </div>
      </DragDropContext>
    </div>

    </DashboardLayout>
  )
}

export default ManageTasks