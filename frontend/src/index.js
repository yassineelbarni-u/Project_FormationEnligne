import React from 'react';
import ReactDOM from 'react-dom/client';
// Import des fichiers CSS dans un ordre spécifique pour éviter les conflits :
// 1. Reset CSS (réinitialisation de tous les styles)
import './styles/reset.css';
// 2. Variables CSS (définition des variables globales)
import './styles/variables.css';
// 3. Styles généraux de l'application
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// index.js
document.title = "E‑Learning by Ilyas | Accueil";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
