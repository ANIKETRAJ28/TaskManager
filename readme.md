# Project Setup

## Client

- Install dependencies
  ```bash
  cd client
  npm install
  ```
- Create `.env` file in `client`
  ```bash
  touch .env
  ```
- Add the following variables to `.env`
  ```env
  VITE_BACKEND_URL=http://localhost:3000
  ```
- Start the development server
  ```bash
  npm run dev
  ```

## Server

- Install dependencies
  ```bash
  cd server
  npm install
  ```
- Create `.env` file in `server`
  ```bash
  touch .env
  ```
- Add the following variables to `.env`

  ```env
  PGHOSTNAME="localhost"
  PGPORT="5432"
  PGDBNAME="taskmanager"
  PGUSER="postgres"
  PGPWD="postgres"
  DATABASE_URL=`postgresql://${PGUSER}:${PGPWD}@${PGHOSTNAME}:${PGPORT}/${PGDBNAME}`

  PORT=3000
  JWT_SECRET_KEY="secretkey"
  SALT_ROUNDS=10
  FRONTEND_URL="http://localhost:5173"
  NODE_ENV="development"
  ```

- Initialize the database
  ```bash
  npx prisma migrate dev
  ```
- Generate Prisma client
  ```bash
  npx prisma generate
  ```
- Start the development server
  ```bash
  npm run start
  ```

## Postman Collection

- Import the `TaskManager.postman_collection.json` file into Postman to access the API endpoints.
- Add the necessary environment variables in Postman for proper functionality.
- ```bash
  server: http://localhost:3000/api/
  ```

## Testing

- To run tests, use the following command in the `server` directory
  ```bash
  cd server
  npm run test
  ```
