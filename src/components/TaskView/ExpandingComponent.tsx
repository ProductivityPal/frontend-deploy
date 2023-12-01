import React from 'react';
import { useState } from 'react'
import expand from '../../images/expand_icon.svg'
import './ExpandingComponent.css';
import { dividerClasses } from '@mui/material';
import { deleteData, putData } from '../../utils/fetchUtils';
import { Button } from '@mui/material';
import { Menu } from '@mui/material';
import { postData } from "../../utils/fetchUtils";
import { AddTaskModal } from './AddTaskModal';
import { Task } from '../../types/Task';

type TaskViewProps = {
    task: Task;
    isExpandable: boolean;
    isEditView: boolean;
    subTasks?: any[];
    isAlgoSort?: boolean;
    index?: number;
    onComplete: () => void;
    openTaskModal: () => void;
    onUpdateTask: (task: Task) => void;
    duration?: number;
}


export function ExpandingComponent(props: TaskViewProps) {
    const [expanded, setExpanded] = useState(false)
    const [expandedCategory, setExpandedCategory] = useState(false)
    const [category, setCategory] = useState(props.task.category)
    const [taskColor, setTaskColor] = useState(convertCategoryToColor(props.task.category))
    const [subtaskName, setSubtaskName] = useState('')
    const [subtasks, setSubtasks] = useState(props.subTasks ? props.subTasks : [])
    const [openAddTaskModal, setOpenAddTaskModal] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleAddTaskClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const addNewTaskAction = (e: React.MouseEvent<HTMLButtonElement>) => {
        setOpenAddTaskModal(true);
        handleAddTaskClick(e);
    }
    const handleAddTaskClose = () => {
        setAnchorEl(null);
        setOpenAddTaskModal(false);
    }

    function completeTask(taskId: number) {
        console.log("complete Task!" + taskId)
        putData<{}, number>(`https://productivitypal-backend.onrender.com/task/${taskId}`, { "completed": true })();

        props.onComplete()
    }
    function deleteTask(taskId: number) {
        console.log("delete Task!" + taskId)
        deleteData<{}, number>(`https://productivitypal-backend.onrender.com/task/${taskId}`, {})();

        props.onComplete()
    }
    const handleUpdateTask = (updatedTask: Task) => {
        props.onUpdateTask(updatedTask);
    }

    function convertCategoryToColor(category: string) {
        switch (category) {
            case 'green':
                return "#707247"
            case 'accent':
                return "#EE7F3B"
            case 'grey':
                return "#E5E5E5"
            default:
                return "#E7C3A1"
        }

    }
    function sendCategory(category: string) {
        // send category to backend
        putData<{}, number>(`https://productivitypal-backend.onrender.com/task/${props.task.id}`, { "category": category })();
        setCategory(category)
        setTaskColor(convertCategoryToColor(category))



    }
    function addSubtask(subtaskName: string) {
        const newSubtask = {
            name: subtaskName,
            subtask: true,
            parentId: props.task.id,
        }
        // todo add category

        setSubtasks([...subtasks, newSubtask]);

        // send to backend
        postData<{}, number>(`https://productivitypal-backend.onrender.com/task/subtask`, newSubtask)();
        console.log("SENDING SUBTASK")

        setSubtaskName('')

    }

    const buttonLowStyle = {
        color: 'black',
        maxWidth: '6px',
        minWidth: '6px',
        "&:hover": { backgroundColor: "#FFFFFF50" },
    }

    return (
        <div className='expand-container' style={{
            height: props.duration ? props.duration : 'auto',
            opacity: props.task.completed ? 0.5 : 1,
            backgroundColor: taskColor + '88',
            border: '2px solid ' + taskColor,
        }}>

            <div className='task-header'
                style={{
                    opacity: props.task.completed ? 0.5 : 1,
                }}>
                <Button sx={buttonLowStyle} onClick={() => deleteTask(props.task.id)}>x</Button>
                {props.isExpandable && <img className="expand-icon" src={expand} alt="expand tasks view" onClick={() => setExpanded(!expanded)} />}
                <button className={`circleButton ${category}`} onClick={() => setExpandedCategory(!expandedCategory)}>
                    {expandedCategory && <div className='category-menu'>
                        <button className='circleButton' onClick={() => sendCategory('beige')} />
                        <button className='circleButton green' onClick={() => sendCategory('green')} />
                        <button className='circleButton accent' onClick={() => sendCategory('accent')} />
                        <button className='circleButton grey' onClick={() => sendCategory('grey')} />
                    </div>}
                </button>
                <div className='task-label'>{props.task.name}</div>
                {!props.task.completed && !props.isEditView && <Button className='basicButton' sx={buttonLowStyle} onClick={() => { completeTask(props.task.id) }}>✓</Button>}
                {props.isEditView && <Button className='basicButton' sx={buttonLowStyle} onClick={addNewTaskAction}>✎</Button>}
                {props.task.completed && <div />}
                <AddTaskModal
                    open={openAddTaskModal}
                    setOpen={setOpenAddTaskModal}
                    anchorEl={anchorEl}
                    setAnchorEl={setAnchorEl}
                    handleClose={handleAddTaskClose}
                    addTask={() => console.log("")}
                    currentTask={props.task}
                    updateTask={(task: Task) => handleUpdateTask(task)}></AddTaskModal>
            </div>

            <div className={expanded ? "expandingComponentExpanded" : "expandingComponentHidden"}>
                <div>
                    {subtasks && subtasks.map((subtask, index) => (
                        <p key={index}>* {subtask.name}</p>
                    ))}
                    <form>
                        <input type="text" value={subtaskName} onChange={(e) => setSubtaskName(e.target.value)} />
                        <button type="button" onClick={() => { addSubtask(subtaskName) }}>Add</button>
                    </form>
                </div>


            </div>


        </div>
    );
}