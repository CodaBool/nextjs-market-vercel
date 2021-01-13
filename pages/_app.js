import Navigation from '../components/Navigation'
import React from 'react'
import Container from 'react-bootstrap/Container'
import NavBox from '../components/UI/NavBox'
import { Provider } from 'next-auth/client'
import Head from 'next/head'

import { CartProvider } from 'use-shopping-cart'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

import '../global.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK)

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Provider session={pageProps.session}>
        <CartProvider
          stripe={stripePromise}
          mode="checkout-session"
          currency="usd"
          // allowedCountries={['US']}
          // billingAddressCollection={true}
        >
          <Elements stripe={stripePromise}>
            <Navigation />
            <Head>
              <title>E-Commerce App</title>
              <meta charSet="UTF-8" />
              <meta name="viewport" content="initial-scale=1.0, width=device-width" />
              <link rel="icon" type="image" href="/icons/favicon-16x16.gif"/>
              <link rel="icon" type="image" href="/icons/favicon-32x32.gif"/>
            </Head>
            <Container>
              <Component {...pageProps} />
              <NavBox />
            </Container>
          </Elements>
        </CartProvider>
      </Provider>
    </>
  )
}
