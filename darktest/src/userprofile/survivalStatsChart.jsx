/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useState, useEffect } from 'react';
// import { ResponsiveStream } from '@nivo/stream'

import { ResponsiveLine } from '@nivo/line'
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

export const dummyData = [
  {
    "id": "japan",
    "color": "hsl(43, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 55
      },
      {
        "x": "helicopter",
        "y": 173
      },
      {
        "x": "boat",
        "y": 42
      },
      {
        "x": "train",
        "y": 195
      },
      {
        "x": "subway",
        "y": 118
      },
      {
        "x": "bus",
        "y": 181
      },
      {
        "x": "car",
        "y": 93
      },
      {
        "x": "moto",
        "y": 207
      },
      {
        "x": "bicycle",
        "y": 81
      },
      {
        "x": "horse",
        "y": 79
      },
      {
        "x": "skateboard",
        "y": 177
      },
      {
        "x": "others",
        "y": 92
      }
    ]
  },
  {
    "id": "france",
    "color": "hsl(61, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 42
      },
      {
        "x": "helicopter",
        "y": 75
      },
      {
        "x": "boat",
        "y": 77
      },
      {
        "x": "train",
        "y": 5
      },
      {
        "x": "subway",
        "y": 190
      },
      {
        "x": "bus",
        "y": 277
      },
      {
        "x": "car",
        "y": 233
      },
      {
        "x": "moto",
        "y": 9
      },
      {
        "x": "bicycle",
        "y": 100
      },
      {
        "x": "horse",
        "y": 206
      },
      {
        "x": "skateboard",
        "y": 18
      },
      {
        "x": "others",
        "y": 71
      }
    ]
  },
  {
    "id": "us",
    "color": "hsl(123, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 121
      },
      {
        "x": "helicopter",
        "y": 64
      },
      {
        "x": "boat",
        "y": 92
      },
      {
        "x": "train",
        "y": 165
      },
      {
        "x": "subway",
        "y": 29
      },
      {
        "x": "bus",
        "y": 296
      },
      {
        "x": "car",
        "y": 232
      },
      {
        "x": "moto",
        "y": 294
      },
      {
        "x": "bicycle",
        "y": 67
      },
      {
        "x": "horse",
        "y": 208
      },
      {
        "x": "skateboard",
        "y": 176
      },
      {
        "x": "others",
        "y": 43
      }
    ]
  },
  {
    "id": "germany",
    "color": "hsl(10, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 6
      },
      {
        "x": "helicopter",
        "y": 126
      },
      {
        "x": "boat",
        "y": 172
      },
      {
        "x": "train",
        "y": 4
      },
      {
        "x": "subway",
        "y": 184
      },
      {
        "x": "bus",
        "y": 61
      },
      {
        "x": "car",
        "y": 70
      },
      {
        "x": "moto",
        "y": 50
      },
      {
        "x": "bicycle",
        "y": 162
      },
      {
        "x": "horse",
        "y": 119
      },
      {
        "x": "skateboard",
        "y": 152
      },
      {
        "x": "others",
        "y": 263
      }
    ]
  },
  {
    "id": "norway",
    "color": "hsl(226, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 237
      },
      {
        "x": "helicopter",
        "y": 278
      },
      {
        "x": "boat",
        "y": 238
      },
      {
        "x": "train",
        "y": 276
      },
      {
        "x": "subway",
        "y": 272
      },
      {
        "x": "bus",
        "y": 117
      },
      {
        "x": "car",
        "y": 42
      },
      {
        "x": "moto",
        "y": 40
      },
      {
        "x": "bicycle",
        "y": 163
      },
      {
        "x": "horse",
        "y": 45
      },
      {
        "x": "skateboard",
        "y": 243
      },
      {
        "x": "others",
        "y": 226
      }
    ]
  }
];

const SurvivalStatsChart = ({ data /* see data tab */ }) => (
  <div css={{
    height: "300px"
  }}>

    <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 170, bottom: 80, left: 60 }}
        xScale={{
          type: 'time',
          format: '%Y-%m-%d',
          useUTC: false,
          precision: 'day',
        }}
        xFormat="time:%Y-%m-%d"        
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
        curve="basis"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 45,
            legendOffset: 36,
            legendPosition: 'middle',
            format: '%b %d, %Y',
            tickValues: 'every 1 month'
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        enableGridX={false}
        enableGridY={false}
        colors={{ scheme: 'nivo' }}
        lineWidth={2}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabel="y"
        pointLabelYOffset={-12}
        enableArea={true}
        areaBlendMode="darken"
        useMesh={true}
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                itemTextColor: 'gray',
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />
  </div>
)


export default SurvivalStatsChart;