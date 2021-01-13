import React from 'react'
import { makeQuantityArr } from '../constants'

const QuanSelect = React.forwardRef((props, ref) => (
  <>
    <select className="form-control my-3" name={`quantity-for-item-${props.id}`} id={props.id} ref={ref} onChange={props.onSelect}>
      {makeQuantityArr(Number(props.quantity)).map((option, index) => <option key={index}>{option}</option>)}
    </select>
  </>
))

export default QuanSelect