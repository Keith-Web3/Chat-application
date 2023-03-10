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
    <FormTemplate
      button="Start coding now"
      footer={footer}
      type="EMAILANDPASSWORDSIGNUP"
    >
      <h1>Chat with thousands of people from around the world </h1>
      <p>
        Sign up today to engage in stimulating conversations with anyone,
        anywhere.
      </p>
    </FormTemplate>
  )
}

export default SignUp
