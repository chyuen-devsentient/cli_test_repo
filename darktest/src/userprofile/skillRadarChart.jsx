/** @jsx jsx */
import { jsx } from '@emotion/core';

import React, { useState, useEffect } from 'react';
import { ResponsiveRadar } from '@nivo/radar'


export const dummyData = [
    {
      "taste": "fruity",
      "chardonay": 62,
      "carmenere": 76,
      "syrah": 29
    },
    {
      "taste": "bitter",
      "chardonay": 32,
      "carmenere": 118,
      "syrah": 101
    },
    {
      "taste": "heavy",
      "chardonay": 43,
      "carmenere": 62,
      "syrah": 40
    },
    {
      "taste": "strong",
      "chardonay": 41,
      "carmenere": 84,
      "syrah": 47
    },
    {
      "taste": "sunny",
      "chardonay": 72,
      "carmenere": 73,
      "syrah": 49
    }
  ];

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const SkillRadarChart = ({ data, maxValue }) => (
    <div css={{
        height: "600px"
    }}>

        <ResponsiveRadar
            data={data}
            keys={[ '3 months', '12 months' ,'all time']}
            indexBy="skill"
            maxValue={ maxValue }
            margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
            curve="linearClosed"
            borderWidth={2}
            borderColor={{ from: 'color' }}
            gridLevels={5}
            gridShape="circular"
            gridLabelOffset={36}
            enableDots={true}
            dotSize={10}
            dotColor={{ theme: 'background' }}
            dotBorderWidth={2}
            dotBorderColor={{ from: 'color' }}
            enableDotLabel={false}
            dotLabel="value"
            dotLabelYOffset={-12}
            colors={{ scheme: 'nivo' }}
            fillOpacity={0.25}
            blendMode="multiply"
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            isInteractive={true}
            legends={[
                {
                    anchor: 'top-left',
                    direction: 'column',
                    translateX: -50,
                    translateY: -40,
                    itemWidth: 80,
                    itemHeight: 20,
                    itemTextColor: '#999',
                    symbolSize: 12,
                    symbolShape: 'circle',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemTextColor: '#000'
                            }
                        }
                    ]
                }
            ]}
        />
    </div>
)

export default SkillRadarChart;