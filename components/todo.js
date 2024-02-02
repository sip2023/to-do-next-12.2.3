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

