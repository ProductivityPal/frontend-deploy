export type Stats = {
    done: number,
    undone: number,
    categories: StatsCategory[]
}

export type StatsCategory = {
    name: string,
    done: number,
    undone: number,
    averageEstimatedTime: number,
    averageCompletionTime: number,
}