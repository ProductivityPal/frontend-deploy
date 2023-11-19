import React, { useEffect, useState } from 'react';
import './LoginRegistration.css';
import '../../styles/styles.css'
import { Navigate } from "react-router-dom";
import { useLocalState } from '../../utils/useLocalStorage';
import { useNavigate } from "react-router-dom";

export function LoginView() {
  const [jwt, setJwt] = useLocalState('', 'jwt');
  const [calendarId, setCalendarId] = useLocalState('6')
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const clearJwt = () => {
    localStorage.removeItem('jwt'); 
  };

  function handleEmailChange(value: any) {
    setEmail(value)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(value)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }

  }

  function sendLoginRequest() {
    clearJwt();

    console.log("sendLoginRequest", jwt, typeof jwt);
    if (!jwt) {
      const reqBody = {
        email: email,
        password: password
      };
      console.log(reqBody)
      fetch('https://productivitypal-56uf.onrender.com/auth/authenticate', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(reqBody)
      }).then(res => {
        console.log(res)
        return res.json()
      }).then(body => {
        console.log("body", body);
        setJwt(body.token);
        navigate("/calendar");
      }).catch(err => {
        console.log("err", err);
      });
    }

    // TODO: Fix
    if (jwt != "") {
      navigate("/calendar");
    }
  }

  return (
    <div className='logingFormContainer'>
      <div className='logingFormContainer__loginForm'>
        <p className='loginForm__title'>email</p>
        <input className='loginForm__input' type='text' value={email} pattern="[^\s@]+@[^\s@]+\.[^\s@]+"  onChange={(e) => handleEmailChange(e.target.value)}></input>
        {emailError && <p style={{ color: 'red', fontSize: 'small' }}>{emailError}</p>}
      </div>
      <div className='logingFormContainer__loginForm'>
        <p className='loginForm__title'>password</p>
        <input className='loginForm__input' type='password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
      </div>
      <div className='logingFormContainer__actionButtonsRow'>
        {/* <button className='googleLogin'>Sign with Google</button> */}
        <button className='loginButton' onClick={() => { sendLoginRequest() }} >Login me</button>
      </div>
    </div>
  );
}