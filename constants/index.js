import { parseCookies, setCookie } from 'nookies'
import originalAxios from "axios";
import atob from 'atob'

export const CURRENCY = 'usd'
export const MIN_AMOUNT = 10.0
export const MAX_AMOUNT = 100.0
export const AMOUNT_STEP = 5.0
export const MAX_ITEMS = 200
export const PRODUCTS_PER_PAGE = 10
export const SHIPPING_COST = 7.99
export const SHIPPING_EST = '2-4 Business Days'
export const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'
export const CATEGORY = ['Apparel', 'Electronic', 'Home', 'Grocery', 'Health', 'Toys', 'Handmade', 'Sports', 'Outdoors']

export const USA_STATES = [
  'AL','AK','AS','AZ','AR','CA','CO','CT','DE','DC','FM','FL','GA',
  'GU','HI','ID','IL','IN','IA','KS','KY','LA','ME','MH','MD','MA',
  'MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND',
  'MP','OH','OK','OR','PW','PA','PR','RI','SC','SD','TN','TX','UT',
  'VT','VI','VA','WA','WV','WI','WY'
];

export function getEmail(context) {
  const cookies = parseCookies(context)
  const token = cookies['__Secure-next-auth.session-token'] || cookies['next-auth.session-token']
  if (token) {
    return parseJwt(token).email
  } else {
    return null
  }
}

export function usd(price) {
  return '$' + String(price).slice(0, -2) + "." + String(price).slice(-2)
}
export function usdPretty(price) {
  return (
    <h3 className="money">
      <span className="align-top" style={{lineHeight: '1.7em', fontSize: '0.6em'}}>$</span>
        {String(price).slice(0, -2)}
      <span className="d-inline align-top" style={{lineHeight: '1.6em', fontSize: '0.6em'}}>{String(price).slice(-2)}</span>
    </h3>
  )
}

export function getId(req) {
  if (req === 'client') {
    const cookies = parseCookies()
    return cookies['id-email']
  }
  const cookies = parseCookies(req)
  const token = cookies['__Secure-next-auth.session-token'] || cookies['next-auth.session-token']
  if (cookies['id-email']) {
    const [id, emailCookie] = cookies['id-email'].split('-')
    if (token) {
      const { email } = parseJwt(token)
      if (emailCookie === email) {
        return id
      } else { // need to reassign cookie
        console.log('mismatch')
      }
    } else {
      return null
    }
  }
}

export const axios = originalAxios.create({
  // baseURL: process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000' 
  // 'http://127.0.0.1:3000' | 'http://localhost:3000'
})

export function dateParsed(obj) {
  for (let [key, value] of Object.entries(obj)) {
    if (value !== null) {
      if (typeof value === 'object' && typeof value.getMonth === 'function') {
				value = JSON.parse(JSON.stringify(value))
      } else if (typeof value === 'object') {
        value = dateParsed(value)
      }
    }
    obj[key] = value
  }
	return obj
}

// export function isAdmin(email) {
//   console.log('isAdmin session', session.user.email)
//   // check for cookie
//   // const cookies = parseCookies()
//   // console.log()
//   // // create cookie
//   // setCookie(null, 'id-email', r.id + '-' + r.email, { // store cookie for easy Stripe api use 
//   //   path: '/',
//   //   maxAge: 30 * 24 * 60 * 60 * 12 * 5, // 5 years
//   //   sameSite: 'strict' // use httpOnly: true for added security
//   // })
//   // let match = false
//   process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(',').forEach(adminEmail => {
//     if (adminEmail === email) {
//       match = true
//     }
//   })
//   return true
// }
export function isAdmin(userEmail) {
  let match = false
  process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(',').forEach(adminEmail => {
    if (adminEmail === userEmail) {
      match = true
    }
  })
  return match
}

// export function callback(window) {
//   const urlParams = new URLSearchParams(window.location.search)
//   const result = urlParams.get('callbackUrl')
//   if (result.includes('?')) {
//     const item1 = result.split('?')[0]
//     const item2 = result.split('?')[1].split('=')[1]
//     if (item1 === '/login') {
//       return item2
//     } else if (item2 === '/login') {
//       console.error('Error, found 2 login search params:', result)
//     }
//   } else { // simple
//     console.log('simple return')
//     return result
//   }
//   return result // null when no callbackUrl
// }

export function makeShallow(cart) {
  let cartArr = []
  if (cart) {
    if (cart.includes('and')) { // multiple cart items
      cart.split('and').forEach(item => {
        cartArr.push({ id: item.split('of')[1], quantity: item.split('of')[0] })
      })
    } else { // only a single item in cart
      cartArr.push({ id: cart.split('of')[1], quantity: cart.split('of')[0] })
    }
  }
  // input [{id: 1, quantity:2}, {id:3, quantity:6}]
  let obj = {}
  cartArr.forEach(item => {
    obj = {...obj, [item.id]: item.quantity}
  })
  // output {id: quantity, id: quantity}
  return obj
}

