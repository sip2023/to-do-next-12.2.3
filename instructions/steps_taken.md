1. `npx create-next-app@12.2.3`
2. name `to-do-next-12.2.3`
3. mkdir `db` 
4. vim db/index.js
```js
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

```
5. We will organize our components into separate files within a folder named components.
6. touch `layout.js, todo-list.js and todo.js`
7. vim components/layout.js
```js
// Importing styles from the layout.module.css file
import styles from '../styles/layout.module.css';

// Declaring a functional component named Layout that takes props as its argument
export default function Layout(props) {
  return (
    // Rendering a div with the 'layout' class from the imported styles
    <div className={styles.layout}>
      {/* Rendering an h1 element with the 'title' class from the imported styles */}
      <h1 className={styles.title}>To Do</h1>
      {/* Rendering the children components passed to the Layout component */}
      {props.children}
    </div>
  );
}

```

8. vim components/todo-list.js

```js
// Importing styles from the todo-list.module.css file
import styles from '../styles/todo-list.module.css';
import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import ToDo from './todo';

export default function ToDoList() {
  // State variables
  const [todos, setTodos] = useState(null);
  const [mainInput, setMainInput] = useState('');
  const [filter, setFilter] = useState();
  const didFetchRef = useRef(false);

  // Effect to fetch todos when component mounts
  useEffect(() => {
    if (didFetchRef.current === false) {
      didFetchRef.current = true;
      fetchTodos();
    }
  }, []);

  // Function to fetch todos based on completion status
  async function fetchTodos(completed) {
    let path = '/todos';
    if (completed !== undefined) {
      path = `/todos?completed=${completed}`;
    }
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + path);
    const json = await res.json();
    setTodos(json);
  }

  // Debounced function to update todo with a delay
  const debouncedUpdateTodo = useCallback(debounce(updateTodo, 500), []);

  // Function to handle changes in todo items
  function handleToDoChange(e, id) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    const copy = [...todos];
    const idx = todos.findIndex((todo) => todo.id === id);
    const changedToDo = {
      ...todos[idx],
      [name]: value
    };
    copy[idx] = changedToDo;
    debouncedUpdateTodo(changedToDo);
    setTodos(copy);
  }

  // Function to update todo on the server
  async function updateTodo(todo) {
    const data = {
      name: todo.name,
      completed: todo.completed
    };
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/todos/${todo.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Function to add a new todo
  async function addToDo(name) {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/todos`, {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        completed: false
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (res.ok) {
      const json = await res.json();
      const copy = [...todos, json];
      setTodos(copy);
    }
  }

  // Function to handle deletion of a todo
  async function handleDeleteToDo(id) {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (res.ok) {
      const idx = todos.findIndex((todo) => todo.id === id);
      const copy = [...todos];
      copy.splice(idx, 1);
      setTodos(copy);
    }
  }

  // Function to handle changes in the main input
  function handleMainInputChange(e) {
    setMainInput(e.target.value);
  }

  // Function to handle keydown events for the main input
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      if (mainInput.length > 0) {
        addToDo(mainInput);
        setMainInput('');
      }
    }
  }

  // Function to handle filter changes
  function handleFilterChange(value) {
    setFilter(value);
    fetchTodos(value);
  }

  // Rendering JSX
  return (
    <div className={styles.container}>
      <div className={styles.mainInputContainer}>
        <input
          className={styles.mainInput}
          placeholder="What needs to be done?"
          value={mainInput}
          onChange={(e) => handleMainInputChange(e)}
          onKeyDown={handleKeyDown}
        ></input>
      </div>
      {!todos && <div>Loading...</div>}
      {todos && (
        <div>
          {todos.map((todo) => {
            return (
              <ToDo key={todo.id} todo={todo} onDelete={handleDeleteToDo} onChange={handleToDoChange} />
            );
          })}
        </div>
      )}
      <div className={styles.filters}>
        {/* Filter buttons with dynamic styling based on the selected filter */}
        <button className={`${styles.filterBtn} ${filter === undefined && styles.filterActive}`} onClick={() => handleFilterChange()}>
          All
        </button>
        <button className={`${styles.filterBtn} ${filter === false && styles.filterActive}`} onClick={() => handleFilterChange(false)}>
          Active
        </button>
        <button className={`${styles.filterBtn} ${filter === true && styles.filterActive}`} onClick={() => handleFilterChange(true)}>
          Completed
        </button>
      </div>
    </div>
  );
}

