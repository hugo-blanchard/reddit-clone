# A simple clone of Reddit

## Where to see the deployed website ?

<s>You can access the website at http://138.68.142.169/</s>

Edit: not anymore, the cost of keeping it online was not worth it, and it's not a good representation of my skill anymore. I'll work on some much more interesting projects that i will keep online when i have the time (:

## Why was this website built ?

I made this website to put all the theory i learned about making a full stack  
website from scratch into practice.

## What technologies were used ?

### The back end

The config is at the root and the code in the [src](https://github.com/hugo-blanchard/reddit-clone/tree/main/src) folder  
it was made with :

- **TypeScript** as its language
- **Node.js** as its runtime
- **Express.js** for a routing framework
- **PostgreSQL** for the database
- **TypeOrm** as the orm to communicate with the database
- **JWT** and **BCrypt** for tokens and encryption

You can read more about it in the [src](https://github.com/hugo-blanchard/reddit-clone/tree/main/src) folder

### The front end

The config and code are in the [client](https://github.com/hugo-blanchard/reddit-clone/tree/main/client) folder  
it was made with :

- **TypeScript** as its language
- **React.js** and its framework **Next.js** to make a powerful component based<br/>
  website with both serverside rendering and client rendering based on what the page needs
- **SWR** and **Axios** for the data fetching
- **Tailwind** for the styling

### The deployment

I deployed the site through ssh on an **Ubuntu** VPS (at **DigitalOcean**) and served it with **Nginx**
