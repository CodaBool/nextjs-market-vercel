import { Query } from '../../../lib/helper'

export default async function (req, res) {
  try {
    const { body } = req
    const result = await Query(
      'INSERT INTO users(email, id, name, password, joined, updated) VALUES ($1, $2, $3, $4, $5, $6)', 
      [body.email.toLowerCase(), body.stripe_id, body.name, body.metadata.password, body.metadata.joined, body.metadata.updated]
    )
    if (result.err) {
      res.status(500).send(result.err)
    } else {
      res.status(200).json({result: result.rowCount})
    }
  } catch (err) {
    res.status(500).send('General Create User/Customer Error')
  }
}