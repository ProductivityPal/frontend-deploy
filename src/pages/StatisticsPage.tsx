import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { NavigationMenu } from '../components/NavigationMenu/NavigationMenu';
import { DateFiltering } from '../components/Statistics/DateFiltering';
import { DonutChart } from '../components/Statistics/DonutChart';
import { BarChart } from '../components/Statistics/BarChart';
import { EnergyChart } from '../components/Statistics/EnergyChart';
import './StatisticsPage.css';
import { fetchData } from '../utils/fetchUtils';
import dayjs, { Dayjs } from 'dayjs';
import { Stats, StatsCategory } from '../types/Stats';

const energyStats = fetchData('https://productivitypal-56uf.onrender.com/statistic/energyLevel')
const fetchStatistics = (params: any) => fetchData<Stats>('https://productivitypal-56uf.onrender.com/statistic', params);
function StatisticsPage() {
    const [doneTasks, setDoneTasks] = useState(0)
    const [undoneTasks, setUndoneTasks] = useState(0)
    const [categoryTasks, setCategoryTasks] = useState<any[]>([])
    const [averageTimeTasks, setAverageTimeTasks] = useState<any[]>([])
    const [energyStatsData, setEnergyStatsData] = useState<any[]>([])
    const [dates, setDates] = useState({
        start_date: String(dayjs().subtract(1, 'month').format('YYYY-MM-DD')) + "T00:00",
        end_date: String(dayjs().format('YYYY-MM-DD')) + "T23:59",
    })

    useEffect(() => {
        updatingStatistics()

        energyStats((stats: any) => {
            setEnergyStatsData(stats)
        })

    }, []);

    function updatingStatistics(newDates?: any) {
        const updatedDates = newDates ? newDates : dates
        console.log("updatedDates: ", updatedDates)

        fetchStatistics(updatedDates)((stats: Stats) => {
            setDoneTasks(stats.done)
            setUndoneTasks(stats.undone)

            const categoryTasks = stats.categories.map((sc) => ([
                sc.name,
                sc.done,
                sc.undone,
            ]))
            setCategoryTasks(categoryTasks);

            const averageTimeTasks = stats.categories.map((sc) => ([
                sc.name,
                sc.averageEstimatedTime,
                sc.averageCompletionTime,
            ]))
            setAverageTimeTasks(averageTimeTasks);
        })
        console.log("STATY: ", categoryTasks, averageTimeTasks)
    }

    const transformedData = energyStatsData.map(entry => {
        const notificationTime = new Date(entry.notificationTime);
        const endTime = new Date(notificationTime);
        endTime.setHours(notificationTime.getHours() + 1);
      
        return [
          getDayOfWeek(notificationTime.getDay()),
          entry.energyLevel,
          notificationTime,
          endTime
        ];
      });
      
      function getDayOfWeek(dayIndex: any) {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return daysOfWeek[dayIndex];
      }

    function updateStatsDates(dates: any) {
        console.log('Dates in parent:', dates);
        setDates(dates)
        updatingStatistics(dates)
    }
    return (
        <div>
            <Grid container spacing={0}>
                <Grid xs={0.5} md={0.5}>
                    <NavigationMenu />
                </Grid>
                <Grid xs={4} md={6}>
                    <div className='column-container'>
                        <DateFiltering onDatesUpdate={(dates) => updateStatsDates(dates)} ></DateFiltering>
                        <div className='chart-container'>
                            <DonutChart doneTasks={doneTasks} undoneTasks={undoneTasks}></DonutChart>
                        </div>
                        <div className='chart-container'>
                            {categoryTasks.length > 0 && <BarChart title={"Tasks per category"} data={categoryTasks}></BarChart>}
                            {categoryTasks.length == 0 && <h1 className='title'>No Data yet</h1>}
                        </div>

                    </div>
                </Grid>
                <Grid xs={4} md={5}>
                    <div className='column-container'>
                        <div className='chart-container timeline'>
                            <h5>Energy Levels</h5>
                            <EnergyChart data={transformedData}></EnergyChart>
                            {transformedData.length > 0 && <EnergyChart data={transformedData}></EnergyChart>}
                            {transformedData.length == 0 && <h1 className='title'>No Data yet</h1>}
                        </div>
                        <div className='chart-container'>
                            {averageTimeTasks.length > 0 && <BarChart title={"Average estimated time per category"} data={averageTimeTasks}></BarChart>}
                            {averageTimeTasks.length == 0 && <h1 className='title'>No Data yet</h1>}
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default StatisticsPage;