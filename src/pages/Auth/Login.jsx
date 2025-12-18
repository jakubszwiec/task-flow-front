import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import {Link, useNavigate} from 'react-router-dom'
import Input from '../../components/inputs/Input'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { UserContext } from '../../context/userContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const {updateUser} = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      setError("Wprowadź poprawny adres email")
      return
    }

    if (!password) {
      setError('Wprowadź hasło')
      return
    }

    setError('')

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      })

      const {token, role} = response.data

      if (token) {
        localStorage.setItem('token', token)
        updateUser(response.data)

        navigate('/dashboard')
      }
    } catch (e) {
      if (e.response && e.response.data.message) {
        setError(e.response.data.message)
      } else {
        setError('Coś poszło nie tak')
      }
    }

  }

  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h2 className='text-xl font-semibold text-black'>Login</h2>
        <p>
          Wprowadź dane logowania
        </p>

        <form onSubmit={handleLogin}>
          <Input 
            value={email}
            onChange={({target}) => setEmail(target.value)}
            label="Adres Email"
            placeholder="jankowalski@mail.pl"
            type='text'
          />

          <Input 
            value={password}
            onChange={({target}) => setPassword(target.value)}
            label="Hasło"
            placeholder="*********"
            type='password'
          />

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type="submit" className='btn-primary'>ZALOGUJ</button>

          <p className='text-[13px] text-slate-800 mt-3'>
            <Link className='font-medium text-primary underline' to='/signup'>
              Zarejestruj się tutaj
            </Link>
          </p>
        </form>

      </div>
    </AuthLayout>
  )
}

export default Login