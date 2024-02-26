import React, { useMemo } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

export const TopicStats = ({data, partcipants}) => {
    const options = useMemo<Highcharts.Options>(() => {
        return {
            chart: {
                type: 'column'
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
                title: {
                    text: 'Percentage(%)'
                }
            },
        
            tooltip: {
                format: '<b> {series.name}</b> speaks <b>{y}%</b> on {key}'
            },
        
            plotOptions: {
                column: {
                    stacking: 'percent',
                    dataLabels: {
                        enabled: true,
                        format: '{point.percentage:.0f}%'
                    }
                }
            },
            series: partcipants.map(p => {
                return {
                    name: p,
                    data: (data || []).map(topicObj => topicObj.participants[p] || 0)
                }
            })
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