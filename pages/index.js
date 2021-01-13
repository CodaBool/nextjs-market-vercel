import axios from 'axios'
import {useEffect} from 'react'
import { useSession } from 'next-auth/client'
import { BASE_URL } from '../constants'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export async function getServerSideProps(context) {
  const envTest = BASE_URL
  return { props: { general: envTest }}
}

export default function Index({ general }) {
  const [ session, loading ] = useSession()

  useEffect(() => {
  }, [])

  return (
    <Col className="p-4 m-2 text-center">
      <h1 className="m-5">CodaBool Marketplace</h1>
    </Col>
  )
}
