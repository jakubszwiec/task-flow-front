import React, { useContext, useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { useUserAuth } from '../../hooks/useUserAuth'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { UserContext } from '../../context/userContext'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import InfoCard from '../../components/cards/InfoCard'
import TaskListTable from '../../components/TaskListTable'
import CustomPieChart from '../../components/CustomPieChart'

const COLORS_1 = [ '#00aa00', '#0000aa',  '#aa0000', ]
const COLORS_2 = [ '#00aa00', '#0000aa', '#aa0000', ]

const Dashboard = () => {
  useUserAuth()

  const {user} = useContext(UserContext)

  const navigate = useNavigate()

  const [dashboardData, setDashboardData] = useState(null)
  const [pieChartData, setPieChartData] = useState([])
  const [barChartData, setBarChartData] = useState([])

  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || null
    const taskPriorityLevels = data?.taskPriorityLevels || null

    const taskDistributionData = [
      {status: 'Przed terminem', count: taskDistribution?.PENDING || 0},
      {status: 'W terminie', count: taskDistribution?.IN_PROGRESS || 0},
      { status: 'Po terminie', count: taskDistribution?.OVERDUE || 0 },
    ]

    setPieChartData(taskDistributionData)
    
    const taskPriorityData = [
      {status: 'Niski', count: taskPriorityLevels?.LOW || 0},
      {status: 'Średni', count: taskPriorityLevels?.MEDIUM || 0},
      {status: 'Wysoki', count: taskPriorityLevels?.HIGH || 0},
    ]

    setBarChartData(taskPriorityData)
  }

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      )
      if (response.data) {
        setDashboardData(response.data)
        prepareChartData(response.data)
      }
    } catch (e) {
      console.error('Błąd wczytywania użytkownika: ', e)
    }
  }

  useEffect(() => {
          getDashboardData()
          
          return () => {}
      }, [])

  return (
    <DashboardLayout activeMenu='Panel'>
        <div className='card my-5'>
          <div>
            <div className='col-span-3'>
              <h2 className='text-xl md:text-2xl'>Statystyka projektów</h2>
            </div>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-16 mt-5'>
            <InfoCard
              label='Wszystkie'
              value={dashboardData?.totalTasks || 0}
              color='bg-gray-100'
            />

            <InfoCard
              label='Do zrobienia'
              value={dashboardData?.pendingTasks || 0}
              color='bg-orange-300'
            />

            <InfoCard
              label='W trakcie'
              value={dashboardData?.inProgressTasks || 0}
              color='bg-blue-200'
            />

            <InfoCard
              label='Zrobione'
              value={dashboardData?.completedTasks || 0}
              color='bg-green-400'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6'>

          <div className='card'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl md:text-2xl'>Predykcja</h2>
            </div>

            <CustomPieChart 
              data={pieChartData}
              colors={COLORS_1}
            /> 
          </div>

          <div className='card'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl md:text-2xl'>Priorytet</h2>
            </div>

            <CustomPieChart 
              data={barChartData}
              colors={COLORS_2}
            />
          </div>

          <div className='md:col-span-2'>
            <div className='card'>
              <div className='flex items-center justify-between'>
                <h2 className='text-xl md:text-2xl'>Ostatnie zadania:</h2>
              </div>
              <TaskListTable tableData={dashboardData?.recentTasks || []}/>
            </div>
          </div>
        </div>
    </DashboardLayout>
  )
}

export default Dashboard