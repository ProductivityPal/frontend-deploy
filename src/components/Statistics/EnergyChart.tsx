import React from "react";
import { Chart } from "react-google-charts";

type EnergyProps = {
  data: any
}

export const data = [
  [
    { type: "string", id: "Position" },
    { type: "string", id: "Name" },
    { type: "date", id: "Start" },
    { type: "date", id: "End" },
  ],
  [
    "",
    "",
    new Date(0, 0, 0, 0, 0, 0),
    new Date(0, 0, 0, 0, 0, 0),
  ],
  [
    "",
    "",
    new Date(0, 0, 0, 0, 0, 0),
    new Date(0, 0, 0, 0, 0, 0),
  ],
  [
    "",
    "",
    new Date(0, 0, 0, 0, 0, 0),
    new Date(0, 0, 0, 0, 0, 0),
  ],

];

export function EnergyChart(props: EnergyProps) {
  const dataUsed = props.data ? [[
    { type: "string", id: "Position" },
    { type: "string", id: "Name" },
    { type: "date", id: "Start" },
    { type: "date", id: "End" },
  ], ...props.data] : data
  return <Chart chartType="Timeline" data={dataUsed} width="95%" height="100%" options={{
    title: "Energy Levels",
    timeline: { colorByRowLabel: false },
    backgroundColor: "transparent",
    margin: "50px"
  }}/>;
}

