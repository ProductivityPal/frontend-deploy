import React, { useState, useContext } from 'react';
import './CalendarHour.css';
import { Droppable } from 'react-beautiful-dnd';
import { TaskView } from '../TaskView/TaskView'
import { TasksCalendarContext } from '../../utils/tasksCalendarContext';
import { formatDate } from './CalendarDay';
import { Task } from '../../types/Task';

export const getId = (hour: string, minutes: string, date: string) => `${hour}:${minutes === "0" ? "00" : minutes}-${date}`;

export const converDateToDestinationId = (date: Date) => getId(date.getHours().toString(), date.getMinutes().toString(), formatDate(date));

export default function CalendarHour({ hour, date }: { hour: string, date: string }) {

    const { calendar, moveTask, addTask, setTasks } = useContext(TasksCalendarContext);
    const [openAddTaskModal, setOpenAddTaskModal] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    function editTaskAction(taskId: number) {
        setOpenAddTaskModal(true)
        // handleAddTaskClick(e)
    }
    
    const handleAddTaskClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleAddTaskClose = () => {
        setAnchorEl(null);
        setOpenAddTaskModal(false);
    };

    const handleTaskComplete = (taskId: number) => {
        const task = calendar.tasksList.filter(t => t.id == taskId).map(t => t.completed = true)
    }
    const handleTaskDelete = (taskIndex: number) => {
        // TODO
    }
    const handleUpdateTask = (updatedTask: Task) => {
        setTasks(updatedTask);
    };

    const id1 = getId(hour, "00", date);
    const id2 = getId(hour, "15", date);
    const id3 = getId(hour, "30", date);
    const id4 = getId(hour, "45", date);

    const tasksList1 = calendar[id1] ? calendar[id1] : [];
    const tasksList2 = calendar[id2] ? calendar[id2] : [];
    const tasksList3 = calendar[id3] ? calendar[id3] : [];
    const tasksList4 = calendar[id4] ? calendar[id4] : [];

    return (
        <div className="calendar-hour">
            <Droppable droppableId={id1} key={id1}>
                {(provided) => (
                    <div className='fifteen-min-block' ref={provided.innerRef} {...provided.droppableProps} >
                        {tasksList1.map((task, index) => (
                            <TaskView
                            task={task}    
                            isExpandable={false}
                                isEditView={false}
                                key={task.id}
                                duration={task.timeEstimate ? task.timeEstimate : task.time_estimate}
                                index={index}
                                onComplete={() => handleTaskComplete(task.id)}
                                openTaskModal={() => editTaskAction(task.id)}
                                onUpdateTask={handleUpdateTask}
                                 />))}
                    </div>
                )}
            </Droppable>
            <Droppable droppableId={id2} key={id2}>
                {(provided) => (
                    <div className='fifteen-min-block' ref={provided.innerRef} {...provided.droppableProps} >
                        {tasksList2.map((task, index) => (
                            <TaskView
                            task={task}    
                            isExpandable={false}
                                isEditView={false} key={task.id}
                                duration={task.timeEstimate ? task.timeEstimate : task.time_estimate}
                                index={index}
                                onComplete={() => handleTaskComplete(index)}
                                openTaskModal={() => editTaskAction(task.id)}
                                onUpdateTask={handleUpdateTask} />))}
                    </div>
                )}
            </Droppable>
            <Droppable droppableId={id3} key={id3}>
                {(provided) => (
                    <div className='fifteen-min-block' ref={provided.innerRef} {...provided.droppableProps} >
                        {tasksList3.map((task, index) => (
                            <TaskView
                            task={task}    
                            isExpandable={false}
                                isEditView={false}
                                key={task.id}
                                duration={task.timeEstimate ? task.timeEstimate : task.time_estimate}
                                index={index}
                                onComplete={() => handleTaskComplete(index)}
                                openTaskModal={() => editTaskAction(task.id)}
                                onUpdateTask={handleUpdateTask} />))}
                    </div>
                )}
            </Droppable>
            <Droppable droppableId={id4} key={id4}>
                {(provided) => (
                    <div className='fifteen-min-block' ref={provided.innerRef} {...provided.droppableProps} >
                        {tasksList4.map((task, index) => (
                            <TaskView
                            task={task}    
                            isExpandable={false}
                                isEditView={false}
                                key={task.id}
                                duration={task.timeEstimate ? task.timeEstimate : task.time_estimate}
                                index={index}
                                onComplete={() => handleTaskComplete(index)}
                                openTaskModal={() => editTaskAction(task.id)}
                                onUpdateTask={handleUpdateTask}
                                />))}
                                
                    </div>
                )}
            </Droppable>
            <p className='divider'></p>
        </div>
    );
}
