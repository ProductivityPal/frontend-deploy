import { Task } from '../types/Task'
import { createContext } from 'react';
import { postData, putData } from './fetchUtils';
import { duration } from 'moment';

type TasksCalendarContextType = {
    calendar: { [key: string]: Task[], tasksList: Task[] },
    // for moving tasks between days or from tasklist
    moveTask: any,
    // for adding one task from backend to calendar
    addTask: any,
    // for adding multiple tasks from backend to calendar
    setTasks: any,
    modifyTask: any,
}

export const TasksCalendarContext = createContext<TasksCalendarContextType>({
    calendar: {
        tasksList: []
    },
    moveTask: () => { },
    addTask: () => { },
    setTasks: () => { },
    modifyTask: () => { }

});


const swapElements = (arr: any[], index1: number, index2: number) => {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
};

const swapTasks = (arr: Task[], fromIndex: number, toIndex: number) => {
    if (fromIndex > toIndex) {
        for (let i = fromIndex; i > toIndex; i--) {
            swapElements(arr, i, i - 1)
        }
    }
    if (fromIndex < toIndex) {
        for (let i = fromIndex; i < toIndex; i++) {
            swapElements(arr, i, i + 1)
        }
    }
    return arr;
}

function convertDateFormat(inputDate: string, duration = 0): string {
    const parts = inputDate.split('-');
    if (parts.length < 2) {
        throw new Error("Invalid input date format");
    }

    // Extract the time and date
    const time = parts[0].trim();

    const dateComponents = parts.slice(1).join('-').trim().split('-').map(part => parseInt(part));
    if (dateComponents.length !== 3 || dateComponents.includes(NaN)) {
        throw new Error("Invalid date components");
    }

    const [year, month, day] = dateComponents;
    // Format the date in the desired format
    const formattedMonth = month.toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');
    const formattedTime = time.padStart(5, '0');

    const result = `${year}-${formattedMonth}-${formattedDay}T${formattedTime}`;

    return result;
}

export const moveTask = (setCalendar: any) => (from: { droppableId: string, index: number }, to: { droppableId: string, index: number }, taskId: number) => {

    // Can send request to backend here
    console.log(`Move task with id ${taskId} from ${from.droppableId}`)
    console.log(`Add task with id ${taskId} to date ${to.droppableId}`)
    console.log(`Add task with id ${taskId} to date ${convertDateFormat(to.droppableId)}`)
   
    if (from.droppableId != 'tasksList') {
        putData<{}, number>(`https://productivitypal-backend.onrender.com/calendar/task/${taskId}`, { "startDate": convertDateFormat(to.droppableId)})();
    }
    else {
        postData<{}, number>(`https://productivitypal-backend.onrender.com/calendar/task/${taskId}`, { "startDate": convertDateFormat(to.droppableId),
        /*"endDate": convertDateFormat(to.droppableId, duration_here!), */ })();
    }

    if (from && to && from.droppableId == to.droppableId && from.droppableId == "tasksList") {
        setCalendar((cal: any) => ({
            ...cal,
            tasksList: swapTasks(cal['tasksList'], from.index, to.index)
        }))
    }

    if (from && to && from.droppableId != to.droppableId) {
        setCalendar((cal: any) => {
            const newCal = { ...cal };

            if (!newCal[to.droppableId]) {
                newCal[to.droppableId] = []
            }
            newCal[to.droppableId].splice(to.index, 0, newCal[from.droppableId][from.index]);
            return {
                ...newCal,
                [from.droppableId]: newCal[from.droppableId].filter((task: Task) => task.id != taskId),
            }
        })
    }
}

export const addTask = (setCalendar: any) => (destinationId: string, task: Task) => {
    setCalendar((cal: any) => {
        const newCal = { ...cal };
        if (!newCal[destinationId]) {
            newCal[destinationId] = []
        }
        console.log("Sophie", task)
        newCal[destinationId].push(task);
        return newCal;
    })
}

export const setTasks = (setCalendar: any) => (destinationId: string, tasks: Task[]) => {
    setCalendar((cal: any) => {
        const newCal = { ...cal };
        newCal[destinationId] = tasks;
        return newCal;
    })
}

export const modifyTask = (setCalendar: any) => (destinationId: string, taskId: number, updatedTask: Task) => {
    setCalendar((cal: any) => {
      const newCal = { ...cal };
  
      if (newCal[destinationId]) {
        const originalIndex = newCal[destinationId].findIndex((t: Task) => t.id === taskId);
  
        if (originalIndex !== -1) {
          newCal[destinationId][originalIndex] = { ...newCal[destinationId][originalIndex], ...updatedTask };
        }
      }
  
      return newCal;
    });
  }
  