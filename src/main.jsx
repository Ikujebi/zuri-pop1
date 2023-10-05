import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './App.css'
import { BrowserRouter as Router } from 'react-router-dom';



const rootElement = document.getElementById('root');

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
       <Router>
    <App />
  </Router>
    </React.StrictMode>
  );


