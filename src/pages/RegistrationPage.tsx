import React from "react";
import loginImg from '../images/imgv2.png';
import '../components/LoginRegister/LoginRegistration.css';
import '../styles/palette/palette.css';
import { RegisterView } from "../components/LoginRegister/RegisterView";
import { useNavigate } from "react-router-dom";

function RegistrationPage() {
    const navigate = useNavigate();
    return (
        <div className="loginBackground">
            <center>
                <div className="loginContainer">
                    <div>
                        <button className='textButton' onClick={() => { navigate("/login") }}>Already a member? Login!</button>
                    </div>
                    <img className="loginContainer__image" src={loginImg} alt="loginImg">
                    </img>
                    <div className="loginContainer__loginBox">
                        <RegisterView></RegisterView>
                    </div>
                </div>
            </center>
        </div>

    );
}

export default RegistrationPage;