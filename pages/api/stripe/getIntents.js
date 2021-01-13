const stripe = require('stripe')(process.env.STRIPE_SK)

export default async function (req, res) {
  const paymentIntents = await stripe.paymentIntents.list({limit: 100, customer: req.query.id })
  if (paymentIntents) {
    if (paymentIntents.has_more) {
      // TODO: pagination
      res.status(500).send('Too many intents to return')
    } else {
      res.status(200).json(paymentIntents.data)
    }
  } else {
    res.status(500).send('Error, could not get payment intents')
  }
}