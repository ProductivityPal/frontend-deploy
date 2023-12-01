import React from 'react';
// import './App.css';
import WeekViewCalendar from '../components/Calendar/WeekViewCalendar';
import { TaskContainerView } from '../components/TaskView/TaskContainerView';
import { NavigationMenu } from '../components/NavigationMenu/NavigationMenu';
import { Grid } from '@mui/material';
import { DragDropContext } from 'react-beautiful-dnd';
import { useContext, useState } from 'react';
import { addTask, modifyTask, moveTask, setTasks, TasksCalendarContext } from '../utils/tasksCalendarContext';
import { CurrentTaskPanel } from '../components/CurrentTaskPanel/CurrentTaskPanel';
import { fetchData } from '../utils/fetchUtils';
import { Task, converDbTaskToTask } from '../types/Task';
import { useEffect } from 'react';
import { converDateToDestinationId } from '../components/Calendar/CalendarHour';
import { useNavigate } from 'react-router-dom';

 function CalendarPage() {
  const fetchTasks = fetchData<Task[]>('https://productivitypal-backend.onrender.com/calendar/tasks');
  const [calendar, setCalendar] = useState({ tasksList: [] });
  const calendarContext = { calendar, moveTask: moveTask(setCalendar), addTask: addTask(setCalendar), setTasks: setTasks(setCalendar), modifyTask: modifyTask(setCalendar) }
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks((tasks: Task[]) => {
      tasks.forEach((calendarTask: any) => {
        const task = converDbTaskToTask(calendarTask.task);
        console.log(new Date(calendarTask.startDate), calendarTask.startDate)
        const destinationId = converDateToDestinationId(new Date(calendarTask.startDate));
        console.log({ destinationId, task })
        calendarContext.addTask(destinationId, task)
      })
      console.log(tasks);
    }, () => {}, () => {}, navigate);
}, []);

  return (
    <div className="App">
      <DragDropContext onDragEnd={(result, provided) => {
        if(result.source && result.destination) {
          try {
            calendarContext.moveTask(result.source, result.destination, parseInt(result.draggableId))
          } catch(e) {
            console.error("could not move task", e);
          }
        }
      }}>
        <TasksCalendarContext.Provider value={calendarContext}>
          <Grid container spacing={0}>
            <Grid xs={0.5} md={0.5}>
              <NavigationMenu />
            </Grid>
            <Grid xs={4} md={2}>
              <TaskContainerView />
            </Grid>
            <Grid xs={2} md={7}>
              <WeekViewCalendar />
            </Grid>
            <Grid xs={4} md={2}>
              <CurrentTaskPanel/>
            </Grid>
          </Grid>
        </TasksCalendarContext.Provider>
      </DragDropContext>
    </div>
  );
}

export default CalendarPage;