```

9. vim components/todo.js

```js
// Importing the Image component from the 'next/image' package
import Image from 'next/image';

// Importing styles from the todo.module.css file
import styles from '../styles/todo.module.css';

// Functional component representing a ToDo item
export default function ToDo(props) {
  // Destructuring props to extract todo, onChange, and onDelete
  const { todo, onChange, onDelete } = props;

  return (
    // ToDo item container with unique key
    <div className={styles.toDoRow} key={todo.id}>
      {/* Checkbox to mark completion status */}
      <input
        className={styles.toDoCheckbox}
        name="completed"
        type="checkbox"
        checked={todo.completed}
        value={todo.completed}
        onChange={(e) => onChange(e, todo.id)}
      ></input>
      
      {/* Input field for todo name */}
      <input
        className={styles.todoInput}
        autoComplete='off'
        name="name"
        type="text"
        value={todo.name}
        onChange={(e) => onChange(e, todo.id)}
      ></input>
      
      {/* Button to delete the todo item */}
      <button className={styles.deleteBtn} onClick={() => onDelete(todo.id)}>
        {/* Image component for the delete icon */}
        <Image src="/material-symbols_delete-outline-sharp.svg" width="24px" height="24px" />
      </button>
    </div>
  );
}

```

10. there are three JavaScript files (layout.js, todo-list.js, and todo.js) organized within a folder named components. This structure suggests a modular organization pattern.

11. The components folder is likely intended to store reusable React components that can be used across different parts of your application.
Organizing components into a separate folder helps maintain a clean and modular project structure, making it easier to manage and understand the code.

12. layout.js:

This file exports a React component named Layout.
The purpose of the Layout component is to define a common layout structure that can be reused across multiple pages or components in your application.
It includes a title ("To Do") and renders its children components. This allows consistent styling and layout throughout your application. 

13. todo-list.js:

This file exports a React component named ToDoList.
The purpose of the ToDoList component is to represent a list of ToDo items.
It manages the state for ToDo items, handles interactions such as adding, updating, and deleting ToDo items, and includes a filter mechanism to display active, completed, or all ToDo items.
This component likely serves as a higher-level container for rendering individual ToDo components.  

14. todo.js:

This file exports a React component named ToDo.
The purpose of the ToDo component is to represent an individual ToDo item.
It includes UI elements such as checkboxes, input fields, and a delete button for interacting with and displaying a single ToDo item.
This component is likely used by the ToDoList component to render each item in the ToDo list.

15. In summary, the components folder and the three JavaScript files follow a modular approach to organizing React components. The Layout component defines a common layout structure, the ToDoList component manages a list of ToDo items, and the ToDo component represents an individual ToDo item. This modular organization promotes reusability and maintainability in React applications.

16. mkdir -p pages/api/todos 


In a Next.js project, the pages/api directory is a special directory used for creating API routes. Any file inside the pages/api directory automatically becomes an API route with a corresponding endpoint. In your case, creating the pages/api/todos directory would likely be used to define API routes related to ToDo functionality.  

17. Purpose:

The pages/api/todos directory is likely intended to handle API routes related to ToDo functionality.
You can create individual files within this directory to define specific API routes for fetching, adding, updating, or deleting ToDo items.
Example API Routes:

You might create files like pages/api/todos/index.js for handling the overall /api/todos endpoint, and additional files for specific actions like pages/api/todos/create.js for adding new ToDo items, pages/api/todos/update.js for updating ToDo items, etc.
Example Structure: 

```bash
- pages
  - api
    - todos
      - index.js      // Handles /api/todos
      - create.js     // Handles /api/todos/create
      - update.js     // Handles /api/todos/update
      - delete.js     // Handles /api/todos/delete

