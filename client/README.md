# The Next.js Frontend Server

## Technologies used

- **React.js** to enable making a powerful component based website
- **Next.js** for the ease of deployment and to have server side rendering and client rendering at the same time
- **TailwindCSS** for the styling
- **Axios** for the POST http requests
- **SWR** for data fetching, it enables

---

---

## File structure

The file structure follows the strict structure of a **Next.js** project, you can read more about it in their [documentation](https://nextjs.org/docs/getting-started) if you're interested.

---

---

## Interestings things

As the front end is not the focus of the project and it's harder to give a clear idea of how it works if you're not already familiar with **React.js** and **Next.js**, i will instead talk about some small things that make it interesting

- The use of **SWR** to fetch data.<br/>
  **SWR** is a very neat data fetching library that is derived from the HTTP cache invalidation strategy `stale-while-revalidate`.<br/>
  I used it to limit the amount of api requests by for example, limit the data revalidating to once every minute.<br/>
  In practice this means that if you go from the front page to an other page and then back to the front page in less than a minute, the front page will not revalidate it's data, but if you take an action, like upvote a post, it forces a data revalidation, so you still see things change.<br/>
  I also used it, on the front page, to do a continuous fetch of the posts, it first loads a fixed amount of the most recent posts, and when the user scrolls down to the bottom, load that much more posts, until all of the posts have been loaded.

- The use of **Next.js** to hide pages to unauthaurized users through server side rendering while still rendering on the client the pages that have no restrictions.<br/>
  **Next.js** allows the use of the function `getServerSideProps` which tells **Next.js** to render that page on the server.<br/>
  I used it to hide to unauthenticated users the pages [create.tsx](https://github.com/hugo-blanchard/reddit-clone/blob/main/client/pages/subs/create.tsx) which is the sub creation page and [submit.tsx](https://github.com/hugo-blanchard/reddit-clone/blob/main/client/pages/r/%5BsubName%5D/submit.tsx) which is the post creation page.<br/>
  You can see at the bottom of the two pages mentioned above the implementation of the `getServerSideProps` function.
