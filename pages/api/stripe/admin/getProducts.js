/* TODO: For large product lines with over ~80 active products.
A pagination which does 2 requests will be required.
If requested page is > 10, store last id of first request,
and make new request with starting_after parameter (can place stripe req in a while loop) */
const stripe = require('stripe')(process.env.STRIPE_SK)
import { PRODUCTS_PER_PAGE } from '../../../../constants'

export default async function (req, res) {
  const config = {limit: 100, active: req.query.filterInactive}
  const products = await stripe.products.list(config) // starting_after: pagination, uses id
  if (products.has_more === true) {
    // TODO: pagination
    res.status(500).send('Past 100 product limit')
  } else {
    const pages = Math.ceil(products.data.length / PRODUCTS_PER_PAGE) || 1
    res.status(200).json({products: products.data, pages})
  }
}