import React, { useState , useEffect } from 'react';
import styled from 'styled-components';
import { useAuth0 } from '@auth0/auth0-react'; 
import crypto from 'crypto';
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import isUserAuth from '../utils/auth'
const Container = styled.div`
  background-image: url('/background.jpg');
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
  color: red;
`;

const Tab = styled.button`
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
  background-color: #0a6244;
  color: white;
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
  const router = useRouter()

 // user states

 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');


 useEffect(()=>{
  if(isUserAuth()){
    router.push('/')
  }
 })

  // Use Auth0 hook
  const { loginWithRedirect, user } = useAuth0();


  const handleChangeLogin = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    
    const body = {
      "email": email,
      "password": password
    }
    axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/login`,body)
    .then(res=>{  
      
        if(res.status == 200){
          console.log(res.data)
          Cookies.set('plan_ahead_user_token', res.data.token)  
          Cookies.set('plan_ahead_user_id', res.data.userId)
          
          router.push('/')
        }
      
    }).catch(err=>{
      console.log(err)
      setError1(true)
    })


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

    try {
      // Use Auth0 loginWithRedirect method
      await loginWithRedirect({
        username,
        password,
        redirectUri: window.location.origin,
      });
    } catch (error) {
      console.error(error);
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
            <Input type="email" id="login-email" name="email" onChange={handleChangeLogin} placeholder="Email" />
            <Input type="password" id="login-password" name="password" onChange={handleChangeLogin} placeholder="Password" />
            <div style={{ marginBottom: '16px' }}> {/* Add margin bottom */}
              <Button type="submit">Login</Button>
            </div>
            <div style={{ marginBottom: '16px' }}> {/* Add margin bottom */}
              <Button type="submit">Login with Auth0</Button>
            </div>
            <Error>
              {error1 && <div>The email or password is incorrect.</div>}
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
