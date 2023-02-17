import { nanoid } from 'nanoid'
import { useDispatch } from 'react-redux/es/exports'

import { signIn } from '../store/AuthState'
import googleImg from '../../assets/google.png'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { useNavigate } from 'react-router-dom'

const SocialProfiles: React.FC = function () {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const googleLoginHandler = function () {
    dispatch(
      signIn({
        type: 'GOOGLE',
        navigateFn: navigate,
      }) as unknown as ActionCreatorWithPayload<{
        type: 'GOOGLE' | 'EMAILANDPASSWORD'
        email?: string
        password?: string
      }>
    )
  }
  return (
    <div className="social-profiles" onClick={googleLoginHandler}>
      {[googleImg].map((img, idx) => (
        <img src={img} alt="social" key={nanoid()} />
      ))}
      <p>Sign in with Google</p>
    </div>
  )
}

export default SocialProfiles
