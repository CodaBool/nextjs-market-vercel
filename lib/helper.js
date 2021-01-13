const stripe = require('stripe')(process.env.STRIPE_SK)
import { parseCookies } from 'nookies'
import { parseJwt } from '../constants'
import axios from 'axios'

export function idFromReqOrCtx(req, context) {
  let cookies
  if (req) {
    cookies = parseCookies(req)
  } else {
    cookies = parseCookies(context)
  }
  if (cookies) {
    const token = cookies['__Secure-next-auth.session-token'] || cookies['next-auth.session-token']
    if (token) {
      return parseJwt(token).id
    } else {
      console.log('no session')
      return null
    }
  }
}

export async function quickCustomer(req, context) {
  let customer
  const id = await idFromReqOrCtx(req, context) // will use id if defined or will use email from session as backup
  if (id) {
    customer = await getCustomer(id, null, true)
  } else {
    customer = { err: 'no session' }
  }
  return customer
}

export function getCustomer(id, email, deletePass) { // search Stripe Customers to see if the email already exists
  console.log('got id =', id, ' | email =', email)
  if (id) {
    return stripe.customers.retrieve(id)
      .then(res => {
        if (deletePass) {
          delete res.metadata.password
        }
        return res
      })
      .catch(err => { // returns undefined
        console.log('Stripe Error', err)
      })
  } else if (email) {
    return stripe.customers.list({ limit: 2, email: email })
      .then(res => {
        if (res.data.length > 0) { // maybe email exists
          if (res.has_more === true) { // duplicate email exists, returns undefined
            Promise.reject(new Error('Duplicate Email found in Stripe Customer!')).then(() => {
              // resolve the issue here
          }, (err) => console.error(err))
          } else if (res.data[0].email === email.toLowerCase()) { // email exists
            if (deletePass) {
              delete res.data[0].metadata.password
            }
            return res.data[0]
          }
        }
      })
      .catch(err => { // returns undefined
        console.log('Stripe Error', err)
      })
  }
}

// new query method
export async function Query(q, values) {
  return await axios.get('https://pg-pool.herokuapp.com/market', 
    { params: {key: process.env.POOL_KEY, query: q, arg: values}}
  )
    .then(res => {
      return res.data // TODO: check what the res looks like for other CRUD, only checked with 
    })
    .catch(err => {
      return {err: err.message} // passes to nearest error handler
    })
}