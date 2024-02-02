// Importing the 'db' instance for database connection
import db from "../../../db";

// API route handler function
export default async function handler(req, res) {
  // Handling HTTP PUT requests (update)
  if (req.method === 'PUT') {
    // Performing a database query to update a ToDo item
    const result = await db.query('UPDATE todos SET name = $1, completed = $2 WHERE id = $3 RETURNING *', [req.body.name, req.body.completed, req.query.id]);

    // Checking if the ToDo item was not found
    if (result.rows.length === 0) {
      res.status(404).send('Todo not found');
      return;
    }

    // Sending the updated ToDo item as the response
    res.send(result.rows);
  }
  // Handling HTTP DELETE requests (delete)
  else if (req.method === 'DELETE') {
    // Performing a database query to delete a ToDo item
    await db.query('DELETE FROM todos WHERE id = $1', [req.query.id]);

    // Sending a success response
    res.status(200).send();
  }
  // Handling other HTTP methods (e.g., GET requests)
  else {
    // Performing a database query to fetch a ToDo item by its ID
    const result = await db.query('SELECT * FROM todos WHERE id = $1', [req.query.id]);

    // Checking if the ToDo item was not found
    if (result.rows.length === 0) {
      res.status(404).send('Todo not found');
      return;
    }

    // Sending the fetched ToDo item as the response
    res.send(result.rows);
  }
}

