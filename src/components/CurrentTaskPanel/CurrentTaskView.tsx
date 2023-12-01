import React, { useState, useContext, useEffect } from 'react';
import './CurrentTaskView.css';
import { Button, dividerClasses } from '@mui/material';
import { fetchData, putData } from '../../utils/fetchUtils';
import { Task } from '../../types/Task';
import { PomodoroPanel } from './PomodoroPanel';

type CurrentTaskProps = {
    taskId: number;
    taskName?: string;
    startTime: string;
    endTime?: Date;
    onComplete: () => void;
}

export function CurrentTaskView(props: CurrentTaskProps) {
    const [subtaskList, setSubtaskList] = useState<String[]>([])
    const [pomodoroPanel, setPomodoroPanel] = useState(false)
    const buttonStyle = {
        backgroundColor: '#F8DEB3',
        color: '#81897d',
        width: '40%',
        'border-radius': '50px',
        'font-size': 'x-small',
        'margin-right': '2px',
        height: '30px',
        'line-height': '12px',
        'margin-top': '5px',
        'margin-bottom': '5px',
        "&:hover": {backgroundColor: "#FFFFFF50", 'border': '1px solid #F8DEB3'},
    }
    useEffect(() => {
        // const fetchSubtasks = fetchData<Task[]>(`https://productivitypal-backend.onrender.com/${props.taskId}/task/subtask`)
        // fetchSubtasks((subtasks: Task[]) => {
        //     const subtaskList = subtasks.map((subtask) => subtask.name)
        //     setSubtaskList(subtaskList)

        // })
    }, []);

    function startPomodoro() {
        setPomodoroPanel(true)
        // send Pomodoro start to backend
        // start Timer
        // after 20 minutes break

    }
    
    return (
        <div className='TaskPanelContainer'>
            <p>Your current task:</p>
            <div>
                <h1>{props.taskName}</h1>
                <p className="TimeLabel">{props.startTime}</p>
            </div>
            <hr></hr>
            <div>{subtaskList && subtaskList.map((subtask) => (<li>subtask.name</li>))}</div>

            <div className='ButtonContainer'>
                {!pomodoroPanel && <Button sx={buttonStyle} onClick={() => startPomodoro()}>Pomodoro</Button>}
                {pomodoroPanel && <PomodoroPanel taskId={props.taskId} closePanel={() =>setPomodoroPanel(false)}></PomodoroPanel>}
                {/* <Button sx={buttonStyle}>Add subtask</Button> */}
                {!pomodoroPanel && <Button sx={buttonStyle} onClick={() => props.onComplete()}>✔️</Button>}
            </div>
        </div>
        
    );
}