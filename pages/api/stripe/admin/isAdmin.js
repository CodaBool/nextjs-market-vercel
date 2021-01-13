import { getId } from '../../../../constants'
import { getCustomer } from '../../../../lib/helper'

export default async function isAdmin(req) {
  const id = getId({req})
  if (id) {
    const customer = await getCustomer(id, null, true)
    if (customer) {
      if (customer.metadata.admin) {
        return true
      }
    }
  }
  return false
}