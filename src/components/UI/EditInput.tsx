import React from 'react'
import { useId } from 'react'

import '../../sass/UI/edit-input.scss'

function EditInput({ name, placeholder, type }, ref) {
  const id = useId()

  return (
    <label htmlFor={id} className="edit-input">
      {name}
      {name !== 'Bio' ? (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          id={id}
          ref={ref}
          minLength={type === 'password' ? 6 : 0}
        />
      ) : (
        <textarea name={name} placeholder={placeholder} ref={ref}></textarea>
      )}
    </label>
  )
}

export default React.forwardRef(EditInput)