```  

18. Example Usage:

With this structure, you can make HTTP requests to these API endpoints from your React components or other parts of your application.

```js
// Example: Making a fetch request in a React component
fetch('/api/todos')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error fetching todos:', error));

```

19. For our purpose we will have two api in the todos
```bash
[id].js
index.js
```

20. vim pages/api/todos/[id].js

```js
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

```

21. vim pages/api/index.js

```js
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

``` 

22. The `pages/_app.js` file in a Next.js project part of the application's entry point.

This file allows you to customize the behavior of your Next.js application at a global level. You can add global styles, configure data fetching, and perform other setup tasks. The getInitialProps function is used to fetch initial props if needed. The MyApp component is then wrapped with the default Next.js App component.

```js
// Importing the global styles for the entire application
import '../styles/globals.css';

// Main application component
function MyApp({ Component, pageProps }) {
  // Rendering the component passed as a prop along with its pageProps
  return <Component {...pageProps} />;
}

// Exporting the main application component as the default export
export default MyApp;

```

23. The pages/index.js file in a Next.js project define the main page or endpoint of your application

```js
// Importing the 'Head' component from 'next/head' for managing the document head
import Head from 'next/head';

// Importing custom components
import Layout from '../components/layout';
import ToDoList from '../components/todo-list';

// Default export for the Home page
export default function Home() {
  // Rendering the main page content
  return (
    <div>
      {/* Managing the document head with meta tags, title, and favicon */}
      <Head>
        <title>Full Stack Book To Do</title>
        <meta name="description" content="Full Stack Book To Do" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Rendering the Layout component with ToDoList component as its child */}
      <Layout>
        <ToDoList />
      </Layout>
    </div>
  );
}

