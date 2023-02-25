import { nanoid } from 'nanoid'
import { useDispatch } from 'react-redux/es/exports'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { signIn } from '../store/AuthState'
import googleImg from '../../assets/google.png'

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
    <motion.div
      className="social-profiles"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={googleLoginHandler}
    >
      {[googleImg].map((img, idx) => (
        <img src={img} alt="social" key={nanoid()} />
      ))}
      <p>Sign in with Google</p>
    </motion.div>
  )
}

export default SocialProfiles
