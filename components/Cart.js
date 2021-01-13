import React from 'react'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import CartCards from './CartCards'
import useScreen from './useScreen'
import { useShoppingCart } from 'use-shopping-cart'
import { useRouter } from 'next/router'
import { BagCheckFill } from 'react-bootstrap-icons'

export default function Cart() {
  const { cartDetails, formattedTotalPrice } = useShoppingCart()
  const router = useRouter()
  var size = useScreen()

  return (
    <>
      <Col className={`mx-auto ${size == 'small' || size == 'xsmall' || size == 'medium' ? 'w-100' : 'w-50'}`}>
        <CartCards isSimple={false} />
        {Object.keys(cartDetails).length > 0 &&
          <>
            <Card className="p-3">
              <Row>
                <Col><h3 className="shrink">Total</h3></Col>
                <Col className="text-right"><h3>{formattedTotalPrice}</h3></Col>
              </Row>
            </Card>
            <Row>
              <Button className="w-100 mx-3 my-5" variant="primary" onClick={() => router.push('/checkout/shipping')}>
                Checkout <BagCheckFill className="ml-2 mb-1" size={14}/>
              </Button>
            </Row>
          </>
        }
      </Col>
    </>
  )
}
