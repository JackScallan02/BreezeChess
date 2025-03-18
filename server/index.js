const express = require('express');
const db = require('./db'); // Knex instance
const app = express();
const AWS = require("aws-sdk");
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const port = 9001;

async function setupDatabase() {
  try {

    console.log('Rolling back migrations...');
    await db.migrate.rollback();

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

async function createS3Bucket() {
  const s3 = new AWS.S3({
    endpoint: process.env.AWS_ENDPOINT || "http://localhost:4566",
    s3ForcePathStyle: true,
    region: "us-east-2",
    accessKeyId: "test",
    secretAccessKey: "test",
  });

  await s3.createBucket({ Bucket: "breezechess-bucket" }).promise();
  console.log("S3 Bucket created");
  try {
    const response = await s3.listBuckets().promise();
    console.log("Buckets:", response.Buckets);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Start the server after setting up the database
setupDatabase().then(async () => {

  app.options('*', cors()); // Handle preflight requests

  app.use(cors());

  app.use(express.json()); // To parse JSON request bodies

  app.get('/', (req, res) => {
    res.send('Hello from the backend server!');
  });

  readRoutes();

  await createS3Bucket();


  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
