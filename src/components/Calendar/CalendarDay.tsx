import React, { useState } from 'react';
import { Grid } from '@mui/material';
import './CalendarDay.css';
import CalendarHour from './CalendarHour';
import { Droppable } from 'react-beautiful-dnd';

type CalendarDayProps = {
    date: Date,
    isToday?: boolean;
}

export const formatDate = (date: Date) => date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

export default function CalendarDay(calendarDayProps: CalendarDayProps) {
    
    return (
        <div className="calendar-day">
            <div className="calendar-day__body">
                <div className="calendar-day__body__events">
                    <p className='divider'></p>
                    {Array.from(Array(23)).map((_, index) => (
                        <div className="calendar-hour">
                            <CalendarHour hour={(index).toString()} date={formatDate(calendarDayProps.date)}/>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}