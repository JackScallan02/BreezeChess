import db from './db.js';
import app from './app.js';
import fs from 'fs';
import path from 'path';

import { S3Client, CreateBucketCommand, ListBucketsCommand } from '@aws-sdk/client-s3';

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

async function createS3Bucket() {
  const s3 = new S3Client({
    endpoint: process.env.AWS_ENDPOINT || "http://localhost:4566",
    forcePathStyle: true,
    region: "us-east-2",
    credentials: {
      accessKeyId: "test",
      secretAccessKey: "test",
    },
  });

  await s3.send(new CreateBucketCommand({ Bucket: "breezechess-bucket" }));
  console.log("S3 Bucket created");
  try {
    const response = await s3.send(new ListBucketsCommand({}));
    console.log("Buckets:", response.Buckets);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function readRoutes() {
  const dirname = path.dirname(new URL(import.meta.url).pathname);
  const routesDirectory = path.join(dirname, 'routes'); // Absolute path to 'routes' directory
  // Read all files in the 'routes' directory
  for (const file of fs.readdirSync(routesDirectory)) {
    if (file.endsWith('.js')) { // Only import JavaScript files
        const routeName = file.replace('.js', ''); // Remove file extension
        const route = await import(path.join(routesDirectory, file));
        const router = route.default || route;
        if (router && typeof router === 'function') {
            console.log("READING ROUTE: ", `/${routeName}`);
            app.use(`/${routeName}`, router);
            console.log("route loaded");

          } else {
            console.error(`Invalid router in ${file}, skipping.`);
          }
      }
  }
}

export async function startServer() {
  await setupDatabase();
  await createS3Bucket();
  console.log("Reading routes");
  await readRoutes();

  app.get('/', (req, res) => {
    res.send('Hello from the backend server!');
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

}

startServer();