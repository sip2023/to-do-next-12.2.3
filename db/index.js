// Importing the Client class from the 'pg' library
import { Client } from 'pg';

// Fetching the database connection string from the environment variables
const connectionString = process.env.DB_URL;

// Creating a new instance of the Client class with the provided connection string
const db = new Client({
  connectionString
});

// Establishing a connection to the PostgreSQL database
db.connect();

// Exporting the created database client instance for use in other modules
export default db;

