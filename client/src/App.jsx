import React, { useEffect, useState } from 'react';
import { BrowserRouter as Routes, Route, Switch, Link } from 'react-router-dom';
// import axios from 'axios';
import Home from './components/Home.jsx';
import AuthLogin from './components/AuthLogin.jsx'
// import AuthLogout from './components/AuthLogout.jsx'
import AuthRegister from './components/AuthRegister.jsx'
// import FormFindRASUnit from './components/FormFindRASUnit.jsx'
import AcctRasAdmin from './components/AcctRasAdmin.jsx'
// import { APIURL } from './assest/helpser/constants';
import './App.css'



function App() {
  const [token, setToken] = useState(null)
  const [departments, setDepartments] = useState([])
  const dept_id = null;

  useEffect(() => {
    console.log('--->>> useEffect start');
    const fetchDepartments = async () => {
      console.log('- - - > > > fetchDepartments start');
      try {
        const response = await fetch(`${APIURL}/api/departments`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch departments");
        } else {
          const data = await response.json();
          console.log("--------- Departments fetched:", data);
          setDepartments(data);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
    console.log('--->>> useEffect end');
  }, []);


  return (
    <>
      <nav>
        <Link to='/Authlogin'>Login</Link>
        <Link to='/AuthRegister'>Account</Link>
      </nav>
      <h1>University Research Administration Services</h1>
      <div id="navbar">
        <Navigations />
      </div>
      <div id="main-section">
        <h4>"RAS is here to help you with your research needs.  Find your RAS by Dept."</h4>
        <Routes>
          <Route path='/Authlogin' element={<AuthLogin setToken={setToken} />} />
          <Route path='/AcctRasAdmin' element={<AcctRasAdmin token={token} />} />
          <Route path='/AuthRegister' element={<AuthRegister setToken={setToken} />} />
          <Route path='/departments' element={<Departments departments={departments} token={token} />} />
          <Route path='/departments/:id' element={<SingleDepartment departments={departments} />} />
          <Route path='/' element={<Home />} />
        </Routes>
      </div>
    </>
  );
}

export default App
