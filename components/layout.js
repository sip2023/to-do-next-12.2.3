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

