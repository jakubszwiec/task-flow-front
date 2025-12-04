import React, { useState, useContext } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import {Link, useNavigate} from 'react-router-dom'
import Input from '../../components/inputs/Input'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { UserContext } from '../../context/userContext'

const SignUp = () => {
  const [profilePic, setProfilePic] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [adminInviteToken, setAdminInviteToken] = useState('')

  const {updateUser} = useContext(UserContext)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()

    


    if (!fullName) {
      setError('Wprowadź swoje imię i nazwisko')
      return
    }

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
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password
      })

      const {token, role} = response.data

      if (token) {
        localStorage.setItem('token', token)
        updateUser(response.data)

        navigate('/admin/dashboard')
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
        <h2 className='text-xl font-semibold text-black'>Rejestracja</h2>
        <p>
          Wprowadź swoje dane
        </p>

        <form onSubmit={handleSignUp}>
          
          <Input 
            value={fullName}
            onChange={({target}) => setFullName(target.value)}
            label="Nazwa użytkownika"
            placeholder="Jan"
            type='text'
          />

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

          <button type="submit" className='btn-primary'>ZAREJESTRUJ</button>

          <p className='text-[13px] text-slate-800 mt-3'>
            <Link className='font-medium text-primary underline' to='/login'>
              Zaloguj się tutaj
            </Link>
          </p>
        </form>

      </div>
    </AuthLayout>
  )
}

export default SignUp