# The Node.js Backend Server

## Technologies used

- **Node.js** and **Express.js** take care of the routing
- **TypeOrm** takes care of the database communication (in this case with a **Postgres** DB)

---

---

## Quick description of the file structure

- **server.ts** is the runtime where everything is aggregated
- **entities** folder holds the **TypeOrm** entities
- **middleware** folder holds middleswares that are used in the routes located in the **routes** folder
- **migrations** folder holds the **TypeOrm** database migrations
- **routes** folder holds **Express.js** routes
- **util** holds anything else utility related

---

---

## Example of how a request would be treated

### If the user wants to log in

He will send a POST request to the server at /api/auth/login with of a body of, for example :

```
{
	"username": "test",
	"password": "123456"
}
```

It will directly go into the login route in [auth.ts](https://github.com/hugo-blanchard/reddit-clone/blob/main/src/routes/auth.ts) at the line 54 which will :

- firstly, validate the data and send an error if they are not string and/or are empty

- then by using the **TypeOrm** entity **User** which is located in [/entities/user](https://github.com/hugo-blanchard/reddit-clone/blob/main/src/entities/User.ts) it will search if a user of that name exists in the database and send an error if there isn't

- then through the use of **Bcrypt** it will compare the encripted password stored in the database and the one in the request and send an error if it doesn't match

- if it reaches that point, it means the credentials are correct, so the server will create a cookie of the username (_because it is unique_) with the use of **JWT** and send it back to the client, see below for an example of the /me route to see how the server will handle that **JWT** login

---

### If the user is already logged in and does an action that requires authentification

For this example he will send a POST request to /api/subs to create a new sub (_a new community on the reddit clone_) with a body of :

```
{
	"name": "test",
	"title": "Test",
	"description": "A test community"
}
```

_note that in this example, the user is already logged in so he has a token stored which will be sent in the header of the request_

The server will first pass that request to the **user** middleware which is located in [/middleware/user.ts](https://github.com/hugo-blanchard/reddit-clone/blob/main/src/middleware/user.ts), then to the **auth** middleware, located in [/middleware/auth.ts](https://github.com/hugo-blanchard/reddit-clone/blob/main/src/middleware/auth.ts), and finally to the **createSub** route at [/routes/subs.ts](https://github.com/hugo-blanchard/reddit-clone/blob/main/src/routes/subs.ts) on line 52

So first, the [user](https://github.com/hugo-blanchard/reddit-clone/blob/main/src/middleware/user.ts) middleware will :

- check if there is a token in the request, if not, return the execution of the `next` callback, which in this case is the **auth** middleware

- use **JWT** to decrypt the token

- try to find a user in the database that corresponds to the token, if there is one, add its data to res.locals.user (\*adding to res.locals is an efficient way to communicate data for middlewares in **Express.js\***)

- return the execution of the `next` callback

Then the [auth](https://github.com/hugo-blanchard/reddit-clone/blob/main/src/middleware/auth.ts) middleware will :

- check if res.locals.user exist, effectively checking if the **user** middleware managed to find a user that matches the potential token, if not respond to the request with an "Unauthenticated" error

- if this point is reached, the token had to be correct, so the `next` callback execution is returned (_which here is the createSub route_)

So the [createSub](https://github.com/hugo-blanchard/reddit-clone/blob/main/src/routes/subs.ts) (_line 52_) route has been reached, it will :

- validate if the data and if the sub doesn't already exist, otherwise respond with the corresponding error

- create a sub with the data

- respond to the request with the newly created sub

---

---

## If it was a real website to be used by real users i would :

- Split the tokens into two tokens, one short which would be an id that the server uses to keep track of valid tokens and revoke them at any time, and a long token to be used like in the examples above

- I might, since token management would be stateful because of the above, also store the ip of the client in the token table so that only one ip can use a token

- I would mask any way for the client to know if the username corresponds to a user in the database or not when a login request with wrong credentials is sent

- I would split the username into two, one unique and hidden to other users that is used only for login purposes and one, unique or not, that other users can see (_the login username could be the email address_)
