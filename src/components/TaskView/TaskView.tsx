import React from 'react';
import './TaskView.css';
import { Button } from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';
import "../../styles/styles.css"
import { putData } from '../../utils/fetchUtils';
import expand from '../../images/expand_icon.svg'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExpandingComponent } from './ExpandingComponent';
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

export function TaskView(props: TaskViewProps) {
    const [SubtasksShowState, setSubtasksShowState] = React.useState('Show subtasks');
    const toggleSubtasks = () => {
        if (SubtasksShowState === 'Show subtasks') {
            setSubtasksShowState('Hide subtasks');
        } else {
            setSubtasksShowState('Show subtasks');
        }
    }
    const handleUpdateTask = (updatedTask: Task) => {
        props.onUpdateTask(updatedTask);
    }


    return (
        <Draggable draggableId={(props.task.id).toString()} index={props.index ? props.index : 0} key={props.task.id}>
            {(provided) => (
                <div className='task-body' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} key={props.task.name} >
                    <ExpandingComponent duration={props.duration} key={props.task.id} 
                    task={props.task}
                    isExpandable={props.isExpandable} 
                    isEditView={props.isEditView} 
                    index={props.index} 
                    isAlgoSort={props.isAlgoSort} 
                    onComplete={() => props.onComplete()} 
                    openTaskModal={() => props.openTaskModal()}
                    onUpdateTask={(task: Task) => handleUpdateTask(task)}/>
                </div>
            )}

        </Draggable>
    );
}
