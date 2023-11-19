import React from "react";
import { useState } from "react";
import { Chart } from "react-google-charts";
import './DonutChart.css';
  
  export const options = {
    title: "Tasks Status",
    legend: "none",
    pieHole: 0.9,
    is3D: false,
    slices: {
        0: { color: "#EE7F3B" },
        1: { color: "#E5E5E5" },
    },
    pieStartAngle: 0,
    backgroundColor: "transparent",
  };

  type DonutChartProps = {
    doneTasks: number,
    undoneTasks: number,
  }

  export function DonutChart(props: DonutChartProps) {

    const data = [
    ["Task", "Hours per Day"],
    ["Done", props.doneTasks],
    ["Not Done", props.undoneTasks],
    ];

    return (
      <div className="donut-chart-container">
        <Chart
        chartType="PieChart"
        width="100%"
        height="280px"
        data={data}
        options={options}
      />
      <div className="centered-text">
      {((props.doneTasks + props.undoneTasks) != 0) &&<h1>{((props.doneTasks / (props.doneTasks + props.undoneTasks)) * 100).toFixed(2)}%</h1>}
      {((props.doneTasks + props.undoneTasks) == 0) &&<h1>0%</h1>}
        

        <p>Tasks Done</p>
        </div>

      </div>
        
    );
  }