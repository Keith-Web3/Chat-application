import React, { ReactNode, MouseEvent } from 'react'
import './button.scss'

const Button: React.FC<{ children: ReactNode }> = function ({ children }) {
  const mouseDownHandler = function (e: MouseEvent<HTMLButtonElement>) {
    let positionX = e.nativeEvent.offsetX
    let positionY = e.nativeEvent.offsetY

    ;(e.target as HTMLButtonElement).style.setProperty('--x', positionX + 'px')
    ;(e.target as HTMLButtonElement).style.setProperty('--y', positionY + 'px')

    ;(e.target as HTMLButtonElement).classList.add('pulse')
  }

  return (
    <button
      className="button"
      onMouseDown={mouseDownHandler}
      onAnimationEnd={e =>
        (e.target as HTMLButtonElement).classList.remove('pulse')
      }
    >
      {children}
    </button>
  )
}

export default Button
