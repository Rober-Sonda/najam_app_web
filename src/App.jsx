import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="animate-fade-in">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
