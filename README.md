> [!WARNING]  
> This repository has been archived as of January 11, 2024 and will not be further maintained. If you are curious about this repo and looking for help, please join our Discord https://clerk.com/discord



# Clerk Authentication at the edge

This demo features authentication at the edge using [Clerk](https://clerk.dev/?utm_source=github&utm_medium=demo&utm_campaign=clerk-edge).

## Demo

[https://edge.clerk.app/](https://edge.clerk.app/?utm_source=github&utm_medium=repo&utm_campaign=demo-link)

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fclerkinc%2Fedge-demo&env=NEXT_PUBLIC_CLERK_FRONTEND_API,CLERK_API_KEY,CLERK_JWT_KEY&project-name=clerk-authentication&repo-name=clerk-authentication)

## Getting Started

You'll need to have an account with [Clerk](https://clerk.dev/?utm_source=github&utm_medium=demo&utm_campaign=clerk-edge). Once that's done, copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
```

Then open `.env.local` and set the environment variables to match the settings of your Clerk application. It should look something like this (replace the values with your own Clerk's dashboard):

```bash
NEXT_PUBLIC_CLERK_FRONTEND_API=foo.bar.lcl.dev
CLERK_API_KEY=test_lcyh0EbavaYPZBnyUbRBGtSo1dELNxJSLC
CLERK_JWT_KEY=YOUR_CLERK_JWT_KEY_GOES_HERE
```

Next, run Next.js in development mode:

```bash
npm install
npm run dev

# or

yarn
yarn dev
```
