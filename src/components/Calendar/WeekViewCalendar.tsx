import React, { useState } from 'react';
import { Grid } from '@mui/material';
import CalendarDay from './CalendarDay';
import './WeekViewCalendar.css';


const getDateFromToday = (numOfDays: number) => {
    let day = new Date();
    return new Date(day.setDate(day.getDate() + numOfDays));
}
// Returns an array of the next 7 days from today
const getDaysOfTheWeek = () => {
    let daysOfTheWeek = [];
    for (let i = 0; i < 7; i++) {
        daysOfTheWeek.push(getDateFromToday(i));
    }
    return daysOfTheWeek;
}

// todo; add a button to go to the next week

export default function WeekViewCalendar() {
    let [todayDate, setTodayDate] = useState(new Date());
    let daysOfTheWeek = getDaysOfTheWeek();

    return (
        <div className="week-view-calendar">
            <div className="calendar-header">
                <Grid container className='calendar-header-container'>
                    <Grid xs={12.5} md={4} >
                        <div className="calendar-day__header__day-of-the-week">
                            {todayDate.toLocaleString('default', { weekday: 'long' })}
                        </div>
                        <div className="calendar-day__header__date">
                            {todayDate.getDate()}
                        </div>
                    </Grid>
                    {Array.from(Array(4)).map((_, index) => (
                        <Grid item xs={0} sm={2} md={2} key={index}>
                            <div className="calendar-day__header__day-of-the-week">
                                {daysOfTheWeek[index + 1].toLocaleString('default', { weekday: 'long' })}
                            </div>
                            <div className="calendar-day__header__date">
                                {daysOfTheWeek[index + 1].getDate()}
                            </div>
                        </Grid>
                    ))}
                </Grid>

            </div>
            <Grid container className='calendar-container'>
                <Grid xs={0.3} md={0.3}>
                    {Array.from(Array(24)).map((_, index) => (
                        <Grid item xs={0} sm={2} md={2} key={index} style={{height: 61}}>
                            <div className="calendar-hour__header">
                                {index}
                            </div>
                            </Grid>))}
                </Grid>
                <Grid xs={11.7} md={3.7}>
                    <CalendarDay date={todayDate} isToday={true} />
                </Grid>
                {Array.from(Array(4)).map((_, index) => (
                    <Grid item xs={0} sm={2} md={2} key={index}>
                        <CalendarDay date={daysOfTheWeek[index + 1]} isToday={false} />
                    </Grid>
                ))}
            </Grid>



        </div>
    );
}