import { getCustomer } from '../../../lib/helper'

export default async function (req, res) {
  const customer = await getCustomer(req.query.id, req.query.email, true) // will use id if defined or will use email from session as backup
  if (customer) {
    res.status(200).json(customer)
  } else {
    res.status(500).send('Error, could not get customer')
  }
}