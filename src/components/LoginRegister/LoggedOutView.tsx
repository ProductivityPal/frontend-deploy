import React, { useEffect, useState } from 'react';
import './LoginRegistration.css';
import '../../styles/styles.css'
import { Navigate } from "react-router-dom";
import { useLocalState } from '../../utils/useLocalStorage';
import { useNavigate } from "react-router-dom";
import loginImg from '../../images/imgv2.png';

export function LoggedOutView() {
    const [jwt, setJwt] = useLocalState('', 'jwt');
    const navigate = useNavigate();

    const clearJwt = () => {
        localStorage.removeItem('jwt');
        navigate("/login")
    };



    return (
        <div className="loginBackground">
            <center>
                <div className="loginContainer">
                    <div>
                        <button className='textButton' onClick={() => { navigate("/register") }}>Don't have an account? Register!</button>
                    </div>
                    <img className="loginContainer__image" src={loginImg} alt="loginImg">
                    </img>
                    <div className="loginContainer__loginBox">
                        <div className='logingFormContainer'>
                            <div className='logingFormContainer__loginForm'>
                                <p className='loginForm__title logged' >You haved been logged out!</p>
                            </div>
                            <div className='logingFormContainer__actionButtonsRow'>
                                <button className='loginButton' onClick={() => { clearJwt() }} >Login me again</button>
                            </div>
                        </div>
                    </div>
                </div>
            </center>
        </div>

    );
}