import React, {useEffect, useMemo, useState} from 'react';
import './LoginRegistration.css';
import '../../styles/styles.css'
import { useSearchParams} from "react-router-dom";
import { useLocalState } from '../../utils/useLocalStorage';
import { useNavigate } from "react-router-dom";
import loginImg from '../../images/imgv2.png';
import {fetchData, postData} from "../../utils/fetchUtils";
import {Task} from "../../types/Task";

export function EmailConfirmedView() {
    const [jwt, setJwt] = useLocalState('', 'jwt');
    const [validUrl, setValidUrl] = useState(false);
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();

    console.log(searchParams);

    const clearJwt = () => {
        localStorage.removeItem('jwt');
        navigate("/login")
    };


    useEffect(() => {
        const verifyEmailUrl = async () => {
            try {
                console.log(searchParams.get("email"));
                console.log(searchParams.get("code"));

                postData<{}, number>('https://productivitypal-backend.onrender.com/email/verification/verify', {email: searchParams.get("email"), code: searchParams.get("code")})();
                setValidUrl(true);

            } catch (err){
                console.log("error")
                console.log(err)
                setValidUrl(false);
            }
        };
        verifyEmailUrl();
    }, []);


    return (
        <div className="loginBackground">
            <center>
                <div className="loginContainer">
                    <img className="loginContainer__image" src={loginImg} alt="loginImg">
                    </img>
                    <div className="loginContainer__loginBox">
                        <div className='logingFormContainer'>
                            <div className='logingFormContainer__loginForm'>
                                <p className='loginForm__title logged' >Your account has been verified! Please Log in</p>
                            </div>
                            <div className='logingFormContainer__actionButtonsRow'>
                                <button className='loginButton' onClick={() => { clearJwt() }} >Login me</button>
                            </div>
                        </div>
                    </div>
                </div>
            </center>
        </div>

    );
}