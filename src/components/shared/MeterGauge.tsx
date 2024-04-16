//@ts-nocheck
"use client";

import React, { useMemo, useRef } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import highchartsMore from "highcharts/highcharts-more";
import solidGauge from "highcharts/modules/solid-gauge";

if (typeof Highcharts === "object") {
    highchartsMore(Highcharts);
    solidGauge(Highcharts);
}

export const MeterGauge = ({value, size}: {value: number; size?: string}) => {
    const chartComponent = useRef(null);
    const options: Highcharts.Options = useMemo<Highcharts.Options>(
      () => ({
        chart: {
          type: "solidgauge",
          height: "170px",
          backgroundColor:"none"
        },
        title: null,
        pane: {
          center: ["80%", "50%"],
          size: size || "100%",
          startAngle: -90,
          endAngle: 90,
          background: [
            {
              backgroundColor:
                Highcharts.defaultOptions?.legend?.backgroundColor || "#EEE",
              innerRadius: "60%",
              outerRadius: "100%",
              shape: "arc",
            },
          ],
        },
  
        exporting: {
          enabled: false,
        },
  
        tooltip: {
          enabled: false,
        },
  
        yAxis: {
          min: 0,
          max: 100,
          stops: [
            [0.1, "#DF5353"], // red
            [0.5, "#DDDF0D"], // yellow
            [0.9, "#55BF3B"], // green
          ],
          lineWidth: 0,
          tickWidth: 0,
          tickAmount: 2,
          showFirstLabel: false,
          showLastLabel: false,
        },
  
        plotOptions: {
          solidgauge: {
            dataLabels: {
              y: 5,
              borderWidth: 0,
              useHTML: true,
            },
          },
        },
        series: [
          {
            data: [value] as Array<number>,
            dataLabels: {
              format:
                '<div style="text-align:center">' +
                '<span style="font-size:16px">Effectiveness: </span><span style="font-size:18px">{y}%</span><br/>' +
                "</div>",
            },
            tooltip: {
              valueSuffix: "%",
            },
          },
        ],
        credits: {
          enabled: false,
        },
      }),
      [value]
    );
  
    return (
      <HighchartsReact
        ref={chartComponent}
        highcharts={Highcharts}
        options={options}
      />
    );
} 