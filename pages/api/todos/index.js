// Importing the 'db' instance for database connection
import db from "../../../db";

// API route handler function for the 'index' endpoint
export default async function handler(req, res) {
  // Handling HTTP POST requests (create)
  if (req.method === 'POST') {
    // Performing a database query to insert a new ToDo item
    const result = await db.query('INSERT INTO todos (name, completed) VALUES ($1, $2) RETURNING *', [req.body.name, req.body.completed]);

    // Sending the newly created ToDo item as the response
    res.send(result.rows[0]);
  }
  // Handling other HTTP methods (e.g., GET requests)
  else {
    // Checking if the 'completed' query parameter is present
    if (req.query.completed) {
      // Performing a database query to fetch ToDo items based on completion status
      const result = await db.query('SELECT * FROM todos WHERE completed = $1', [req.query.completed]);

      // Sending the fetched ToDo items as the response
      res.send(result.rows);
    } else {
      // Performing a database query to fetch all ToDo items
      const result = await db.query('SELECT * FROM todos');

      // Sending the fetched ToDo items as the response
      res.send(result.rows);
    }
  }
}

