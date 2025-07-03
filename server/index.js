import db from './db.js';
import app from './app.js';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { parse } from 'csv-parse';

import { S3Client, CreateBucketCommand, ListBucketsCommand, HeadBucketCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const port = 9001;

async function insertPuzzles() {
  const csvFileUrl = 'https://github.com/JackScallan02/BreezeChess/releases/download/v0.1.0/lichess_db_puzzle.csv';
  const BATCH_SIZE = 1000; // Number of rows to insert in each batch
  const MAX_PUZZLE_AMOUNT=process.env.MAX_PUZZLE_AMOUNT || 10000;

  let records = [];
  let insertedCount = 0;

  try {
    console.log('Attempting to download CSV from Github Releases...');

    // Use axios to fetch the CSV content directly
    const response = await axios.get(csvFileUrl, {
      responseType: 'stream' // We expect text data (the CSV content)
    });

    const csvParserStream = response.data.pipe(parse({
      columns: true,          // Use the first row as headers
      skip_empty_lines: true, // Ignore any empty lines
      trim: true              // Trim whitespace from values
    }));

    console.log('CSV content being streamed and parsed. Starting batch insertion...');

    for await (const record of csvParserStream) {
      records.push(record);

      if (records.length >= BATCH_SIZE) {
        await db('puzzles').insert(records);
        insertedCount += records.length;
        console.log(`${parseInt((insertedCount / MAX_PUZZLE_AMOUNT) * 100)}% Inserted ${insertedCount} records...`);
        records = []; // Clear the batch
      }

      if (insertedCount >= MAX_PUZZLE_AMOUNT) {
        await db('puzzles').delete().where('id', '>', MAX_PUZZLE_AMOUNT);
        response.data.destroy();
        csvParserStream.destroy();
        break;
      }

    }

    // Insert any remaining records after the stream has ended
    if (records.length > 0 && insertedCount < MAX_PUZZLE_AMOUNT) {
      await db('puzzles').insert(records);
      insertedCount += records.length;
      console.log(`Inserted final ${records.length} records.`);
    }

    console.log(`\nSuccessfully inserted a total of ${insertedCount} records into puzzles.`);

  } catch (error) {
    console.error('An error occurred during the process:');
    if (error.response) {
      // Axios specific error for HTTP responses (e.g., 404, 500)
      console.error(`HTTP Error: Status ${error.response.status} - ${error.response.statusText}`);
      console.error('Response Data:', error.response.data);
    } else if (error.message) {
      console.error('Error message:', error.message);
    } else {
      console.error(error); // Fallback for other types of errors
    }
  }

}

async function setupDatabase() {
  try {
    console.log('Rolling back migrations...');
    await db.migrate.rollback();
    console.log('Running migrations...');
    await db.migrate.latest();
    console.log('Running seeds...');
    await db.seed.run();

    await insertPuzzles();
    
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

  async function checkBucketExists(bucket) {
    try {
      const res = await s3.send(new HeadBucketCommand(bucket));
      return true;
    } catch (error) {
      if (error.name === 'NotFound') {
        return false;
      }
      throw error;
    }
  }

  const bucket = { Bucket: "breezechess-bucket" }
  if (!(await checkBucketExists(bucket))) {
    // Sometimes if the server restarts, we don't want to try to create the same bucket again
    await s3.send(new CreateBucketCommand(bucket));
  }

  try {
    const response = await s3.send(new ListBucketsCommand({}));
    console.log("Buckets:", response.Buckets);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function readRoutes() {
  console.log("Loading routes...");
  const dirname = path.dirname(new URL(import.meta.url).pathname);
  const routesDirectory = path.join(dirname, 'routes'); // Absolute path to 'routes' directory
  // Read all files in the 'routes' directory
  for (const file of fs.readdirSync(routesDirectory)) {
    if (file.endsWith('.js')) { // Only import JavaScript files
        const routeName = file.replace('.js', ''); // Remove file extension
        const route = await import(path.join(routesDirectory, file));
        const router = route.default || route;
        if (router && typeof router === 'function') {
            app.use(`/${routeName}`, router);
          } else {
            console.error(`Invalid router in ${file}, skipping.`);
          }
      }
  }
  
  console.log("Finished loading all routes");
}

async function insertTestImages() {
  // Get images from https://picsum.photos/400
  const imageFromPicsum = 'https://picsum.photos/400';
  
  const images = [
    { name: 'image1.jpg', url: imageFromPicsum },
    { name: 'image2.jpg', url: imageFromPicsum },
    { name: 'image3.jpg', url: imageFromPicsum },
  ];
  const s3 = new S3Client({
    endpoint: process.env.AWS_ENDPOINT || "http://localhost:4566",
    forcePathStyle: true,
    region: "us-east-2",
    credentials: {
      accessKeyId: "test",
      secretAccessKey: "test",
    },
  });

  const bucketName = 'breezechess-bucket';
  // Inserts test images into the S3 bucket with prefix 'chess_piece/'
  for (const image of images) {
    try {
      const response = await axios.get(image.url, { responseType: 'arraybuffer' });
      const params = {
        Bucket: bucketName,
        Key: `chess_piece/${image.name}`,
        Body: response.data,
        ContentType: 'image/jpeg',
      };
      await s3.send(new PutObjectCommand(params));
      console.log(`Inserted ${image.name} into S3 bucket.`);
    } catch (error) {
      console.error(`Failed to insert ${image.name}:`, error);
    }
  }
  console.log("Test images inserted into S3 bucket.");
  console.log("You can now access the images at http://localhost:4566/breezechess-bucket/");
}

export async function startServer() {
  await setupDatabase();
  await createS3Bucket();
  await insertTestImages();
  await readRoutes();

  app.get('/', (req, res) => {
    res.send('Hello from the backend server!');
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

}

startServer();