import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import SignIn from './pages/SignIn.jsx';
import App from './pages/App.jsx';
import Thank from './pages/thank.jsx';
const router = createBrowserRouter([ 
    { 
      path: '/',
      element : <App />
    },
    {
        path : '/register',
        element : <SignIn />
    },
    {
      path:'/thankyou',
      element : <Thank />,
    }
  ]);
ReactDOM.createRoot(document.getElementById('root')).render(
  
    <RouterProvider router={router} />
  
)
