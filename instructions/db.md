1. Open or create the `.profile` file in your home directory:

    ```bash
    nano ~/.profile
    ```

2. Add or modify the environment variable assignments in the file:

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