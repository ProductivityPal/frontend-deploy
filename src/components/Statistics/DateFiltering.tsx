import React from "react";
import { useState } from "react";
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Button } from "@mui/material";
import './DateFiltering.css';
import { putData } from "../../utils/fetchUtils";

type DateStatProps = {
    onDatesUpdate: (dates: any) => void;
}
export function DateFiltering(props: DateStatProps) {
    const [startDate, setStartDate] = useState<Dayjs>(dayjs().subtract(1, 'month'));
    const [endDate, setEndDate] = useState<Dayjs>(dayjs());

    const handleStartDateChange = (date: any) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date: any) => {
        setEndDate(date);
    };

    const subtasksButton = {
        backgroundColor: '#EE7F3B',
        color: 'white',
        "&:hover": {backgroundColor: "#F8DEB3"},
        // width: '100%',
    }

    function updateDateRange() {
        console.log('Updating date range...', String(startDate.format('YYYY-MM-DD')) + "T00:00",String(endDate.format('YYYY-MM-DD')) + "T23:59");
        props.onDatesUpdate({
            start_date: String(startDate.format('YYYY-MM-DD')) + "T00:00",
            end_date: String(endDate.format('YYYY-MM-DD')) + "T23:59"})
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="container">
            <DatePicker
                value={startDate}
                onChange={handleStartDateChange}
                format="DD/MM/YY"
            />
            <div className="label"> - </div>
            <DatePicker
                value={endDate}
                onChange={handleEndDateChange}
                minDate={startDate}
                format="DD/MM/YY"
            />
            <Button sx={subtasksButton} disabled={endDate < startDate} onClick={() => updateDateRange()}>Update</Button>
        </div>
        </LocalizationProvider>
    )
}