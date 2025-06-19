## Welcome to BreezeChess

Step into a world where chess meets creativity. BreezeChess redefines training with advanced, result-driven tools that outshines other typical apps, and combines it with captivating visuals that make every move more engaging and meaningful. BreezeChess is the ultimate destination to sharpen your skills and achieve real results— all within an immersive chess environment.

## Setting up

0. Ensure the following are installed:
  - node.js: v22.14.0
  - docker: v24.0.6

1. Add a `.env` file in the root directory of your repo. Add the following environment variables to the file, in which the firebase variable values can be obtained by setting up a `Firebase` account:
```
NODE_ENV=development
VITE_FB_KEY=<Key goes here>
VITE_FB_PROJECT_ID=<Project ID goes here>
VITE_FB_APP_ID=<App ID goes here>
VITE_FB_MESSAGING_SENDER_ID=<Messaging Sender ID goes here>
VITE_FB_MEASUREMENT_ID=<Measurement ID goes here>
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=db_dev
POSTGRES_HOST=postgres
MAX_PUZZLE_AMOUNT=10000
```

## Development

### Running the app
In the project directory, you can run the following command:\
`yarn dc:dev`\
which will then start up the following containers, assuming a docker daemon is running.

#### Client

The client container runs the following commands:

1. Run the app in the development mode.\
Open [http://localhost:9000](http://localhost:9000) to view it in your browser.

2. Emulate the firebase authentication during development at [http://localhost:9099](http://localhost:9099):\
`firebase emulators:start --only auth`

#### Postgres

Contains the database for the application.

If you want to exec into the postgres container:\
`docker exec -it breezechess-postgres-1 psql -U user -d db_dev`

#### Server

The backend server, which contains the express routes and database migrations/seeds.


#### Localstack

The mock AWS container. Connect to the S3 bucket: `aws --endpoint-url=http://localhost:4566 s3 ls`

### Puzzle Service

The python service for filtering and retrieving puzzles from the database

### Testing the app
Currently, there are only server tests:
Set your`NODE_ENV` to `test`, and start up the app with `yarn dc:dev`. Then, run the tests with `yarn test:server`

### Run ESLint
`npx eslint <directory>`
