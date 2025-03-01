## Welcome to BreezeChess

Step into a world where chess meets creativity. BreezeChess redefines training with advanced, result-driven tools that outshines other typical apps, and combines it with captivating visuals that make every move more engaging and meaningful. BreezeChess is the ultimate destination to sharpen your skills and achieve real results— all within an immersive chess environment.

## Setting up
1. Add a `.env` file in the root directory of your repo. Add the following, in which the values can be obtained by setting up a `Firebase` account:
```
REACT_APP_FB_KEY=<Key goes here>
REACT_APP_FB_PROJECT_ID=<Project ID goes here>
REACT_APP_FB_APP_ID=<App ID goes here>
REACT_APP_FB_MESSAGING_SENDER_ID=<Messaging Sender ID goes here>
REACT_APP_FB_MEASUREMENT_ID=<Measurement ID goes here>
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=db_dev
```

## Development

In the project directory, you can run the following command:\
`docker-compose up`\
which will then run:\
`npm run dev`\
Which runs the following three commands:

1. Continuously watch for tailwind changes
`npx tailwindcss -i ./src/input.css -o ./src/output.css --watch & npm start`

2. Run the app in the development mode.\
Open [http://localhost:9000](http://localhost:9000) to view it in your browser.

3. Emulate the firebase authentication during development at [http://localhost:9099](http://localhost:9099):\
`firebase emulators:start --only auth`

If you want to exec into the postgres container:\
`docker exec -it breezechess-postgres-1 psql -U user -d db_dev`

