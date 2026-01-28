import React, { createContext, useEffect, useState } from 'react'
import { API_PATHS } from '../utils/apiPaths'
import axiosInstance from '../utils/axiosInstance'

export const UserContext = createContext()

const UserProvider = ({children}) => {
  // ZMIANA 1: Inicjalizacja stanu z localStorage (dla natychmiastowego efektu)
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const accessToken = localStorage.getItem('token')
    
    // Jeśli nie ma tokena, a mamy usera w stanie (np. po wygasnieciu sesji), czyścimy
    if (!accessToken) {
      clearUser()
      setLoading(false)
      return
    }

    // Ten fetch jest nadal ważny! Służy do weryfikacji czy dane w localStorage są aktualne
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE)
        
        // Aktualizujemy stan i localStorage najświeższymi danymi z serwera
        setUser(response.data)
        localStorage.setItem('user', JSON.stringify(response.data))
        
      } catch (e) {
        console.error('Użytkownik nie zautoryzowany lub błąd sieci', e)
        // Jeśli token wygasł, wyloguj użytkownika
        clearUser() 
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  // ZMIANA 2: Ta funkcja tylko aktualizuje usera. Tokenem zarządzasz przy Login/Logout.
  const updateUser = (userData) => {
    setUser(userData)
    // Zapisujemy usera do localStorage, żeby przetrwał odświeżenie strony
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // ZMIANA 3: Czyścimy wszystko
  const clearUser = ()  => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user') // Usuwamy też cache danych usera
  }

  return (
    <UserContext.Provider value = {{user, loading, updateUser, clearUser}}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider