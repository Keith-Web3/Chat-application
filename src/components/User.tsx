import React from 'react'
import { useSelector } from 'react-redux'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

import { auth } from './Data/firebase'
import userImg from '../assets/MyProfile.jpg'
import logoutBtn from '../assets/arrow-right-from-bracket-solid.svg'
import '../sass/user.scss'

const User: React.FC = function () {
  const user = useSelector(
    (state: { user: any; isLoggedIn: boolean }) => state.user
  )
  const navigate = useNavigate()

  const name = user.displayName || user.email.slice(0, user.email.indexOf('@'))
  const profileImg = user.photoURL || userImg
  const signOutHandler = function () {
    signOut(auth)
    navigate('/signup')
  }

  return (
    <div className="user">
      <img src={profileImg} alt="profile" />
      <p className="name">{name}</p>
      <div className="child" onClick={signOutHandler}>
        <p>Logout</p>
        <img src={logoutBtn} alt="logout" />
      </div>
    </div>
  )
}

export default User
