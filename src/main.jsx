import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';       
import React from 'react';    
    import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import FirebaseProvider from "./firecontext"


import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
 
     <FirebaseProvider>
     <BrowserRouter>
      <App />
    </BrowserRouter>
  </FirebaseProvider>
 
)
