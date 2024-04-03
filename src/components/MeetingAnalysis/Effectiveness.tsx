//@ts-nocheck

import React, { useEffect, useMemo, useRef, useState } from "react";

import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import highchartsMore from "highcharts/highcharts-more";
import solidGauge from "highcharts/modules/solid-gauge";
import { askModel } from "@/utils/apiUtils";

if (typeof Highcharts === "object") {
  highchartsMore(Highcharts);
  solidGauge(Highcharts);
}

export const MeetingEffectiveness = ({ meetingId }: { meetingId: number }) => {
  const [value, setValue] = useState(0);
  const getEffectiveness = async () => {
    const effectiveness = await askModel(
      meetingId,
      "Can you analyse meeting transcribe and provide overall effectiveness only in raw JSON like {effectiveness: 50}.",
      "response2"
    );
    setValue(JSON.parse(effectiveness || "").effectiveness);
  };

  useEffect(() => {
    getEffectiveness();
  }, [meetingId]);

  const chartComponent = useRef(null);
  const options: Highcharts.Options = useMemo<Highcharts.Options>(
    () => ({
      chart: {
        type: "solidgauge",
        height: "170px",
      },
      title: null,
      pane: {
        center: ["80%", "50%"],
        size: "100%",
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
              '<span style="font-size:20px">Effectiveness: </span><span style="font-size:20px">{y}%</span><br/>' +
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
