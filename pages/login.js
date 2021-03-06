import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Envelope, Key } from 'react-bootstrap-icons'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import { useRouter } from 'next/router'
import { Load, isLoad } from '../components/Load'
import { csrfToken, signIn, useSession } from 'next-auth/client'

export default function Login( { csrfToken} ) {
  const [ session, loading ] = useSession()
  const [error, setError] = useState(false)
  const { handleSubmit, errors, control, register } = useForm()
  const router = useRouter()

  useEffect(() => router.query.error && setError(true), [router.query.error])
  
  const onSubmit = (data) => {
    if (data.email && data.password && data.csrfToken) {
      const callback = router.query.callbackUrl || ''
      signIn('credentials', { email: data.email, password: data.password, callbackUrl: callback })
    }
  }
  
  if (session) {
    router.push('/')
    return <Load />
  }
  
  if (isLoad(session, loading, false)) return <Load />

  return (
    <>
      <h1 className="my-4 display-3">Login</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <input name='csrfToken' type='hidden' defaultValue={csrfToken} ref={register} />
        <Form.Group>
          <Envelope className="mr-3 mb-1" size={30}/>
          <Form.Label>Email</Form.Label>
          <Controller 
            as={<Form.Control />} 
            control={control} 
            type="email"
            name="email"
            defaultValue=""
            placeholder="name@example.com"
            required
          />
        </Form.Group>
        <Form.Group>
          <Key className="mr-3 mb-1" size={30}/>
          <Form.Label>Password</Form.Label>
          <Controller 
            as={<Form.Control />} 
            control={control} 
            type="password"
            name="password"
            placeholder="Password" 
            defaultValue=""
            required
            rules={{
              minLength: 8 // sets rule pass >= 8
            }}
          />
          {errors.password && <p className="errMsg">Your password must be at least 8 characters</p>}
        </Form.Group>
        <Row>
          {error && <h4 className="text-danger mt-4 mx-auto">Invalid Login</h4>}
          <Button className="mx-auto mt-5" style={{width: "97.3%"}} variant="primary" type="submit">Login</Button>
        </Row>
        <p className="my-5 text-center signupText" onClick={() => router.push(`/signup`)}>New Around? Signup Here.</p>
      </Form>
    </>
  )
}

export async function getServerSideProps(context) {
  return {
    props: { csrfToken: await csrfToken(context) }
  }
}