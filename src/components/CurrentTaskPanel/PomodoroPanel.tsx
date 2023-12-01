import { Button } from "@mui/material"
import React, { useEffect } from "react"
import { useState } from "react"
import './PomodoroPanel.css'
import { postData } from "../../utils/fetchUtils"

type PomdoroProps = {
    taskId: number;
    closePanel: () => void;
}

export function PomodoroPanel(props: PomdoroProps) {
    const [pomodoroStart, setPomodoroStart] = useState(false)
    const [isPomodoro, setIsPomodoro] = useState(true)
    const [pomodoroIcon, setPomodoroIcon] = useState(isPomodoro ? "🍅" : "☕️")
    const [pomodoroLabel, setPomodoroLabel] = useState(isPomodoro ? "break" : "pomodoro")

    // var pomodoroTimeSum = 0
    const initialTime = 25 * 60
    const breakTime = 5 * 60
    const [time, setTime] = useState(initialTime)
    const [timerRunning, setTimerRunning] = useState(false)
    const [pomodoroTime, setPomodoroTime] = useState(0)

    useEffect(() => {
        let interval: any;

        if (timerRunning && time > 0) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime - 1)

            }, 1000)
        }

        if (time === 0) {
            // Handle timer completion, e.g., play a sound or show a notification.

            const timerType = isPomodoro ? "break" : "pomodoro"
            resetTimer(timerType)
            setPomodoroStart(!pomodoroStart)

            clearInterval(interval)
            setTimerRunning(false)
        }

        return () => clearInterval(interval);
        startTimer()
    }, [timerRunning, time])

    const startTimer = () => {
        setTimerRunning(true)
        setPomodoroStart(true)
    };

    const pauseTimer = () => {
        setTimerRunning(false)
        setPomodoroStart(false)
    };

    const endTimer = () => {
        setTimerRunning(false)
        // TODO: FIX time sum bug
        const pomodoroTimeSum = (pomodoroTime + (isPomodoro ? (initialTime - time) : 0)) / 60
        setPomodoroTime(pomodoroTimeSum)
        console.log("Pomodoro time 2: ", pomodoroTimeSum)

        // TODO: send to backend
        postData<{}, number>(`https://productivitypal-backend.onrender.com/task/pomodoro`, {taskId: props.taskId, completionTime: pomodoroTimeSum})();
        // divide time by 60
        props.closePanel()
    }

    const resetTimer = (type: string) => {
        setIsPomodoro(!isPomodoro)
        setPomodoroStart(timerRunning ? !pomodoroStart : pomodoroStart)
        // TODO: FIX time sum bug
        const pomodoroTimeSum = pomodoroTime + (isPomodoro ? (initialTime-time) : 0)
        setPomodoroTime(pomodoroTimeSum)
        console.log("Pomodoro time 3: ", pomodoroTimeSum)
        const timeLen = type == "pomodoro" ? initialTime : breakTime
        setPomodoroIcon(isPomodoro ? "☕️" : "🍅")
        setPomodoroLabel(isPomodoro ? "pomodoro" : "break")

        setTimerRunning(false)
        setTime(timeLen)
    };

    const buttonStyle = {
        backgroundColor: '#F8DEB3',
        color: '#81897d',
        width: '32%',
        'border-radius': '50px',
        'font-size': 'x-small',
        'margin-right': '2px',
        height: '30px',
        'line-height': '12px',
        'margin-top': '5px',
        'margin-bottom': '5px',
        "&:hover": { backgroundColor: "#FFFFFF50", 'border': '1px solid #F8DEB3' },
    }
    return (
        <div>
            {/* {!pomodoroStart && <Button sx={buttonStyle} onClick={}>Start Timer</Button>} */}
            {<div className="pomodoro-container">
                <div className="timer-row">
                    {pomodoroIcon} {Math.floor(time / 60).toString().padStart(2, '0')}:
                    {(time % 60).toString().padStart(2, '0')}
                </div>
                <div className="menu-row">
                    {!pomodoroStart && <Button sx={buttonStyle} onClick={() => startTimer()}>start</Button>}
                    {pomodoroStart && <Button sx={buttonStyle} onClick={() => pauseTimer()}>pause</Button>}
                    <Button sx={buttonStyle} onClick={() => resetTimer(pomodoroLabel)}>{pomodoroLabel}</Button>
                    <Button sx={buttonStyle} onClick={() => endTimer()}>end</Button>
                </div>
            </div>}
        </div>


    )

}