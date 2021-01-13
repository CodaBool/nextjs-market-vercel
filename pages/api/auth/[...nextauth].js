import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { compare } from 'bcryptjs'
import { getCustomer }from '../../../lib/helper'

export const config = { // nextjs doc for custom config https://nextjs.org/docs/api-routes/api-middlewares#custom-config
  api: { // was getting warning that API resolved without sending a response for /api/auth/session, this may result in stalled requests.
    // following stackoverflow answer I set this config but may be dangerous since I may not always return a response
    externalResolver: true,
  },
}

export default (req, res) => {
  NextAuth(req, res, {
    providers: [
      Providers.Credentials({
        // The name to display on the sign in form (e.g. 'Sign in with...')
        name: 'Credentials',
        // The credentials is used to generate a suitable form on the sign in page.
        // You can specify whatever fields you are expecting to be submitted.
        // e.g. domain, username, password, 2FA token, etc.
        credentials: {
          email: { label: "Email", type: "email", placeholder: "Email" },
          password: { label: "Password", type: "password", placeholder: "Password" }
        },
  
        // can use throw new Error('message') to send to err.message catch block 
        authorize: async (clientData) => {
          console.log('checking session')
          try {
            const customer = await getCustomer(null, clientData.email, false)
            if (customer) {
              const validPassword = await compare(clientData.password, customer.metadata.password)
              if (validPassword) {
                return { id: customer.id, name: customer.name, email: customer.email } // complete successful login
              } else { // invalid password
                return Promise.reject('/login?error=invalid')
              }
            } else { // no account
              return Promise.reject('/login?error=invalid')
            }
          } catch (err) {
            console.log(err)
            return Promise.reject('/login?error=invalid')
          }
        },
      })
    ],
    callbacks: {
      session: async (session, user, sessionToken) => { // ran on every useSession
        if (!user.id) { // may be unecessary, not sure if this runs ever
          console.log('go to TODO(1): if you see this message')
          const customer = await getCustomer(null, user.email, true)
          if (customer) {
            if (customer.email === user.email) {
              session.id = customer.id // Add property to session
            }
          }
        }
        return Promise.resolve(session)
      },
      jwt: async (token, user, account, profile, isNewUser) => {
        if (user) {
          token.id = user.id
        }
        return Promise.resolve(token)
      }
    },
    pages: {
      signIn: '/login',
      signOut: '/logout',
      newUser: '/signup',
      error: '/login', // Error code passed in query string as ?error=
    },
    session: {
      jwt: true, 
      // Seconds - How long until an idle session expires and is no longer valid.
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    debug: true,
    secret: process.env.SECRET,
    // database: process.env.DATABASE_URL,
  })
}