import { Query } from '../../../lib/helper'

export default async function (req, res) {
  try {
    const { body } = req
    let result = {}
    const count = await Query("SELECT FROM address WHERE user_id = $1", [body.customer.id])
    if (count.rowCount > 0) { // updating old address row
      console.log('updating old address row')
      result = await Query(
        "UPDATE address SET name=$1, line1=$2, line2=$3, postal_code=$4, city=$5, country=$6, state=$7, phone=$8 WHERE user_id = $9",
        [
          body.shipData.name,
          body.shipData.address.line1,
          body.shipData.address.line2,
          body.shipData.address.postal_code,
          body.shipData.address.city,
          "US",
          body.shipData.address.state,
          body.shipData.phone,
          body.customer.id
        ]
      )
    } else { // insert new row
      console.log('inserting new address row')
      result = await Query(
        "INSERT INTO address(user_id, name, line1, line2, postal_code, city, country, state, phone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
        [
          body.customer.id,
          body.shipData.name,
          body.shipData.address.line1,
          body.shipData.address.line2,
          body.shipData.address.postal_code,
          body.shipData.address.city,
          "US",
          body.shipData.address.state,
          body.shipData.phone,
        ]
      )
    }
    
    if (result.err) {
      res.status(500).send(result.err)
    } else if (Object.keys(result).length > 0) {
      res.status(200).json({result})
    } else {
      res.status(500).send("General Create User/Customer Error")
    }
  } catch (err) {
    res.status(500).send("General Create User/Customer Error")
  }
}