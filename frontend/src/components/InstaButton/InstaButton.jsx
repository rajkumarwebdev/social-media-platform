import React from 'react'
import "./instabutton.css"
function InstaButton({actionText,backgroundColor,onClick
}) {
  return (
      <button onClick={ onClick} className={`instabutton ${backgroundColor}`}>{actionText}</button>
  )
}

export default InstaButton