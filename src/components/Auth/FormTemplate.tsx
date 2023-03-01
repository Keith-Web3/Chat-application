import React, { FormEvent, ReactNode, useRef } from 'react'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'

import { signIn } from '../store/AuthState'
import emailImg from '../../assets/envelope-solid.svg'
import passwordImg from '../../assets/lock-solid.svg'
import logo from '../../assets/devchallenges-light.svg'
import AuthInput from '../UI/AuthInput'
import Button from '../UI/Button'
import '../../sass/Auth/form-template.scss'
import SocialProfiles from '../Utils/SocialProfiles'
import { useNavigate } from 'react-router-dom'

interface Props {
  children: ReactNode
  button: string
  footer: ReactNode
  type: 'EMAILANDPASSWORDLOGIN' | 'EMAILANDPASSWORDSIGNUP'
}

const FormTemplate: React.FC<Props> = function ({
  children,
  button,
  footer,
  type,
}) {
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const submitHandler = function (
    type: 'EMAILANDPASSWORDLOGIN' | 'EMAILANDPASSWORDSIGNUP'
  ) {
    return (e: FormEvent) => {
      e.preventDefault()

      dispatch(
        signIn({
          type,
          email: emailRef.current!.value,
          password: passwordRef.current!.value,
          navigateFn: navigate,
        }) as unknown as ActionCreatorWithPayload<{
          type: 'GOOGLE' | 'EMAILANDPASSWORD'
          email?: string
          password?: string
        }>
      )
    }
  }
  return (
    <div className="form-template-container">
      <motion.form
        className="form-template"
        onSubmit={submitHandler(type)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <img src={logo} alt="logo" />
        {children}
        <AuthInput type="email" img={emailImg} ref={emailRef} />
        <AuthInput type="password" img={passwordImg} ref={passwordRef} />
        <Button type="submit">{button}</Button>
        <p>or continue with google</p>
        <SocialProfiles />
        {footer}
      </motion.form>
    </div>
  )
}

export default FormTemplate
