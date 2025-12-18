import {
    LuLayoutDashboard,
    LuUsers,
    LuClipboardCheck,
    LuSquarePlus,
    LuLogOut,
} from 'react-icons/lu'

export const SIDE_MENU_DATA = [
    {
        id:'01',
        label:'Panel',
        icon:LuLayoutDashboard,
        path:'/dashboard'
    },
    {
        id:'02',
        label:'Moje projekty',
        icon:LuClipboardCheck,
        path:'/tasks'
    },
    {
        id:'03',
        label:'Dodaj projekt',
        icon:LuSquarePlus,
        path:'/create-task'
    },
    {
        id:'04',
        label:'Wyloguj',
        icon:LuLogOut,
        path:'logout'
    }
]

export const PRIORITY_DATA = [
    {label:'Niski', value:'LOW'},
    {label:'Średni', value:'MEDIUM'},
    {label:'Wysoki', value:'HIGH'},
]

export const STATUS_DATA = [
    {label:'Oczekujące', value:'PENDING'},
    {label:'W Trakcie', value:'IN_PROGRESS'},
    {label:'Ukończone', value:'COMPLETED'},
]