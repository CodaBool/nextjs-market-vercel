import { useRouter } from 'next/router'

export default function Search() {
  const router = useRouter()
  const { pid, terms } = router.query

  // example post req
  // /browse/search?terms=example+search+sentence
  return (
    <>
      <p>Search: {pid}</p>
      <p>Terms: {terms}</p>
    </>
  )
}
