import React, { useState, useEffect }  from 'react'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Accordion from 'react-bootstrap/Accordion'
import Popover from 'react-bootstrap/Popover'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { CreditCard, BagCheckFill, PlusCircle, InfoCircle, HandIndexThumb } from 'react-bootstrap-icons'
import { useRouter } from 'next/router'
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement} from '@stripe/react-stripe-js'
import { useForm } from 'react-hook-form'
import { axios, SHIPPING_COST, getState } from '../constants'
import { useShoppingCart } from 'use-shopping-cart'
import Image from 'next/image'

const popover = (
  <Popover>
    <Popover.Title as="h3">The CVC is the 3 digit number usually located on the back of the card.</Popover.Title>
    <Popover.Content>
      <Image src="/image/cvc.png" width={260} height={150} layout="responsive" alt="cvc" />
    </Popover.Content>
  </Popover>
)
const popoverStripe = (
  <Popover>
    <Popover.Title as="h3">Stripe is a trusted payment service.</Popover.Title>
    <Popover.Content>
      To ensure security we complete checkouts with Stripe. Card information is never stored and will be handled directly by Stripe. 90% of Americans have bought from businesses using Stripe such as Amazon, Google, Lyft and Zoom. 
    </Popover.Content>
  </Popover>
)

export default function PaymentForm({ size, setPrice, setError, customer, session, setLoadMsg, scroll }) {
  const { cartDetails, totalPrice } = useShoppingCart()
  const { handleSubmit, watch, errors, register, control, getValues, setValue, formState, trigger } = useForm()
  const stripe = useStripe()
  const router = useRouter()
  const elements = useElements()  
  const cardNum = elements.getElement(CardNumberElement)
  const cardExp = elements.getElement(CardExpiryElement)
  const cardCvc = elements.getElement(CardCvcElement)
  const [numComplete, setNumComplete] = useState(false)
  const [expComplete, setExpComplete] = useState(false)
  const [cvcComplete, setCvcComplete] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const total = '$ ' + ((totalPrice + (SHIPPING_COST * 100)) / 100).toFixed(2)
  
  useEffect(() => setPrice(total), [])
  useEffect(() => autoFillState(watch('zip')), [watch])
  useEffect(() => {
    if (numComplete && expComplete && cvcComplete) {
      setPaymentComplete(true)
    } else {
      setPaymentComplete(false)
    }
  }, [numComplete, expComplete, cvcComplete])

  const onSubmit = async (data) => {
    let intent = {}
    scroll()
    setLoadMsg('Creating Order')
    await axios.get('/api/stripe/validateCart', { params: {cartDetails:cartDetails, customer:customer }})
      .then(res => {
        intent = res.data
      })
      .catch(err => {
        console.log(err)
        console.log(err.response.data)
        setError('Server Error, please try again later or contact support')
      })

    let status = ''
    if (Object.keys(intent).length > 0) {
      try {
        setLoadMsg('Finalizing Order')
        await stripe.confirmCardPayment(intent.client_secret, {
          payment_method: {
            card: elements.getElement(CardNumberElement)
          }})
          .then(res => {
            status = res.paymentIntent.status
          })
          .catch(err => {
            console.log(err)
          })
      } catch (err) {
        console.log(err.message)
      }
    }
    if (status == 'succeeded') {
      setLoadMsg('Order Successful')
      router.push({
        pathname: '/checkout/confirmed',
        query: { payment_intent: intent.id },
      })
    }
  }
  
  function checkPay() {
    if (cardNum) setTimeout(() => {
      if (cardNum._complete) {
        setNumComplete(true)
      } else {
        setNumComplete(false)
      }
    }, 0)
    if (cardExp) setTimeout(() => {
      if (cardExp._complete) {
        setExpComplete(true)
      } else {
        setExpComplete(false)
      }
    }, 0)
    if (cardCvc) setTimeout(() => {
      if (cardCvc._complete) {
        setCvcComplete(true)
      } else {
        setCvcComplete(false)
      }
    }, 0)
  }

  function autoFillState(zip) {
    const state = getState(zip)
    if (state !== undefined) {
      setValue('state', state)
    }
  }

  return <Form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
    <Accordion>
      <Card>
        <Accordion.Toggle as={Card.Header}>
          Payment<CreditCard style={{marginLeft: '20px', marginBottom: '4px'}} size={28}/>
        </Accordion.Toggle>
        <Accordion.Collapse className="show">
          <Card.Body className="pt-0">
          <Form.Label>Card Number</Form.Label>
          <Form.Group className="border group">
            <CardNumberElement onChange={checkPay} />
          </Form.Group>
          {size === 'xsmall'
            ?
              <>
                <Form.Label>Expiration</Form.Label>
                <Form.Group className="group border">
                  <CardExpiryElement onChange={checkPay} />
                </Form.Group>
                <Form.Label>CVC</Form.Label>
                <Form.Group className="group border">
                  <CardCvcElement onChange={checkPay} />
                </Form.Group>
                <OverlayTrigger trigger="click" overlay={popover}>
                  <p className="text-info"><InfoCircle style={{marginRight: '10px', marginBottom: '4px'}} size={15}/>What's CVC?</p>
                </OverlayTrigger>
                
              </>
            :
              <Row>
                <Col>
                  <Form.Label>Expiration</Form.Label>
                  <Form.Group className="group border">
                    <CardExpiryElement onChange={checkPay} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Label>CVC</Form.Label>
                  <Form.Group className="group border">
                    <CardCvcElement onChange={checkPay} />
                  </Form.Group>
                  <OverlayTrigger trigger="click" overlay={popover}>
                    <p className="text-info"><InfoCircle style={{marginRight: '10px', marginBottom: '4px'}} size={15}/>What's CVC?</p>
                  </OverlayTrigger>
                </Col>
              </Row>
          }
            <OverlayTrigger trigger={['hover', 'focus']} overlay={popoverStripe} >
              <Row>
                <div className="mx-auto d-block">
                  <Image src="/image/poweredByStripe.jpg" className="rounded" width={140} height={40} alt="stripe" />
                </div>
              </Row>
            </OverlayTrigger>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
    {paymentComplete && 
      <Row>
        <Button className="mx-auto mt-5" disabled={!stripe} style={{width: "95%"}} variant="primary" type="submit">Complete Order 
          <BagCheckFill className="ml-2" size={14}/>
        </Button>
      </Row>
    }
  </Form>
}