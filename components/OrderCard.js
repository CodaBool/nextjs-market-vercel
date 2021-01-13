import React, { useState, useEffect, createRef } from 'react'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import { X } from 'react-bootstrap-icons'

export default function CartCards({ intent }) {

  useEffect(() => {
  }, [])
  
  return (
    <Card className="my-3 p-3">
      <p>ID: {intent.id}</p>
      <Row>
        <Col>Total</Col>
        <Col className="text-right">$ {(intent.amount / 100).toFixed(2)}</Col>
      </Row>
      <hr />
      <Row>
        <Col>Status</Col>
        <Col className="text-right">Placeholder Shipping status</Col>
      </Row>
      <hr />
      <Row>
        <Col>Payment</Col>
        <Col className={`${intent.status === 'succeeded' ? 'text-success' : 'text-warning'} text-right`}>{intent.status}</Col>
      </Row>
      <hr />
      <Row>
        <Col>Ordered</Col>
        <Col className="text-right">{new Date(intent.created * 1000).toLocaleString('en-US')}</Col>
      </Row>
      <Card className="p-4">
        Placeholder for each product in this order
        <Button onClick={() => console.log('see product', intent.id)} variant="outline-primary" className="my-2">See product</Button>
        <Button onClick={() => console.log('review pi', intent.id)} variant="outline-primary" className="my-2">Review</Button>
      </Card>
      <Card className="p-4">
        Placeholder for each product in this order
        <Button onClick={() => console.log('see product', intent.id)} variant="outline-primary" className="my-2">See product</Button>
        <Button onClick={() => console.log('review pi', intent.id)} variant="outline-primary" className="my-2">Review</Button>
      </Card>
      <Button onClick={() => console.log('track pi', intent.id)} variant="outline-primary" className="my-2">Track</Button>
    </Card>
  )
}
