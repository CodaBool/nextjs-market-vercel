/* Saving Emoji with a save button, this only allows for the save icon
to show if the button was not pressed in the last 4 seconds
this is with the use of timeouts to lock out the state change.
There is also className being used to conditionally set class based
on state */
import React, { useRef, useState } from 'react'

var saving = false

export default function SaveIcon() {
  const [visible, setVisible] = useState(false)
  const savingIcon = useRef(null)
  
  function fadeSave() {
    if (!saving) {
      saving = true
      setVisible((prev) => !prev)
      setTimeout(() => { setVisible((prev) => !prev) }, 2000)
      setTimeout(() => { saving = false }, 4000)
    }
  }

  return (
    <>
      <button onClick={fadeSave}>Save</button>
      <div ref={savingIcon} className={`${visible ? 'fadeIn' : 'fadeOut'}`}>
        <span role="img" aria-label="Floppy Disk">💾</span>
      </div>
    </>
  )
}
