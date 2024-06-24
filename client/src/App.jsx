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
    attemptLoginWithToken();
  }, []);

  const attemptLoginWithToken = async () => {
    const token = window.localStorage.getItem('token');
    if (token) {
      const response = await fetch('/api/auth/me`, {
        headers: {
        Authorization: `Bearer ${token}`
      }
      });
    const json = await response.json();
    if (json) {
      setToken(token);
      if (response.ok) {
        setAuth(json);
      }
      else {
        window.localStorage.removeItem('token');
      }
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await fetch('/api/departments');
      const json = await response.json();
      setDepartments(json);
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchAssignments = async () => {
      const response = await fetch(`/api/departments/${auth.id}/assignments`, {
        headers: {
          Authorization: window.localStorage.getItem('token')
        }
      });
      const json = await response.json();
      if (response.ok) {
        setAssignments(json);
      }
    };
    if (auth.id) {
      fetchAssignments();
    }
    else {
      setAssignments([]);
    }
  }, [auth]);

  const login = async (Credentials) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(Credentials),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const json = await response.json();
    if (response.ok) {
      window.localStorage.setItem('token', json.token);
      attemptLoginWithToken();
    }
    else {
      throw json;
    }
  };

  const register = async (credentials) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const json = await response.json();
    if (response.ok) {
      window.localStorage.setItem('token', json.token);
      attemptLoginWithToken();
    }
    else {
      throw json;
    }
  };


  //this is reserved for manager role
  const addAssignment = async (dept_id) => {
    const response = await fetch(`/api/users/${auth.id}/assignments`, {
      method: 'POST',
      body: JSON.stringify({ dept_id }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: window.localStorage.getItem('token')
      }
    });

    const json = await response.json();
    if (response.ok) {
      setAssignments([...assignments, json]);
    }
    else {
      console.log(json);
    }
  }

  const removeAssignment = async (id) => {
    const response = await fetch(`/api/users/${auth.id}/assignments/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: window.localStorage.getItem('token')
      }
    });

    if (response.ok) {
      setAssignments(assignments.filter(assignment => assignment.id !== id));
    }
  }
    else {
    console.log(json);
  }

  const logout = () => {
    window.localStorage.removeItem('token');
    setAuth(null);
  };

  return {
    <>
    {
        !auth.id ? <>
    <Login login={login} />
    <Register register={register} />
  </>
    : <button onCLick={logout}>Logout {auth.email}</button>
}
    }
<ul>
  {
    departments.map(department => {
      const isAssigned = assignments.find(assignment => assignment.deparment_id === department.id);
      return (
        <li key={department.id} className={isAssigned ? 'assigned' : ''}>
          {department.name}
          {
            auth.id && isAssigned && <button onClick={() => removeAssignment(isAssigned.id)}>Remove</button>
          }
          {
            auth.id && !isAssigned && <button onClick={() => addAssignment(department.id)}>Assign</button>
          }
        </li>
      );
    })
  }
</ul>







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
