//@ts-nocheck

import React, { useMemo } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

export const TopicChart = ({topics}) => {
    const options = useMemo<Highcharts.Options>(() => {
        return {
            chart: {
                type: 'pie',
                height: 300,
            },
            title: {
                text: 'Topics Statistics',
                align: 'center'
            },
            tooltip: {
                format: '<b> {series.name}</b> speaks <b>{y}%</b> on {key}'
            },
            credits: {
                enabled: false
            },

            plotOptions: {
                bar: {
                    borderRadius: '50%',
                    pointWidth: 10,
                    borderWidth: 2,
                    dataLabels: {
                        enabled: true
                    },
                    groupPadding: 0.3
                }
            },
            series: [
                {
                    name: 'Percentage',
                    colorByPoint: true,
                    data: Object.keys(topics || {}).map(t => {
                        return {
                            name: t,
                            y: topics[t] || 0
                        }
                    })
                }
            ]
        };
    }, [topics]);

    return (
        <div>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>
    )
}