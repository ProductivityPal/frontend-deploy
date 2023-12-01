import React from 'react';
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import './NavigationMenu.css';
import logo from '../../images/logo.png';
import history from '../../images/history.png';
import settings from '../../images/settings_icon.svg';
import calendar from '../../images/calendar_icon.png';
import logout from '../../images/off_icon2.png';
import energy from '../../images/energy_icon.png';
import Popover from '@mui/material/Popover';
import DiscreteSliderMarks from '../SharedComponents/EnergyLevelSlider';
import { Button } from '@mui/material';
import { postData, putData } from '../../utils/fetchUtils';


type ModalProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    anchorEl: HTMLButtonElement | null;
    setAnchorEl: (anchorEl: HTMLButtonElement | null) => void;
    handleClose: () => void;
}

export function NavigationMenu() {
    const navigate = useNavigate();
    const [expandedEnergyPanel, setExpandedEnergyPanel] = useState(false)
    const [energyLevel, setEnergyLevel] = useState('MEDIUM')

    function logoutUser() {
        localStorage.removeItem('jwt');
        navigate("/login");
    }

    function sendEnergyLevel() {
        setExpandedEnergyPanel(false)
        putData<{}, number>(`https://productivitypal-backend.onrender.com/user/energyLevel/${energyLevel}`, energyLevel)();
    }

    const handleEnergyChange = (value: any) => {
        setEnergyLevel(value);
        console.log("ENERGY: ", value)
    };

    return (
        <div className='menuContainer energyType'>
            <div className='menuContainer_options'>
                <img className="logo" src={calendar} alt="Calendar view" onClick={() => { navigate("/calendar") }} />
                <img className="logo" src={history} alt="Statistics and history" onClick={() => { navigate("/statistics") }}/>
                <img className='logo' src={settings} alt="Settings" onClick={() => { navigate("/settings") }} />
                <img className='logo' src={energy} alt="energy level" onClick={() => { setExpandedEnergyPanel(!expandedEnergyPanel) }} />
                {expandedEnergyPanel &&
                    <Popover
                        open={expandedEnergyPanel}
                        anchorEl={null}
                        onClose={() => setExpandedEnergyPanel(false)}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    ><div className='energyModal'>
                        <p>Your current energy level:</p>
                        <DiscreteSliderMarks sendEnergy={handleEnergyChange}></DiscreteSliderMarks>
                        <Button onClick={() => {sendEnergyLevel()}}>Update your energy</Button></div></Popover>}
            </div>
            <img className="logo" src={logout} alt="Logout" onClick={() => { logoutUser() }} />
        </div>);
}