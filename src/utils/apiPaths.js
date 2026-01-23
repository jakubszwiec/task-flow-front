export const BASE_URL = 'http://localhost:8081'

export const API_PATHS = {
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        GET_PROFILE: '/users/me',
    },

    USERS: {
        GET_ALL_USERS: '/users',
        GET_USER_BY_ID: (userId) => `/users/${userId}`,
        CREATE_USER: '/users',
        UPDATE_USER: (userId) => `/users/${userId}`,
        DELETE_USER: (userId) => `/users/${userId}`,
    },

    TASKS: {
        GET_DASHBOARD_DATA: '/tasks/me',
        GET_USER_DASHBOARD_DATA: '/tasks/user-dashboard-data',
        GET_ALL_TASKS: '/tasks',
        GET_TASK_BY_ID: (taskId) => `/tasks/${taskId}`,
        CREATE_TASK: '/tasks',
        UPDATE_TASK: (taskId) => `/tasks/${taskId}`,
        DELETE_TASK: (taskId) => `/tasks/${taskId}`,
        UPDATE_TASK_STATUS: (taskId) => `/tasks/${taskId}/status`,
        UPDATE_TASK_CHECKLIST: (taskId) => `/tasks/${taskId}/todo`,
    },

    REPORTS: {
        EXPORT_TASKS: '/reports/export/tasks',
        EXPORT_USERS: '/reports/export/users',
    },

    IMAGE: {
        UPLOAD_IMAGE: '/auth/upload-image'
    }
}