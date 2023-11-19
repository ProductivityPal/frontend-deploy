import React from "react";
import loginImg from '../images/imgv2.png';
import { LoginView } from "../components/LoginRegister/LoginView";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const navigate = useNavigate();
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
                        <LoginView></LoginView>
                    </div>
                </div>
            </center>
        </div>
    );
}

export default LoginPage;