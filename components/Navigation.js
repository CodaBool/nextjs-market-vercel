import React, { useRef } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Link from 'next/link'
import { useSession } from 'next-auth/client'
import { isAdmin } from '../constants'

export default function Navigation() {
  const [ session, loading ] = useSession()
  const searchInput = useRef(null)

  function handleSubmit(e) {
    e.preventDefault()
    alert('searched with terms', searchInput.current.value)
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Link href="/">
        <Navbar.Brand className="mr-5">Home</Navbar.Brand>
      </Link>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/browse/1">
            <div className="mr-3 nav-link">Browse</div>
          </Nav.Link>
          {/* TODO: Look into encodeURIComponent to keep the path utf-8 compatible before production */}
          <Form inline>
            <FormControl type="text" placeholder="Search" ref={searchInput} className="mr-2" />
            <Button variant="outline-success" type="submit" onSubmit={handleSubmit}>Search</Button>
          </Form>
        </Nav>
        <Nav>
          {session
            ?
              <>
                {isAdmin(session.user.email) && 
                  <NavDropdown title="Admin" id="collasible-nav-dropdown" className="mr-2">
                    <Link href="/admin">
                      <div className="dropdown-item">Stripe</div>
                    </Link>
                  </NavDropdown>
                }
                <Link href="/checkout/cart">
                  <div className="mr-3 nav-link">Cart</div>
                </Link>
                <Link href="/orders">
                  <div className="mr-3 nav-link">My Orders</div>
                </Link>
                <Link href="/account">
                  <div className="mr-3 nav-link">Account</div>
                </Link>
                <Link href="/logout">
                  <div className="mr-3 nav-link">Logout</div>
                </Link>
              </>
            : <Link href="/login">
                <div className="mr-3 nav-link">Login</div>
              </Link>
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}