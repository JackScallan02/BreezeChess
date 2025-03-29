import db from '../../db.js';

before(async () => {
    console.log();
    console.log("Rolling back database...");
    await db.migrate.rollback();
    console.log("Running migrations...");
    await db.migrate.latest();
    console.log("Running seeds...");
    await db.seed.run();
    console.log("Database setup complete.");
    console.log();
});

after(async () => {
    // This will run after all tests are complete
    console.log("\nCompleted tests. Closing database connection...");
    await db.destroy();
    console.log("Database connection closed.");
});