export function setCart(box) { // sets a cookie from a box
  var cartStr = ''
  box.forEach((item, index) => {
    if (index > 0) {
      cartStr += `and${item.quantity}of${item.id}`
    } else {
      cartStr += `${item.quantity}of${item.id}`
    }
  })
  setCookie(null, 'cart', cartStr, {
    maxAge: 30 * 24 * 60 * 60,
    sameSite: 'Strict',
    path: '/',
  })
}

export function getCart() { // gets cookie returns box
  const { cart } = parseCookies()
  let box = []
  if (cart) {
    if (cart.includes('and')) { // multiple cart items
      cart.split('and').forEach(item => {
        box.push({ id: item.split('of')[1], quantity: item.split('of')[0] })
      })
    } else { // only a single item in cart
      box.push({ id: cart.split('of')[1], quantity: cart.split('of')[0] })
    }
  }
  return box
}

export function addToCart(id, quantity) { // Assumes that the id is not in the cart
  let box = getCart()
  let foundQuan = 0
  let isMax = false
  if (quantity > MAX_ITEMS) {
    quantity = MAX_ITEMS
    isMax = true
  }
  box.forEach(item => {
    if (Number(item.id) === Number(id)) {
      foundQuan = item.quantity
    }
  })
  if (foundQuan > 0) { // id already present, need to add to existing quantity
    let newQuantity = Number(foundQuan) + Number(quantity)
    if (newQuantity > MAX_ITEMS) {
      newQuantity = MAX_ITEMS
      isMax = true
    }
    editCart(id, newQuantity) // sets cart cookie inside
  } else {
    box.push({id: id, quantity: quantity})
    setCart(box)
  }
  return isMax
}

// export function getCartIds(cookie) {
//   let ids = []
//   if (cookie.includes('and')) { // multiple cart items
//     cookie.split('and').forEach(item => {
//       ids.push(item.split('of')[1])
//     })
//   } else { // only a single item in cart
//     ids.push(cookie.split('of')[1])
//   }
//   return ids
// }

export function getCartById(id) {
  let err = 'Cart with id: ' + id + ' does not exist'
  let quantity = null
  getCart().forEach(item => {
    if (Number(item.id) === Number(id)) {
      quantity = item.quantity
      err = null
    }
  })
  if (err) {
    console.error(err)
  }
  return quantity
}

export function editCart(id, quantity) {
  let err = 'Cart with id: ' + id + ' does not exist'
  let box = getCart() // get the current cart from cookies
  box.forEach(item => {
    if (Number(item.id) === Number(id)) { // update quantity
      item.quantity = quantity
      err = null
    }
  })

  // check for zeros and remove
  var indexToRemove = null
  box.forEach((item, index) => {
    if (Number(item.quantity) === 0) {
      indexToRemove = index // WARNING: could do in single line but MAY affect index being misaligned
    }
  })
  if (indexToRemove || indexToRemove === 0) {
    box.splice(indexToRemove, 1)
  }
  if (err) {
    console.error(err)
  } else {
    setCart(box)
  }
  return box
}

export function makeQuantityArr(quantity) {
  if (quantity > MAX_ITEMS) { // limit amount of items per order
    quantity = MAX_ITEMS
  }
  let quantityOptions = []
  for (let i = 1; i < quantity + 1; i++){
    quantityOptions.push(String(i))
  }
  return quantityOptions
}

// BETTER IMPLIMENTATION
// Array.from({length: 10}, (x, i) => i + 1)
export function makeArr(quantity) { // no max limit
  let quantityOptions = []
  for (let i = 1; i < quantity + 1; i++){
    quantityOptions.push(String(i))
  }
  return quantityOptions
}

export async function fetchGetJSON(url) {
  try {
    const data = await fetch(url).then((res) => res.json())
    return data
  } catch (err) {
    throw new Error(err.message)
  }
}

export function parseJwt(token) {
  var base64Url = token.split('.')[1]
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))
  return JSON.parse(jsonPayload)
}


