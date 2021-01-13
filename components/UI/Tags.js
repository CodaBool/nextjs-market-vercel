import React from 'react'
import Badge from 'react-bootstrap/Badge'

export default function Tags({ tags, size }) {

  if (!tags) {
    return null
  }
  
  function handleClick(e) {
    console.log('clicked on', e.target.innerHTML, 'tag')
  }

  if (size === 'lg') {
    return (
      <>
        {tags.split(',').map((tag, index) => (
          <Badge pill variant="secondary" className="mr-2 py-0" key={index} onClick={handleClick}>
            <h6>{tag}</h6>
          </Badge>
        ))}
      </>
    )
  }

  if (size === 'sm' || !size) {
    return (
      <>
        {tags.split(',').map((tag, index) => (
          <Badge pill variant="secondary" className="mr-2 py-1" key={index} onClick={handleClick}>
            {tag}
          </Badge>
        ))}
      </>
    )
  }
}
