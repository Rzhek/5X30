# 5X30

## Tech Stack

- **Frontend**: Vite + React
- **Backend**: Node.js + Express
- **Authentication**: Auth0
- **Database**: MongoDB
- **Third-Party Exercise API**: External exercise data integration via `EXERCISE_API_KEY`

---

## Project Structure

```bash
5x30/
|── client/
|── server/
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/5x30.git
cd 5x30
```

### 2. Install dependecies

Run the following in both `client` and `server` folders

```bash
npm i
```

### 3. Get the Third-Party exercise API key

Sign up on this website https://www.api-ninjas.com/api/exercises
and get your own API key

### 4. Set up environmental Variables

client/.env

```bash
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_CALLBACK_URL=your-auth0-callback
VITE_API_SERVER_URL=http://localhost:6060
VITE_AUTH0_AUDIENCE=your-auth0-audience
```

server/.env

```bash
MONGO_URI=your-mongodb-connection-uri
PORT=6060
EXERCISE_API_KEY=your-exercise-api-key
CLIENT_ORIGIN_URL=http://localhost:5173
AUTH0_AUDIENCE=your-auth0-audience
AUTH0_DOMAIN=your-auth0-domain
```

## Running the App

- Start the frontend

```bash
cd client
npm run dev
```

- Start the backend

```bash
cd server
nodemon server.js
```

- Go to http://localhost:5173
