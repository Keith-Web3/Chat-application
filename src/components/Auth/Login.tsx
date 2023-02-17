import React from 'react'
import FormTemplate from './FormTemplate'
import { Link } from 'react-router-dom'

function Login() {
  const footer = (
    <div className="footer">
      <p>Don't have an account yet? </p>
      <Link to="/signup">Register</Link>
    </div>
  )
  return (
    <FormTemplate button="Login" footer={footer} type="EMAILANDPASSWORDLOGIN">
      <h1>Login</h1>
    </FormTemplate>
  )
}

export default Login
