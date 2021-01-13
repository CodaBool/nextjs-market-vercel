# Major Tasks
- accounts page
- webhook orders page
- Password resets by email
- cleanup endpoints, make them modular
- allow for different billing and shipping addresses

# Minor Tasks
- search bar
- remove all cookies on logout
- prevent signup double click
- fix dropdown bug
- find graceful handle of errors without page reload, this allows login modals
- create ui for checkout progress (1-3 bubbles)
- see if webhooks work after removing buffer
- Confirm using Idempotent stripe security with uuid
- create a product limit per customer, alert them that they reach it
- admin page fade in messages about how to select multiple after dirty
- admin page error handling
- enable saving old address
- fix callbacks they can be grabbed from the router and used with `` to inject into signin object
- make account editing page
- make 255 char limit on signup form
- can use custom loading component https://nextjs.org/docs/advanced-features/dynamic-import#with-custom-loading-component
- bugtest all routes for failure points
  - check if case matters for email

## Ideas from BigCommerce
- UI folder inside components (good for dumb components)
- sort on the right
- categories on left
- items label gets random color on hover

- cart top right, account
- cart has icon for number of items
  
- cart as a modal
- can add/remove items in modal
- show total
- login as a modal
- signup as modal after click through login

# CLI
heroku pg:killall -a e-commerce-draft
heroku pg:info -a e-commerce-draft

# PSQL

drop table users CASCADE; drop table address CASCADE; drop table orders CASCADE;
UPDATE users SET admin=true WHERE id=1;
INSERT INTO address(stripe_id, name, line1, line2, postal_code, city, country, state, phone) VALUES ('cus_IUzmfGYBDEX81N', 'new around', '1 big meaty', 'claws', '82343', 'ornasd', 'US', 'WY', '');
INSERT INTO users(email, id, name, password, joined, updated) VALUES ('d@d.com', 'cus_IUzmfGYBDEX81N','dd', 'pass', current_timestamp, current_timestamp);
create table users (
   id    varchar(255)             not null     ,
   email        varchar(255)             not null     ,
   name         varchar(255)             not null     ,
   password     varchar(255)             not null     ,
   active       bool                     default true ,
   admin        bool                     default false,
   joined       timestamp with time zone not null     ,
   updated      timestamp with time zone not null     ,
   UNIQUE(email)                                      ,
   PRIMARY KEY(id)
);
create table address (
   address_id  serial                     not null    ,
   user_id   varchar(255)               not null    ,
   name        varchar(255)                           ,
   line1       varchar(255)                           ,
   line2       varchar(255)                           ,
   postal_code int                                    ,
   city        varchar(100)                           ,
   country     varchar(2)                             ,
   state       varchar(2)                             ,
   phone       varchar(15)                            ,
   PRIMARY KEY(address_id)                            ,
   CONSTRAINT fk_user_address
      FOREIGN KEY (user_id) 
         REFERENCES users(id)
);
create table orders (
   order_id    serial                   not null      ,
   intent_id   varchar(255)             not null      ,
   user_id   varchar(255)                           ,
   amount      int                                    ,
   inserted_at timestamp with time zone not null      ,
   updated_at  timestamp with time zone not null      ,
   PRIMARY KEY(order_id)                              ,
   CONSTRAINT fk_user_orders
      FOREIGN KEY (user_id) 
         REFERENCES users(id)
);

# Stripe
Success=4242 4242 4242 4242
auth_required=4000 0025 0000 3155
declined=4000 0000 0000 9995

## resources
Webhooks https://stripe.com/docs/webhooks/test
https://www.youtube.com/watch?time_continue=2&v=sPUSu19tZHg&feature=emb_title
https://stripe.com/docs/payments/accept-a-payment?integration=elements
https://stripe.com/docs/js/elements_object/create#stripe_elements-options
https://vercel.com/guides/getting-started-with-nextjs-typescript-stripe

# Operation switch to Stripe Customer API
## auth flow
get customer from stripe using id-email 
=== no id-email ===> 
get id-email and store in cookie (could store in db at this point for record keeping)
=== OPTIONAL stripe not working ===>
use personal db as backup

# Load testing

## Pool
- 224ms
- only handle 75 api calls per second

# the important issue
- pool.connect() builds too many connections, pool and heroku mismatched number of connections "too many connections for role ryuxliualerkrm"

# Backend Notes
## GET
{params} => req.query
## POST
body => req.body

# Deploy to Heroku
- change to custom server
- change package.json
- add heroku env vars