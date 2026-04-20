import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { routes } from './routes/Routes';

function App() {
  return (
    <div className="dark:bg-gray-900 text-gray-900 dark:text-white scrool">
      <RouterProvider router={routes} />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
