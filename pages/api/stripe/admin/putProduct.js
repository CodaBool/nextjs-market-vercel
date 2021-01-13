const stripe = require('stripe')(process.env.STRIPE_SK)
import { quickCustomer } from '../../../../lib/helper'

export default async function (req, res) {
  const customer = await quickCustomer({req}, null)
  if (customer) {
    if (customer.metadata.admin === 'true') {
      let metadata = {} // only update relevant data
      if (req.body.metadata.quantity) {
        metadata.quantity =  req.body.metadata.quantity
      } if (req.body.metadata.price) {
        metadata.price = req.body.metadata.price
      } if (req.body.metadata.currency) {
        metadata.currency = req.body.metadata.currency
      } if (req.body.metadata.categories.length > 0) {
        metadata.categories = req.body.metadata.categories
      }

      let productObj = {}
      if (req.body.type) {
        productObj.type = req.body.type
      } if (req.body.active) {
        productObj.active = req.body.active
      } if (req.body.description) {
        productObj.description = req.body.description
      } if  (req.body.description) {
        productObj.description = req.body.description
      } 
      productObj.metadata = metadata
      productObj.name = req.body.name

      const product = await stripe.products.create(productObj)
      if (product) {
        res.status(200).json(product)
      } else {
        res.status(500).send('Not an admin')
      }
    } else {
      res.status(500).send('Not an admin')
    }
  } else {
    res.status(500).send('Could not gather Stripe Customer')
  }
}