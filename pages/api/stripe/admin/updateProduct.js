const stripe = require('stripe')(process.env.STRIPE_SK)
import { quickCustomer } from '../../../../lib/helper'

export default async function (req, res) {
  const customer = await quickCustomer({req}, null)
  if (customer) {
    if (customer.metadata.admin === 'true') {
      const product = await stripe.products.update(req.body.id, req.body.product)
      if (product) {
        res.status(200).json(product)
      } else {
        res.status(500).send('Could not update Product')
      }
    } else {
      res.status(500).send('Not an admin')
    }
  } else {
    res.status(500).send('Could not gather Stripe Customer')
  }
}