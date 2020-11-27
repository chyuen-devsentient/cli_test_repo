/** @jsx jsx */
import { jsx } from '@emotion/core';

import React, { useState, useEffect } from 'react';
import { ResponsiveBullet } from '@nivo/bullet';

export const dummyData = [
    {
      "id": "temp.",
      "ranges": [
        102,
        0,
        120,
        0,
        120
      ],
      "measures": [
        27
      ],
      "markers": [
        80
      ]
    },
    {
      "id": "power",
      "ranges": [
        0.4058636121842798,
        0.2559542967000135,
        0.5896046916025206,
        0,
        2
      ],
      "measures": [
        1.692144058902093,
        1.9582264267420326
      ],
      "markers": [
        1.3629112317016632
      ]
    },
    {
      "id": "volume",
      "ranges": [
        0,25,50,75,100
      ],
      "measures": [
        12
      ],
      "markers": [
        58
      ]
    },
    {
      "id": "cost",
      "ranges": [
        43226,
        327814,
        46767,
        0,
        500000
      ],
      "measures": [
        60080,
        498419
      ],
      "markers": [
        325247
      ]
    },
    {
      "id": "revenue",
      "ranges": [
        3,
        1,
        6,
        0,
        9
      ],
      "measures": [
        2
      ],
      "markers": [
        7.196775924801378,
        7.826026115744352
      ]
    }
  ];
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const SkillRelativityChart = ({ data /* see data tab */ }) => (
    <div css={{
        height: "600px"
    }}>

        <ResponsiveBullet
            data={data}
            margin={{ top: 50, right: 90, bottom: 50, left: 150 }}
            spacing={30}
            titleAlign="start"
            titleOffsetX={-130}
            measureSize={0.2}
            animate={true}
            motionStiffness={90}
            motionDamping={12}
        />
    </div>
)

export default SkillRelativityChart;