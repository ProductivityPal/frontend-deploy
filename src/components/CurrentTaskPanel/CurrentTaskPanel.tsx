import React, { useState, useContext, useEffect } from 'react';
import { CurrentTaskView } from './CurrentTaskView';
import { NextTaskView } from './NextTaskView';
import './CurrentTaskPanel.css';
import { fetchData, putData } from '../../utils/fetchUtils';
import { CalendarTask, converDbTaskToTask, convetDbCalendarTaskToCalendarTask, Task } from '../../types/Task';
import { TasksCalendarContext } from '../../utils/tasksCalendarContext';


const fetchCalendarTasks = fetchData<CalendarTask[]>('https://productivitypal-backend.onrender.com/calendar/tasks');
export function CurrentTaskPanel() {
    const [currentTask, setCurrentTask] = useState<CalendarTask | null>()
    const [nextTask, setNextTask] = useState<CalendarTask>()
    const { calendar } = useContext(TasksCalendarContext);
    function handleTaskComplete(taskId: number) {
        console.log("complete Task!" + taskId)
        putData<{}, number>(`https://productivitypal-backend.onrender.com/task/${taskId}`, { "completed": true })();
        setCurrentTask(null)
    }

    function getTime(startTime: Date, endTime: Date) {
        const startFormattedMinutes = String(startTime.getMinutes()).padStart(2, "0");
        const endFormattedMinutes = String(endTime.getMinutes()).padStart(2, "0");

        return startTime.getHours() + ":" + startFormattedMinutes + " - " 
        + endTime.getHours() + ":" + endFormattedMinutes;
    }

    useEffect(() => {

        let now = new Date()

        // Function to filter out past tasks
        const filterPastTasks = (tasks: any) => {
            return tasks.filter((task: any) => new Date(task.startDate) > now);
        };

        // Function to sort tasks by date
        const sortTasksByDate = (tasks: any[]) => {
            return tasks.sort((a: any, b: any) => {
                const dateA = new Date(a.startDate);
                const dateB = new Date(b.startDate);
                return dateA.getTime() - dateB.getTime();
            });
        };

        // get calendar tasks
        // sort by date, and filtering out past tasks
        // check if the first event is happening now
        // get the first / second task from the list ( based on condition before) for nextTaskComponent
        fetchCalendarTasks((calendarTasksListInput: CalendarTask[]) => {
            const calendarTasksList = calendarTasksListInput.map(convetDbCalendarTaskToCalendarTask)
            console.log('calendarTasksList', calendarTasksList)
            const sortedTasks = sortTasksByDate(calendarTasksList).filter((task: CalendarTask) => task.endDate.getTime() > now.getTime())
            console.log('sortedTasks', sortedTasks)


            // if now >= startTime && now <= endTime
            if (sortedTasks.length > 0 && new Date(sortedTasks[0].startDate).getTime() <= now.getTime() &&  now.getTime() <= sortedTasks[0].endDate.getTime()) {
                // Get the second task if the first is happening now
                setCurrentTask(sortedTasks[0])
                console.log("CURRENT TASK: " + (currentTask ? currentTask.task.name : ""))
                setNextTask(sortedTasks[1] || null);
                console.log("Next TASK: " + (nextTask ? nextTask.task.name : ""))

              } else {
                // Get the first task
                setNextTask(sortedTasks[0] || null);
                console.log("Next TASK: " + (sortedTasks[0].task.name))

            }
            // TODO: add check for next task of the day / you are caught up for the day!
    })
    }, [calendar]);

    return (
        <div className="current-task-panel">
            {/* {nextTask && <CurrentTaskView taskId={nextTask.task.id}taskName={nextTask.task.name} startTime={nextTask.startDate} onComplete={() => completeTask()}/>} */}
            {currentTask && <CurrentTaskView taskId={currentTask.task.id} taskName={currentTask.task.name} startTime={getTime(new Date(currentTask.startDate), currentTask.endDate)} onComplete={() => handleTaskComplete(currentTask.task.id)}/>}
            {<NextTaskView taskName={nextTask ? nextTask.task.name : "You have no more tasks!"} startTime={nextTask ? getTime(new Date(nextTask.startDate), nextTask.endDate) : ""}/>}
            
        </div>
    );
}