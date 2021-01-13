const stripe = require('stripe')(process.env.STRIPE_SK)
import { SHIPPING_COST } from '../../../constants'

export default async function (req, res) {
  const cart = JSON.parse(req.query.cartDetails)
  const customer = JSON.parse(req.query.customer)
  const ids = []
  for (const id in cart) {
    ids.push(id)
  }
  const products = await stripe.products.list({ limit: 100, ids, active: true }) // starting_after: pagination, uses id
  if (products.has_more === true) {
    res.status(500).send('Past 100 product limit') // TODO: pagination
  } else {
    let total = 0, error = ''
    for (const key in cart) {
      for (const prodKey in products) {
        if (key === products[prodKey].id) {
          let tempQuan = 1
          if (products[prodKey].metadata.quantity >= cart[key].quantity) { // Check Quantity Available
            tempQuan = Number(cart[key].quantity)
          } else {
            error += 'Quantity discrepancy error ' + key + ', '
          }
          if (products[prodKey].metadata.price == cart[key].price) { // Check Price
            total += tempQuan * Number(products[prodKey].metadata.price) // add to total
          } else {
            error += 'Price discrepancy error ' + key + ', '
          }
        }
      }
    }
    total += (SHIPPING_COST * 100) // add shipping
    
    let intent = {}
  
    intent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'usd',
      customer: customer.id,
      payment_method_types: ['card'],
      receipt_email: customer.email,
      shipping: {
        address: {
          line1: customer.shipping.address.line1,
          line2: customer.shipping.address.line2,
          city: customer.shipping.address.city,
          postal_code: customer.shipping.address.postal_code,
          state: customer.shipping.address.state
        },
        name: customer.name
      }
    })
  
    if (error === '') {
      res.status(200).json(intent)
    } else {
      res.status(500).send(error)
    }
  }
}