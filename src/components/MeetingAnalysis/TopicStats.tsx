//@ts-nocheck

import React, { useMemo } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

export const TopicStats = ({data, partcipants}) => {
    const options = useMemo<Highcharts.Options>(() => {
        return {
            chart: {
                type: 'column',
                height: 300
            },
            title: {
                text: 'Topic vs Participant Statistics',
                align: 'center'
            },
        
            xAxis: {
                categories: (data || []).map(t => t.topic)
            },
        
            yAxis: {
                allowDecimals: false,
                min: 0,
                max: 100,
                tickAmount: 10,
                alignTicks: false,
                endOnTick: false,
                title: {
                    text: 'Percentage(%)'
                }
            },
        
            tooltip: {
                format: '<b> {series.name}</b> speaks <b>{y}%</b> on {key}'
            },
        
            
            plotOptions: {
                bar: {
                    borderRadius: '50%',
                    pointWidth: 6,
                    dataLabels: {
                        enabled: true
                    },
                    groupPadding: 0.2,
                    PointWidth: 5
                }
            },
            series: partcipants.map(p => {
                return {
                    name: p,
                    data: (data || []).map(topicObj => topicObj.participants[p] || 0)
                }
            }),
            credits: {
                enabled: false
            },
        };
    }, [data, partcipants]);

    return (
        <div>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>
    )
}