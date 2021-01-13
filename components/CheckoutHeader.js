import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons'

export default function CheckoutHeader({ page }) {
  return (
    <Row className="my-4">
      <Col xs={1} >
        <ChevronLeft onClick={() => console.log('move back')} style={{cursor: 'pointer', marginTop: '17px'}} size={45}/>
      </Col>
      <Col className="text-center">
        <h1 className="display-3">{page}</h1>
      </Col>
      <Col xs={1} >
        <ChevronRight onClick={() => console.log('move forward')} style={{cursor: 'pointer', marginTop: '17px'}} size={45}/>
      </Col>
    </Row>
  )
}
