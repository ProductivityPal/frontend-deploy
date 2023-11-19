import React, { useEffect } from 'react';
import './App.css';
import WeekViewCalendar from './components/Calendar/WeekViewCalendar';
import { TaskContainerView } from './components/TaskView/TaskContainerView';
import { NavigationMenu } from './components/NavigationMenu/NavigationMenu';
import { Grid } from '@mui/material';
import './App.css';
import { DragDropContext } from 'react-beautiful-dnd';
import { useContext, useState } from 'react';
import { addTask, moveTask, setTasks, TasksCalendarContext } from './utils/tasksCalendarContext';
import { CurrentTaskPanel } from './components/CurrentTaskPanel/CurrentTaskPanel';
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import CalendarPage from './pages/CalendarPage';
import SettingsPage from "./pages/SettingsPage";
import StatisticsPage from "./pages/StatisticsPage";
import { useLocalState } from './utils/useLocalStorage';
import { LoggedOutView } from './components/LoginRegister/LoggedOutView';
import { EmailConfirmedView } from './components/LoginRegister/EmailConfirmedView';

function App() {

    // const [calendar, setCalendar] = useState({ tasksList: [] });
    // const calendarContext = { calendar, moveTask: moveTask(setCalendar), addTask: addTask(setCalendar), setTasks: setTasks(setCalendar) }
    const [calendarId, setCalendarId] = useState()
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/register" />} />
            <Route path="/login" Component={LoginPage} />
            <Route path="/loggedOut" Component={LoggedOutView} />
            <Route path="/register" Component={RegistrationPage} />
            <Route path="/calendar" Component={CalendarPage} />
            <Route path="/settings" Component={SettingsPage} />
            <Route path="/statistics" Component={StatisticsPage} />
            <Route path="/email/verification/verify" Component={EmailConfirmedView} />

        </Routes>
    );
}

export default App;