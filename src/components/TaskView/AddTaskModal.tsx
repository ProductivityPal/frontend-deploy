import React from "react";
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import { postData, putData } from "../../utils/fetchUtils";
import './AddTaskModal.css';
import { Task } from "../../types/Task";
import NumberInput from "../SharedComponents/NumberInput"


type AddTaskModalProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    anchorEl: HTMLButtonElement | null;
    setAnchorEl: (anchorEl: HTMLButtonElement | null) => void;
    handleClose: () => void;
    addTask: (task: Task) => void;
    currentTask?: Task;
    updateTask: (task: Task) => void;
}
type NewTaskProps = {
    name: String;
    priority: Number;
    difficulty: String;
    deadline: Date;
    likeliness: String;
    isParent: Boolean;
    completionTime: Number;
    timeEstimate: Number;
    appUser: {
        id: Number;
    };
}

const postNewTask = (newTask: NewTaskProps) => postData<{}, number>('https://productivitypal-backend.onrender.com/task', { ...newTask, time_estimate: newTask.timeEstimate });
const selectedButtonStyle = (isSelected: Boolean) => isSelected ? {} : { opacity: 0.5 };

export function AddTaskModal(props: AddTaskModalProps) {
    const [taskName, setTaskName] = React.useState(props.currentTask ? props.currentTask.name : '');
    const [priority, setPriority] = React.useState(props.currentTask ? props.currentTask.priority : 1);
    const [difficulty, setDifficulty] = React.useState(props.currentTask ? props.currentTask.difficulty : 'MEDIUM');
    const [deadline, setDeadline] = React.useState(props.currentTask ? new Date(props.currentTask.deadline) : new Date());
    const [likeliness, setLikeliness] = React.useState(props.currentTask ? props.currentTask.likeliness : 'NEUTRAL');
    const [isParent, setIsParent] = React.useState(false);
    // Time Estimate is in minutes!
    const [timeEstimate, setTimeEstimate] = React.useState(props.currentTask ? props.currentTask.timeEstimate : 15);

    const onSave = () => {
        const taskId = props.currentTask ? props.currentTask.id : ''
        const newTaskData = {
            name: taskName,
            priority,
            difficulty,
            deadline,
            likeliness,
            isParent,
            completionTime: 0,
            timeEstimate,
            isSubtask: false,
            completed: false,
            category: "beige",
            appUser: {
                id: 5,
            },
        };
        if (taskId == "") {
            saveTask(newTaskData)
        }
        else {
            updateTask(taskId, newTaskData)
        }
        props.handleClose()
        setTaskName('')
        setPriority(1)
        setDifficulty('MEDIUM')
        setDeadline(new Date())
        setLikeliness('NEUTRAL')
        setTimeEstimate(30)

    };

    const updateTask = (taskId: number, newTaskData: any) => {
        // id to path
        putData<{}, number>(`https://productivitypal-backend.onrender.com/task/${taskId}`, { ...newTaskData })();
        // TODO
        // props.updateTask({...newTaskData})
    }
    const saveTask = (newTaskData: any) => {
        postNewTask(newTaskData)((id) => {
            props.addTask({
                id,
                ...newTaskData
            });
        });

    }

    const buttonImportantStyle = {
        backgroundColor: '#D5C7AE',
        color: 'white',
        "&:hover": { backgroundColor: "#F8DEB3" }
    }
    const buttonMediumStyle = {
        backgroundColor: '#D5C7AE',
        color: 'white',
        "&:hover": { backgroundColor: "#F8DEB3" },
    }
    const buttonLowStyle = {
        backgroundColor: '#D5C7AE',
        color: 'white',
        "&:hover": { backgroundColor: "#F8DEB3" },
    }
    const subtasksButton = {
        backgroundColor: '#EE7F3B',
        color: 'white',
        "&:hover": { backgroundColor: "#F8DEB3" },
        width: '100%',
    }
    const inputStyle = {
        width: '95%',
        padding: '5px',
        margin: '5px',
    }

    return (
        <div>
            <Popover
                open={props.open}
                anchorEl={props.anchorEl}
                onClose={props.handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <div className="add-task-header" >

                    <h3>{props.currentTask ? "Edit Task" : "Add new Task"}</h3>
                    <Button onClick={props.handleClose}>X</Button>
                </div>
                <div className="add-task-body">
                    <div className="add-task-body-row">
                        <div className="add-task-body-row-label">Task name</div>
                        <Input sx={inputStyle} type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
                    </div>
                    <div className="add-task-body-row">
                        <div className="add-task-body-row-label">Choose Priority:</div>
                        <div className="add-task-body-row-buttons">
                            <Button style={selectedButtonStyle(priority == 5)} sx={buttonImportantStyle} onClick={() => { setPriority(5) }}>5</Button>
                            <Button style={selectedButtonStyle(priority == 4)} sx={buttonImportantStyle} onClick={() => { setPriority(4) }}>4</Button>
                            <Button style={selectedButtonStyle(priority == 3)} sx={buttonMediumStyle} onClick={() => { setPriority(3) }}>3</Button>
                            <Button style={selectedButtonStyle(priority == 2)} sx={buttonLowStyle} onClick={() => { setPriority(2) }}>2</Button>
                            <Button style={selectedButtonStyle(priority == 1)} sx={buttonLowStyle} onClick={() => { setPriority(1) }}>1</Button>
                        </div>
                    </div>
                    <div className="add-task-body-row">
                        <div className="add-task-body-row-label">Choose Difficuty:</div>
                        <div className="add-task-body-row-buttons">
                            <Button style={selectedButtonStyle(difficulty == 'EASY')} sx={buttonLowStyle} onClick={() => { setDifficulty("EASY") }} variant="contained">Easy</Button>
                            <Button style={selectedButtonStyle(difficulty == 'MEDIUM')} sx={buttonMediumStyle} onClick={() => { setDifficulty("MEDIUM") }}>Medium</Button>
                            <Button style={selectedButtonStyle(difficulty == 'HARD')} sx={buttonImportantStyle} onClick={() => { setDifficulty("HARD") }}>Hard</Button>
                            <Button style={selectedButtonStyle(difficulty == 'EXTRA_HARD')} sx={buttonImportantStyle} onClick={() => { setDifficulty("EXTRA_HARD") }}>Extra Hard</Button>
                        </div>

                    </div>
                    <div className="add-task-body-row">
                        <Input sx={inputStyle} type="date" value={deadline.toISOString().split('T')[0]} onChange={(e) => setDeadline(new Date(e.target.value))} />
                    </div>
                    <div className="add-task-body-row">
                        <div className="add-task-body-row-label">How much do you like this task?</div>
                        <div className="add-task-body-row-buttons">
                            <Button style={selectedButtonStyle(likeliness == 'LOVE')} sx={buttonLowStyle} onClick={() => { setLikeliness("LOVE") }}>Love</Button>
                            <Button style={selectedButtonStyle(likeliness == 'LIKE')} sx={buttonLowStyle} onClick={() => { setLikeliness("LIKE") }}>Like</Button>
                            <Button style={selectedButtonStyle(likeliness == 'NEUTRAL')} sx={buttonMediumStyle} onClick={() => { setLikeliness("NEUTRAL") }}>Neutral</Button>
                            <Button style={selectedButtonStyle(likeliness == 'DISLIKE')} sx={buttonImportantStyle} onClick={() => { setLikeliness("DISLIKE") }}>Dislike</Button>
                            <Button style={selectedButtonStyle(likeliness == 'HATE')} sx={buttonImportantStyle} onClick={() => { setLikeliness("HATE") }}>Hate</Button>
                        </div>

                    </div>
                    <div className="add-task-body-row">
                        <div className="add-task-body-row-label">How long will it take?</div>
                        {/* <NumberInput endAdornment={<InputAdornment>kg</InputAdornment>} /> */}
                        <NumberInput onIncrementChange={setTimeEstimate} />
                        {/* <Input sx={inputStyle} type="number" value={timeEstimate} onChange={(e) => setTimeEstimate(parseInt(e.target.value))}/> */}
                    </div>
                    {/* <div className="add-task-body-row">
                        <Button sx={subtasksButton}>Add Subtaks +</Button>
                    </div> */}
                    <div className="add-task-body-row">
                        <Button sx={subtasksButton}
                            disabled={deadline.getTime() < (Date.now() - 24 * 3600 * 1000) || !priority || !likeliness || !difficulty || !taskName}
                            onClick={onSave}>Save This Task</Button>
                    </div>
                </div>

            </Popover>
        </div>);
}