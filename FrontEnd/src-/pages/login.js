import React, { useState } from 'react';
import styled from 'styled-components';
import crypto from 'crypto';

const Container = styled.div`
background-image: url('/back.jpg');
background-size: cover;
background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Card = styled.div`
  width: 400px;
  padding: 32px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  background-color: white;
`;
const Error = styled.div`
  display: flex; 
  justify-content: center; 
  align-items: center; 
  color: red
`;

const Tab = styled.button`
  background- image: url();
  background-color: transparent;
  border: none;
  padding: 8px 16px;
  margin-right: 8px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  outline: none;

  &:hover {
    background-color: #f5f5f5;
  }

  &.active {
    background-color: #e0e0e0;
  }
`;

const TabContent = styled.div`
  display: none;

  &.active {
    display: block;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const Button = styled.button`
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  background-color: #4Caf50;color: white;
  font-size: 16px;
  cursor: pointer;
  border: none;
  outline: none;

  &:hover {
    background-color: #45a049;
  }
`;

const LoginPage = () => {
  const [error1, setError1] = useState(false);
  const [error2, setError2] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const loginTabId = crypto.randomBytes(10).toString('hex');
  const registerTabId = crypto.randomBytes(10).toString('hex');

  const handleLogin = async (event) => {

    event.preventDefault();
    const username = document.getElementById(`login-username`).value;
    const password = document.getElementById(`login-password`).value;


    const response = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    if (response.ok) {

    } else {
      setError1(true);
    }
  };


  const handleRegister = async (event) => {

    event.preventDefault();
    const username = document.getElementById(`register-username`).value;
    const password = document.getElementById(`register-pass`).value;
    const confirmPassword = document.getElementById(`register-pass-confirm`).value;

    if (password !== confirmPassword) {
      console.log("error: not equals");
      setError2(true);
      return;
    }
    const response = await fetch('http://localhost:3001/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      // Handle successful registration
    } else {
      setError2(true);
    }

  };

  return (

    <Container>
      <Card>

        <Tab className={activeTab === 'login' ? 'active' : ''} onClick={() => setActiveTab('login')}>
          Login
        </Tab>
        <Tab className={activeTab === 'register' ? 'active' : ''} onClick={() => setActiveTab('register')}>
          Register
        </Tab>
        <TabContent className={activeTab === 'login' ? 'active' : ''} id={loginTabId}>
          <form onSubmit={handleLogin}>
            <Input type="text" id="login-username" name="username" placeholder="Username" />
            <Input type="password" id="login-password" name="password" placeholder="Password" />
            <Button type="submit">Login</Button>
            <Error>
              {error1 && <div>The username or password is incorrect.</div>}
            </Error>
          </form>
        </TabContent>

        <TabContent className={activeTab === 'register' ? 'active' : ''} id={registerTabId}>
          <form onSubmit={handleRegister}>
            <Input type="text" id="register-username" name="username" placeholder="Username" />
            <Input type="password" id="register-pass" name="password" placeholder="Password" />
            <Input type="password" id="register-pass-confirm" name="confirmPassword" placeholder="Confirm Password" />
            <Button type="submit">Register</Button>
            <Error>
              {error2 && <div>An error has occurred. Check that the passwords match.</div>}
            </Error>
          </form>
        </TabContent>

      </Card>
    </Container>

  );
};

export default LoginPage;