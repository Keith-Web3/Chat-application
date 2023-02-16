import { Link } from 'react-router-dom'

import FormTemplate from './FormTemplate'

function SignUp() {
  const footer = (
    <div className="footer">
      <p>Already a member? </p>
      <Link to="/login">Login</Link>
    </div>
  )

  return (
    <FormTemplate button="Start coding now" footer={footer} type="SIGNUP">
      <h1>Join thousands of learners from around the world </h1>
      <p>
        Master web development by making real-life projects. There are multiple
        paths for you to choose
      </p>
    </FormTemplate>
  )
}

export default SignUp
