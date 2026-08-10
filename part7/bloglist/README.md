# BlogList

The BlogList frontend and backend live in the same repository while retaining
their own dependencies and `package.json` files.

## Setup

Install dependencies in all three directories:

```sh
npm install
npm install --prefix client
npm install --prefix server
```

Create `server/.env` from `server/.env.example` and add the MongoDB connection
strings and JWT secret.

## Development

Run both the Express API and Vite development server from the repository root:

```sh
npm run dev
```

The frontend can also be started independently with `npm run dev` inside
`client`. Vite proxies `/api` requests to Express on port 3001.

## Production

Build the frontend and start the backend from the repository root:

```sh
npm run build
npm start
```

Express serves the generated `client/dist` files and the API from the same
port.
