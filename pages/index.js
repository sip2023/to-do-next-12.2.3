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

