import { buffer } from 'micro'
import Cors from 'micro-cors' // Nextjs API routes are same-origin only this will allow Stripe webhook event requests
import Stripe from 'stripe'
// import { Query } from '../../../lib/helper'
import { format } from 'timeago.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});
const webhookSecret = process.env.STRIPE_WH

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
}

/* List of events unhandled
- product.updated
- product.deleted
- product.updated
- sku.created */

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
})

const webhookHandler = async (req, res) => {
  if (req.method === 'POST') {
    const buf = await buffer(req)
    const sig = req.headers['stripe-signature']



    let event

    try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret)
    } catch (err) {
      // On error, log and return the error message.
      console.log(`❌ Error message: ${err.message}`)
      res.status(400).send(`Webhook Error: ${err.message}`)
      return
    }

    // Successfully constructed event.
    console.log('✅ Success:', event.id, '| Type:', event.type)

    // Cast event data to Stripe object.
    if (event.type === 'payment_intent.succeeded') {

      const paymentIntent = event.data.object
      
      // const str = JSON.stringify(paymentIntent, null, 4)
      // console.log(str)

      console.log(`\n==== Form of ID ===`)
      console.log('id:', paymentIntent.id)
      console.log('payment_method:', paymentIntent.payment_method)
      console.log('client_secret:', paymentIntent.client_secret)
      if (paymentIntent.payment_method_details) {
        console.log('card fingerprint:', paymentIntent.payment_method_details.card.fingerprint)
      }
      console.log(`\n==== To tell if there is a problem ===`)
      console.log('status:', paymentIntent.status)
      console.log(`\n==== Basic Info / Receipt ===`)
      console.log('amount:', paymentIntent.amount)
      console.log('application_fee_amount:', paymentIntent.application_fee_amount)
      console.log('amount_received:', paymentIntent.amount_received)
      console.log('created:', format(new Date(paymentIntent.created * 1000)))
      console.log('currency:', paymentIntent.currency)
      console.log('description:', paymentIntent.description)
      console.log('receipt_email:', paymentIntent.receipt_email)
      console.log(`\n==== Shipping ===`)
      for (const key in paymentIntent.shipping) {
        console.log(key, paymentIntent.shipping[key])
      }
      console.log(`\n==== Billing ===`)
      for (const key in paymentIntent.billing_details) {
        console.log(key, paymentIntent.billing_details[key])
      }
      console.log(`\n==== Customer ===`)
      for (const key in paymentIntent.customer) {
        console.log(key, paymentIntent.customer[key])
      }
      console.log(`\n==== Metadata ===`)
      for (const key in paymentIntent.metadata) {
        console.log(key, paymentIntent.metadata[key])
      }

      console.log(`\n==== Payment Method Card ===`)
      for (const key in paymentIntent.payment_method_options.card) {
        console.log(key, paymentIntent.metadata[key])
      }
      
      
      console.log(`\n==== Formatted ===\n`)
      // console.log(`BUILD DIFFERENTLY: ${paymentIntent.billing_details}`)

      // const { body } = req
      // await db('UPDATE users SET ad_line1=$1, ad_line2=$2, zip=$3, city=$4, state=$5 WHERE email = $6', 
      //   [body.line1, body.line2, body.zip, body.city, body.state, body.email])
      //   .then(res => {
      //     send.status(200).json({updated: res.rowCount})
      //   })
      //   .catch(err => {
      //     send.status(500).send('Save Address Error')
      //   })

    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object
      console.log(
        `❌ Payment failed: ${paymentIntent.last_payment_error?.message}`
      )
    } else if (event.type === 'charge.succeeded') {
      const charge = event.data.object
      
      // console.log('\nFull form\n')
      // for (const key in charge) {
      //   console.log(key, charge[key])
      // }

      console.log(`\n==== Form of ID ===`)
      console.log('id:', charge.id)
      console.log('payment_intent:', charge.payment_intent)
      console.log('payment_method:', charge.payment_method)
      console.log('card fingerprint:', charge.payment_method_details.card.fingerprint)
      console.log('balance_transaction:', charge.balance_transaction)
      console.log('receipt_number:', charge.receipt_number)
      console.log('customer:', charge.customer)
      console.log(`\n==== To tell if there is a problem ===`)
      console.log('captured:', charge.captured)
      console.log('disputed:', charge.disputed)
      console.log('paid:', charge.paid)
      console.log('refunded:', charge.refunded)
      console.log('network_status:', charge.outcome.network_status)
      console.log('seller_message:', charge.outcome.seller_message)
      console.log('livemode:', charge.livemode)
      console.log('outcome.risk_level:', charge.outcome.risk_level)
      console.log('outcome.risk_score:', charge.outcome.risk_score)
      console.log(`\n==== Basic Info / Receipt ===`)
      console.log('amount:', charge.amount)
      console.log('application_fee_amount:', charge.application_fee_amount)
      console.log('amount_captured:', charge.amount_captured)
      console.log('amount_refunded:', charge.amount_refunded)
      console.log('created:', format(new Date(charge.created * 1000)))
      console.log('currency:', charge.currency)
      console.log('failure_code:', charge.failure_code)
      console.log('failure_message:', charge.failure_message)
      console.log('description:', charge.description)
      console.log('payment_method_details.card.brand:', charge.payment_method_details.card.brand)
      console.log('payment_method_details.card.last4:', charge.payment_method_details.card.last4)
      console.log('receipt_email:', charge.receipt_email)
      console.log('receipt_email:', charge.receipt_email)
      console.log(`\n==== Shipping ===`)
      for (const key in charge.shipping) {
        console.log(key, charge.shipping[key])
      }
      console.log(`\n==== Billing ===`)
      for (const key in charge.billing_details) {
        console.log(key, charge.billing_details[key])
      }
      console.log(`\n==== Customer ===`)
      for (const key in charge.customer) {
        console.log(key, charge.customer[key])
      }
      console.log(`\n==== Metadata ===`)
      for (const key in charge.metadata) {
        console.log(key, charge.metadata[key])
      }
      
      
      console.log(`\n==== Formatted ===\n`)
      console.log(`BUILD DIFFERENTLY: ${charge.billing_details}`)
      // name is shipping

      /* Useful shit
      // email can be the db link from orders and users
      id
      amount_captured
      created (date)
      currency
      balance_transaction (id)
      billing_details (billing_details.address, billing_details.email) // can have a phone
      captured (bool)
      disputed (bool)
      livemode (bool)
      refunded (bool)
      paid (bool)
      source {
        brand
        last4
      } */
    } else if (event.type === 'payment_intent.created') {
      const paymentIntent = event.data.object
      console.log(`trying to pull payment_intent, general for now: ${paymentIntent}`)
      console.log(`payment_intent.created status: ${paymentIntent.status}`)
    } else {
      console.warn(`Unhandled event type: ${event.type}`)
    }
    // Return a response to acknowledge receipt of the event.
    res.json({ received: true })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default cors(webhookHandler)

// could use paymentIntent.charges for charges over 100 charge minimum amount to confirm. Then charge rest dependent on success
/*
= nulls = with user data in pg, manual checkout not using cli
receipt_number
application_fee_amount
failure_code
failure_message
description
*/