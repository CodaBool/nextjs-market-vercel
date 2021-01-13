import { axios } from '../../../constants'

export default async function (req, res) {
  if (req.method === 'GET') {
    const params = {
      apiKey: process.env.HERE_API_KEY,
      w: 400,
      h: 400,
      z: 16, // zoom level, default 10
      t: 5, // map scheme, 5 normal, defaults to a carview, 14 for dark mode
      n: req.query.n, // house number
      s: req.query.s, // street
      ci: req.query.ci, // city
      zi: req.query.zi, // zip
      co: 'United States', // country
      maxhits: 1,
      nocp: true, // removes copyright
    }
    console.log(params)
    await axios.get('https://image.maps.ls.hereapi.com/mia/1.6/mapview', { params: params })
      .then(response => {
        res.status(200).send(response.data)
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({ statusCode: 500, message: err.message })
      })

  } else {
    res.setHeader('Allow', 'GET')
    res.status(405).end('Method Not Allowed')
  }
}

const latitude = '' // lat: ''
const longitude = '' // lon: ''