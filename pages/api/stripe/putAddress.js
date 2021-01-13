const stripe = require('stripe')(process.env.STRIPE_SK)
import axios from 'axios'
import { BASE_URL } from '../../../constants'

export default async function (req, res) {
  const updatedCustomer = await stripe.customers.update(req.body.customer.id, {shipping: req.body.shipData})
  if (updatedCustomer) {
    await axios.post(BASE_URL + '/api/pg/putAddress', req.body)
      .then(response => { // expect response.data.result.rowCount === 1
        console.log('inserted', response.data.result.rowCount, 'row into address')
        res.status(200).json(updatedCustomer)
      })
      .catch(err => {
        console.log(err.response.data)
        res.status(500).send('Cannot Create PG User')
      })

  } else {
    res.status(500).send('Error, could not get customer')
  }
}