// Get State from Zip Code
export function getState(zipString) {
  if (typeof zipString !== 'string' || zipString.length !== 5 || !zipString.match(/^[0-9]+$/)) {
    return undefined;
  }

  const zipcode = parseInt(zipString, 10); 
  let st;

  if (zipcode >= 35000 && zipcode <= 36999) {
    st = 'AL';
  } else if (zipcode >= 99500 && zipcode <= 99999) {
    st = 'AK';
  } else if (zipcode >= 85000 && zipcode <= 86999) {
    st = 'AZ';
  } else if (zipcode >= 71600 && zipcode <= 72999) {
    st = 'AR';
  } else if (zipcode >= 90000 && zipcode <= 96699) {
    st = 'CA';
  } else if (zipcode >= 80000 && zipcode <= 81999) {
    st = 'CO';
  } else if (zipcode >= 6000 && zipcode <= 6999) {
    st = 'CT';
  } else if (zipcode >= 19700 && zipcode <= 19999) {
    st = 'DE';
  } else if (zipcode >= 32000 && zipcode <= 34999) {
    st = 'FL';
  } else if (zipcode >= 30000 && zipcode <= 31999) {
    st = 'GA';
  } else if (zipcode >= 96700 && zipcode <= 96999) {
    st = 'HI';
  } else if (zipcode >= 83200 && zipcode <= 83999) {
    st = 'ID';
  } else if (zipcode >= 60000 && zipcode <= 62999) {
    st = 'IL';
  } else if (zipcode >= 46000 && zipcode <= 47999) {
    st = 'IN';
  } else if (zipcode >= 50000 && zipcode <= 52999) {
    st = 'IA';
  } else if (zipcode >= 66000 && zipcode <= 67999) {
    st = 'KS';
  } else if (zipcode >= 40000 && zipcode <= 42999) {
    st = 'KY';
  } else if (zipcode >= 70000 && zipcode <= 71599) {
    st = 'LA';
  } else if (zipcode >= 3900 && zipcode <= 4999) {
    st = 'ME';
  } else if (zipcode >= 20600 && zipcode <= 21999) {
    st = 'MD';
  } else if (zipcode >= 1000 && zipcode <= 2799) {
    st = 'MA';
  } else if (zipcode >= 48000 && zipcode <= 49999) {
    st = 'MI';
  } else if (zipcode >= 55000 && zipcode <= 56999) {
    st = 'MN';
  } else if (zipcode >= 38600 && zipcode <= 39999) {
    st = 'MS';
  } else if (zipcode >= 63000 && zipcode <= 65999) {
    st = 'MO';
  } else if (zipcode >= 59000 && zipcode <= 59999) {
    st = 'MT';
  } else if (zipcode >= 27000 && zipcode <= 28999) {
    st = 'NC';
  } else if (zipcode >= 58000 && zipcode <= 58999) {
    st = 'ND';
  } else if (zipcode >= 68000 && zipcode <= 69999) {
    st = 'NE';
  } else if (zipcode >= 88900 && zipcode <= 89999) {
    st = 'NV';
  } else if (zipcode >= 3000 && zipcode <= 3899) {
    st = 'NH';
  } else if (zipcode >= 7000 && zipcode <= 8999) {
    st = 'NJ';
  } else if (zipcode >= 87000 && zipcode <= 88499) {
    st = 'NM';
  } else if (zipcode >= 10000 && zipcode <= 14999) {
    st = 'NY';
  } else if (zipcode >= 43000 && zipcode <= 45999) {
    st = 'OH';
  } else if (zipcode >= 73000 && zipcode <= 74999) {
    st = 'OK';
  } else if (zipcode >= 97000 && zipcode <= 97999) {
    st = 'OR';
  } else if (zipcode >= 15000 && zipcode <= 19699) {
    st = 'PA';
  } else if (zipcode >= 300 && zipcode <= 999) {
    st = 'PR';
  } else if (zipcode >= 2800 && zipcode <= 2999) {
    st = 'RI';
  } else if (zipcode >= 29000 && zipcode <= 29999) {
    st = 'SC';
  } else if (zipcode >= 57000 && zipcode <= 57999) {
    st = 'SD';
  } else if (zipcode >= 37000 && zipcode <= 38599) {
    st = 'TN';
  } else if ( (zipcode >= 75000 && zipcode <= 79999) || (zipcode >= 88500 && zipcode <= 88599) ) {
    st = 'TX';
  } else if (zipcode >= 84000 && zipcode <= 84999) {
    st = 'UT';
  } else if (zipcode >= 5000 && zipcode <= 5999) {
    st = 'VT';
  } else if (zipcode >= 22000 && zipcode <= 24699) {
    st = 'VA';
  } else if (zipcode >= 20000 && zipcode <= 20599) {
    st = 'DC';
  } else if (zipcode >= 98000 && zipcode <= 99499) {
    st = 'WA';
  } else if (zipcode >= 24700 && zipcode <= 26999) {
    st = 'WV';
  } else if (zipcode >= 53000 && zipcode <= 54999) {
    st = 'WI';
  } else if (zipcode >= 82000 && zipcode <= 83199) {
    st = 'WY';
  } else {
    st = undefined;
    // console.log('No state found matching', zipcode);
  }
  return st;
}

export function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

export function genHexFromString(seed) {
  let color = ''
  color = Math.floor((Math.abs(Math.sin(seed.charCodeAt(0)) * 16777215)) % 16777215);
  color = color.toString(16);
  while (color.length < 6) {
    color = '0' + color;
  }
  return color;
}