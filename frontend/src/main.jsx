import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter } from 'react-router-dom'

// Your specific Client ID
const CLIENT_ID = "74034569980-6ei7ot12d6v0ia0kjdjq20je35m34oc5.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* The Provider wraps the Router, and the Router wraps the App */}
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
)