import React, { useState, useContext } from 'react';
import './NextTaskView.css';

type NextTaskProps = {
    taskName: string;
    startTime: string;
    endTime?: Date;
}

export function NextTaskView(props: NextTaskProps) {
    return (
        <div className='TaskPanelContainer'>
            <p>Your next task:</p>
            <h2>{props.taskName}</h2>
                <p className="TimeLabel">{props.startTime}</p>
        </div>
    );
}