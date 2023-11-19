import React, { useState, useContext } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Stack from '@mui/material/Stack';
import './TaskContainerView.css';
import { TaskView } from './TaskView';
import { Button } from '@mui/material';
import { Task } from '../../types/Task';
import { useEffect } from 'react';
import { fetchData, putData } from '../../utils/fetchUtils';
import { postData } from '../../utils/fetchUtils';
import { Add } from '@material-ui/icons';
import { AddTaskModal } from './AddTaskModal';
import { Droppable } from 'react-beautiful-dnd';
import { TasksCalendarContext } from '../../utils/tasksCalendarContext'
import '../../styles/styles.css'
import { useNavigate } from 'react-router-dom';

const selectedButtonStyle = (isSelected: Boolean) => isSelected ? {} : { opacity: 0.5 };
const fetchTasks = fetchData<Task[]>('https://productivitypal-56uf.onrender.com/task');
const fetchCalendarTasks = fetchData<Task[]>('https://productivitypal-56uf.onrender.com/calendar/tasks');
const fetchAlgoSortList = (id: String) => fetchData<Task[]>('https://productivitypal-56uf.onrender.com/task/algosort');
const putEnergyLevel = (energyLevel: String) => putData<{}, number>(`https://productivitypal-56uf.onrender.com/user/energyLevel/${energyLevel}`, {});
const TASK_LIST_COMPONENT_ID = "tasksList";