```

24. adding svg in public folder

25. rm styles/globals.css
    vim styles/globals.css

```css
/* Resetting default margin and padding for HTML and body elements */
html,
body {
  padding: 0;
  margin: 0;
  /* Setting a default font family for text elements */
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

/* Styling hyperlinks */
a {
  color: inherit;
  text-decoration: none;
}

/* Applying box-sizing border-box model to all elements for consistent sizing */
* {
  box-sizing: border-box;
}

/* Media query for light color scheme preference */
@media (prefers-color-scheme: light) {
  /* Applying light color scheme to HTML element */
  html {
    color-scheme: light;
  }

  /* Styling body for light color scheme */
  body {
    color: white;      /* Text color */
    background: black; /* Background color */
  }
}

```

26. vim styles/lauyot.module.css

```css
/* Styling for a layout class */
.layout {
    width: 300px;   /* Setting the width of elements with the 'layout' class */
    margin: 20px;   /* Adding margin around elements with the 'layout' class */
}

/* Styling for a title class */
.title {
    text-align: center; /* Centering text within elements with the 'title' class */
    font-size: 24px;    /* Setting the font size of text within elements with the 'title' class */
    margin: 10px;       /* Adding margin around elements with the 'title' class */
}


```  

27. vim styles/todo-list.module.css

```css
/* Styling for a container class */
.container {
  width: 300px;               /* Setting the width of elements with the 'container' class */
  border: 1px solid black;    /* Adding a 1px solid black border to elements with the 'container' class */
}

/* Styling for a mainInputContainer class */
.mainInputContainer {
  width: 100%;                /* Setting the width of elements with the 'mainInputContainer' class to 100% */
  margin: 20px 0;             /* Adding margin above and below elements with the 'mainInputContainer' class */
}

/* Styling for a mainInput class */
.mainInput {
  padding: 5px;               /* Adding padding to the elements with the 'mainInput' class */
  border: 1px solid black;    /* Adding a 1px solid black border to elements with the 'mainInput' class */
  margin: auto;               /* Centering elements with the 'mainInput' class horizontally */
  display: block;             /* Making the elements with the 'mainInput' class block-level */
  width: 260px;               /* Setting the width of elements with the 'mainInput' class */
  height: 40px;               /* Setting the height of elements with the 'mainInput' class */
}

/* Styling for a filters class */
.filters {
  display: flex;              /* Setting the display property to flex for elements with the 'filters' class */
  justify-content: space-between;  /* Distributing space evenly between child elements with the 'filters' class */
  padding: 20px;              /* Adding padding to elements with the 'filters' class */
  margin-top: 20px;           /* Adding margin at the top of elements with the 'filters' class */
  border-top: 1px solid black; /* Adding a 1px solid black border at the top of elements with the 'filters' class */
}

/* Styling for a filterBtn class */
.filterBtn {
  background: none;           /* Removing background color for elements with the 'filterBtn' class */
  border: none;               /* Removing borders for elements with the 'filterBtn' class */
  cursor: pointer;            /* Setting the cursor to pointer for elements with the 'filterBtn' class */
}

/* Styling for a filterActive class */
.filterActive {
  text-decoration: underline;  /* Adding an underline to text for elements with the 'filterActive' class */
}

```

28. vim styles/todo.module.css

```css
/* Styling for a todoInput class */
.todoInput {
    padding: 5px;               /* Adding padding to elements with the 'todoInput' class */
    border: 1px solid black;    /* Adding a 1px solid black border to elements with the 'todoInput' class */
    width: 194px;               /* Setting the width of elements with the 'todoInput' class */
    height: 40px;               /* Setting the height of elements with the 'todoInput' class */
    margin: 5px;                /* Adding margin around elements with the 'todoInput' class */
}

/* Styling for a toDoRow class */
.toDoRow {
    display: flex;              /* Setting the display property to flex for elements with the 'toDoRow' class */
    flex-direction: row;        /* Setting the flex direction to row for elements with the 'toDoRow' class */
    align-items: center;        /* Aligning items to the center for elements with the 'toDoRow' class */
    margin: 5px 20px;            /* Adding margin above and below, and left and right, for elements with the 'toDoRow' class */
}

/* Styling for a deleteBtn class */
.deleteBtn {
    background: none;           /* Removing background color for elements with the 'deleteBtn' class */
    border: 0;                  /* Removing borders for elements with the 'deleteBtn' class */
    cursor: pointer;            /* Setting the cursor to pointer for elements with the 'deleteBtn' class */
}


```

29. vim  `.env.example`

```bash
// Create a .env file in the main working directory with the following format
// Export the environment variables and source them from .profile

// Define public API URL
NEXT_PUBLIC_API_URL=/api

// Define database URL using environment variables
DB_URL=postgres://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME

```

30. vim instructions/db.md

```bash
1. Open or create the `.profile` file in your home directory:

    ```bash
    nano ~/.profile
    ```

2. Add or modify the environment variable assignments in the file:
```
    ```bash
    export NEXT_PUBLIC_API_URL=/api
    export DB_USER=your_database_user
    export DB_PASSWORD=your_database_password
    export DB_HOST=your_database_host
    export DB_PORT=your_database_port
    export DB_NAME=todos
    export DB_URL=postgres://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME
    ```

   Replace `your_database_user`, `your_database_password`, `your_database_host`, and `your_database_port` with your actual database credentials and connection details.

3. Save and exit the text editor.

4. Reload the `.profile` file to apply the changes without restarting your terminal:

    ```bash
    source ~/.profile
    ```

Now, your database URL (`DB_URL`) includes environment variables for the database username, password, host, and port, making it more flexible and configurable.

Remember to update your application code to read these environment variables instead of hard-coding the values. This approach allows you to adapt your database connection settings easily without modifying the code directly.

```
```

31. Add proper dependencies in package.json

```json
  "dependencies": {
    "lodash": "^4.17.21",
    "next": "12.2.3",
    "pg": "^8.8.0",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  }
```

add only two 
```json
    "lodash": "^4.17.21",
    "pg": "^8.8.0",
```

32. setup database 

33. npm i 

34. 