import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Services from './components/Services';
import News from './components/News';
// import AllUsers from './components/AllUsers';
// import Departments from './components/Departments';
import Footer from './components/Footer';
import Home from './components/Home';
// import Investigators from './components/Investigators';
// import Awards from './components/Awards';
import Login from './components/Login';
import './styles/styles.css';



const App = () => {
  return (
    <div className='app'>
      <Header />
      <News />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/services' element={<Services />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;