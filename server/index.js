const express = require('express');
const db = require('./db'); // Knex instance
const app = express();
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

// Start the server after setting up the database
setupDatabase().then(() => {
  app.get('/', (req, res) => {
    res.send('Hello from the backend server!');
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
