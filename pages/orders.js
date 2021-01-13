import React from 'react'
import { Load, isLoad } from '../components/Load'
import OrderCard from '../components/OrderCard'
import { useSession, signIn } from 'next-auth/client'
import { getEmail, getId, BASE_URL } from '../constants'
import Card from 'react-bootstrap/Card'
import { idFromReqOrCtx } from '../lib/helper'
import axios from 'axios'

export async function getServerSideProps(context) {
  const id = idFromReqOrCtx(null, context)
  let intents = ['err']
  await axios.get(BASE_URL + '/api/stripe/getIntents', {params: {id}})
    .then(res => intents = res.data)
    .catch(err => console.log(err.response.data))
  return { props: { intents } }
}

export default function Orders({ intents }) {
  const [session, loading] = useSession()

  if (isLoad(session, loading, true)) return <Load />

  console.log('intents', intents)

  if (intents[0] === 'err') return (
    <h4 className="text-center my-5">
      Opps, we encountered an error getting your orders.
      <br/><br/>
      Please try again later, or contact support.
    </h4>
  )

  return (
    <>
      <h3 className="display-3 mt-5">Orders</h3>
      {intents[0] === undefined 
        ? <h4 className="text-center my-5">No orders on record</h4>
        : intents.map(intent => (
            <OrderCard intent={intent} key={intent.id}/>
          ))
      }
    </>
  )
}

