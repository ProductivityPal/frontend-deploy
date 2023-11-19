export type Task = {
    id: number;
    name: string;
    description?: string;
    priority: number;
    difficulty: string;
    likeliness: string;
    deadline: Date;
    timeEstimate: number;
    completionTime?: number;
    isSubtask: boolean;
    isParent: boolean;
    completed: boolean;
    parentId?: number;
    category: string;
    startDate?: Date;
    time_estimate?: number;
    //todo: time estimate can be a sum of subtasks and modified by difficulty
}

export const convetDbCalendarTaskToCalendarTask = (ct: any): CalendarTask => ({
    ...ct,
    endDate: new Date(new Date(ct.startDate).getTime() + ct.task.time_estimate * 60 * 1000),
    task: converDbTaskToTask(ct.task)
})

export type CalendarTask = {
    startDate: Date;
    endDate: Date;
    task: Task;
}

export const converDbTaskToTask = (task: any): Task => ({
    id: task.id,
    name: task.name,
    description: task.description,
    priority: task.priority,
    difficulty: task.difficulty,
    likeliness: task.likeliness,
    deadline: task.deadline,
    category: task.category,
    timeEstimate: task.time_estimate,
    completionTime: task.completion_time,
    isSubtask: task.subtask,
    isParent: task.parent,
    completed: task.completed,
    parentId: task.parent_id,
    startDate: task.startDate,

})
enum Difficulty {
    Easy = 1,
    Medium = 2,
    Hard = 3,
    ExtraHard = 4
}

enum Likeliness {
    Hate = 1,
    Dislike = 2,
    Neutral = 3,
    Like = 4,
    Love = 5
}