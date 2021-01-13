const stripe = require('stripe')(process.env.STRIPE_SK)

export default async function (req, res) {
  if (!req.query.id) {
    res.status(500).send('No ID provided')
  } else {
    await stripe.products.retrieve(req.query.id)
      .then(response => res.status(200).json(response))
      .catch(error => res.status(500).send(error.raw.message))
  }
}