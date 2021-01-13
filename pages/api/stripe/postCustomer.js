const stripe = require('stripe')(process.env.STRIPE_SK)
import { getCustomer } from '../../../lib/helper'
import axios from 'axios'
import { BASE_URL } from '../../../constants'

export default async function (req, res) {
  try {
    let { body } = req
    const valid = await verify(body.token)
    delete body.token
    if (valid) {
      const customer = await getCustomer(null, body.email.toLowerCase(), false) // will return undefined if error occurs
      if (!customer) {
        const newCustomer = await stripe.customers.create(body)
        if (newCustomer) { // create a customer on pg
          body.stripe_id = newCustomer.id
          await axios.post(BASE_URL + '/api/pg/postUser', body) // TODO: nextjs mentioned this could be a function instead of promise
            .then(response => {
              res.status(200).json({result: response.data.result})
            })
            .catch(() => { // more info in err.response.data
              stripe.customers.del(newCustomer.id) // roll back stripe customer creation
              res.status(500).send('Cannot Create PG User')
            })
        } else {
          res.status(500).send('Cannot Create Stripe Customer')
        }
      } else {
        res.status(500).send('Duplicate Stripe Email')
      }
    } else {
      res.status(500).send('Invalid Captcha')
    }
  } catch (err) {
    res.status(500).send('General Create User/Customer Error')
  }
}

async function verify(token) {
  const { data } = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${token}`)
  const valid = data.success || false
  return valid
}