export function TaskContainerView() {

    // Tasks / Sorted View
    const { calendar, moveTask, addTask, setTasks, modifyTask } = useContext(TasksCalendarContext);
    const [usedTasks, setUsedTasks] = useState<number[]>([]);
    const tasksList = calendar[TASK_LIST_COMPONENT_ID].filter(task => task.completed == false && !usedTasks.includes(task.id));
    const [currentView, setCurrentView] = useState('ListView');
    const [energyLevelPopupView, setEnergyLevelPopupView] = useState(true);
    const [isListView, setIsListView] = useState(true);
    const navigate = useNavigate();

    // Editing task
    const [editView, setEditView] = useState(false)

    // Adding new task
    const [openAddTaskModal, setOpenAddTaskModal] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const handleAddTaskClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleAddTaskClose = () => {
        setAnchorEl(null);
        setOpenAddTaskModal(false);
    };
    const handleTaskComplete = (taskIndex: number) => {
        const updatedTasks = [...tasksList];
        updatedTasks.splice(taskIndex, 1);
        setTasks(TASK_LIST_COMPONENT_ID, updatedTasks);
    };


    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const toggleListView = () => {
        setTasks(TASK_LIST_COMPONENT_ID, tasksList);
        setIsListView(true)
        setCurrentView('ListView')
        setEnergyLevelPopupView(true)
    }
    const toggleSortedView = () => {
        setIsListView(false)
        // setTasks(TASK_LIST_COMPONENT_ID, []);
        setCurrentView('SortedView')
    }
    const addNewTaskAction = (e: any) => {
        setOpenAddTaskModal(true)
        handleAddTaskClick(e)
    }
    function editTaskAction(taskId: number) {
        setOpenAddTaskModal(true)
        // handleAddTaskClick(e)
    }
    const showSortedTasksForEnergyLevel = (energyLevel: String) => {
        putEnergyLevel(energyLevel)();
        setTasks(TASK_LIST_COMPONENT_ID, []);
        // fetchAlgoSortList(energyLevel)((tasks) => setTasks(TASK_LIST_COMPONENT_ID, tasks.filter(task => task.completed == false && !usedTasks.includes(task.id))), setIsLoading, setErrorMessage);
        setEnergyLevelPopupView(false);

        fetchAlgoSortList(energyLevel)((tasks: Task[]) => {
            fetchCalendarTasks((calendarTasks: any[]) => {
                // const tasksList = calendar[TASK_LIST_COMPONENT_ID]
                // .filter(task => task.completed == false && !usedTasks.includes(task.id));

                setTasks(TASK_LIST_COMPONENT_ID, tasks.filter(task => !calendarTasks.find(ct => ct.task.id == task.id) && task.completed == false && !usedTasks.includes(task.id)))
                setUsedTasks(calendarTasks.map((calendartT: any) => calendartT.task.id));
            })
        }, setIsLoading, setErrorMessage, navigate)

    }

    const energyButtonLow = {
        backgroundColor: '#b90e0a',
        color: 'white',
    }
    const energyButtonMedium = {
        backgroundColor: '#fa9c1b',
        color: 'white',
    }
    const energyButtonHigh = {
        backgroundColor: '#3b8132',
        color: 'white',
    }

    useEffect(() => {
        fetchTasks((tasks: Task[]) => {
            console.log("FETCH TASKS!")
            fetchCalendarTasks((calendarTasks: any[]) => {
                // const tasksList = calendar[TASK_LIST_COMPONENT_ID]
                // .filter(task => task.completed == false && !usedTasks.includes(task.id));

                setTasks(TASK_LIST_COMPONENT_ID, tasks.filter(task => !calendarTasks.find(ct => ct.task.id == task.id) && task.completed == false))
                console.log("tasks test", tasks.filter(task => !calendarTasks.find(ct => ct.task.id == task.id) && task.completed == false && !usedTasks.includes(task.id)))
                console.log("tasks test", tasks)
                console.log("tasks test", calendarTasks)
                setUsedTasks(calendarTasks.map((calendartT: any) => calendartT.task.id));
            })
        }, setIsLoading, setErrorMessage, navigate)

    }, []);

    return (
        <div className="task-view">
            <div className='tasks-container'>
                <Stack spacing={2} alignItems="center">
                    <ToggleButtonGroup aria-label="Medium sizes" className="toggle">
                        <ToggleButton style={selectedButtonStyle(isListView)} key={1} value="1" onClick={toggleListView}>ListView</ToggleButton>,
                        <ToggleButton style={selectedButtonStyle(!isListView)} key={2} value="2" onClick={toggleSortedView}>SortedView </ToggleButton>
                    </ToggleButtonGroup>
                </Stack>
                {currentView === 'SortedView' && <div>
                    {energyLevelPopupView && <div className='energyPopupContainer'>Select your current energy level:
                        <br></br>
                        <Button style={energyButtonLow} onClick={() => showSortedTasksForEnergyLevel('LOW')}>Low</Button>
                        <Button style={energyButtonMedium} onClick={() => showSortedTasksForEnergyLevel('MEDIUM')}>Medium</Button>
                        <Button style={energyButtonHigh} onClick={() => showSortedTasksForEnergyLevel('HIGH')}>High</Button>
                    </div>}
                </div>}
                <Droppable droppableId={TASK_LIST_COMPONENT_ID} key={TASK_LIST_COMPONENT_ID}>
                    {(provided) => (
                        <div  {...provided.droppableProps} ref={provided.innerRef} >
                            {tasksList.map((task, index) => (
                                
                                <TaskView isExpandable={true}
                                    key={task.id}
                                    task={task}
                                    isEditView={editView} 
                                    isAlgoSort={currentView !== 'ListView'}
                                     index={index}
                                    onComplete={() => handleTaskComplete(index)}
                                    openTaskModal={() => editTaskAction(task.id)} 
                                    onUpdateTask={(newTask: Task) => {
                                        const updateTaskInCalendar = modifyTask(TASK_LIST_COMPONENT_ID, task.id, newTask);
                                      }}/>))}
                            <button onClick={addNewTaskAction} className='ovalActionButton'>Add new task +</button>
                            <button onClick={() => setEditView(!editView)} className='ovalActionButton'>Edit Tasks</button>
                            {provided.placeholder}
                        </div>

                    )}
                </Droppable>
                <AddTaskModal
                    open={openAddTaskModal}
                    setOpen={setOpenAddTaskModal}
                    anchorEl={anchorEl}
                    setAnchorEl={setAnchorEl}
                    handleClose={handleAddTaskClose}
                    addTask={(task: Task) => { addTask(TASK_LIST_COMPONENT_ID, task) }}
                    updateTask={(task: Task) => { setTasks(TASK_LIST_COMPONENT_ID, task) }}
                />


            </div>
        </div>
    );
}