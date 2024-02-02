// Importing the global styles for the entire application
import '../styles/globals.css';

// Main application component
function MyApp({ Component, pageProps }) {
  // Rendering the component passed as a prop along with its pageProps
  return <Component {...pageProps} />;
}

// Exporting the main application component as the default export
export default MyApp;

