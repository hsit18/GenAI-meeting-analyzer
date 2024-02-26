import React, { useMemo, useRef } from "react";

import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import highchartsMore from "highcharts/highcharts-more";
import solidGauge from "highcharts/modules/solid-gauge";

highchartsMore(Highcharts);
solidGauge(Highcharts);

export const MeetingEffectiveness = ({ value }: { value: number }) => {
  const chartComponent = useRef(null);
  const options: Highcharts.Options = useMemo<Highcharts.Options>(
    () => ({
      chart: {
        type: "solidgauge",
        height: "280px",
      },
      title: {text: "Effectiveness", align: "center", verticalAlign: "middle", x: 55},
      pane: {
        center: ["60%", "55%"],
        size: "100%",
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor:
            Highcharts.defaultOptions?.legend?.backgroundColor || "#EEE",
          innerRadius: "60%",
          outerRadius: "100%",
          shape: "arc",
        },
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
        labels: {
          y: 20,
          style: {
            fontSize: "16px",
            fontWeight: "bold",
          }
        },
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
          name: "Meeting Effectiveness",
          data: [value],
          dataLabels: {
            format:
              '<div style="text-align:center">' +
              '<span style="font-size:25px">{y}%</span><br/>' +
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
};
