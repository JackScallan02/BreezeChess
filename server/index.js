const express = require('express');
const db = require('./db'); // Knex instance
const app = express();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const port = 9001;

async function setupDatabase() {
  try {
    console.log('Waiting for database to be ready...');
    await new Promise(resolve => setTimeout(resolve, 5000));  // Delay of 5 seconds

    console.log('Running migrations...');
    await db.migrate.latest();

    console.log('Running seeds...');
    await db.seed.run();

    console.log('Database setup complete.');
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1); // Exit if setup fails
  }
}

function readRoutes() {
  const routesDirectory = path.join(__dirname, 'routes'); // Absolute path to 'routes' directory
  // Read all files in the 'routes' directory
  fs.readdirSync(routesDirectory).forEach(file => {
    if (file.endsWith('.js')) { // Only import JavaScript files
      const routeName = file.replace('.js', ''); // Remove file extension
      const route = require(path.join(routesDirectory, file)); // Require the route module

      // Use the route under its file name as the path
      app.use(`/${routeName}`, route); // Route file 'user.js' will be mounted at '/user'
    }
  });
}

// Start the server after setting up the database
setupDatabase().then(() => {

  app.options('*', cors()); // Handle preflight requests

  app.use(cors());

  app.get('/', (req, res) => {
    res.send('Hello from the backend server!');
  });


  readRoutes();


  app.use(express.json()); // To parse JSON request bodies

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
