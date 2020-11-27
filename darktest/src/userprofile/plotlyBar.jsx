// import Plot from 'react-plotly.js';
import React from 'react';

import {
  compareSurvival
} from './data';

import Plotly from "plotly.js-basic-dist";

import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);

const authorName = 'Jason Brodie'

const trace2 = compareSurvival
trace2.type ='bar'; 
trace2.tickangle=-45;

const indexAuthor = trace2.x.indexOf(authorName);
// console.log(indexAuthor)

const markerColor = new Array(trace2.x.length).fill('#CCCCCC')

if (indexAuthor!==-1) {
  markerColor[indexAuthor] = '#007bff';
}

// console.log( markerColor)
trace2.marker={color:markerColor}
// console.log('trace2', trace2)

// const trace1 = {
//   x: ['Daniel Lamb', 'Jesse Einfalt', 'Matt Greenberg', 'Eric Irwin', 'Nate Harris',
//   'Jason Brodie','Hunter Pickett','Viktor Kelemen','Andrew Meredith','Kale Johnson',
// 'Daniel Barnes','Ryan Dabler','Clara Richter','Mario Ciabarra','Adam Dille'],
//   y:[0.91434118, 0.90283587, 0.84657399, 0.77159988, 0.74213456,
//     0.7284441 , 0.67391945, 0.49879879, 0.38502768, 0.2886785 ,
//     0.24398668, 0.21083885, 0.16157961, 0.03372976, 0.02971732],
//   marker:{
//     color: ['#CCCCCC',  '#CCCCCC', '#CCCCCC', '#CCCCCC','#CCCCCC', '#007bff','#CCCCCC',
//     '#CCCCCC','#CCCCCC','#CCCCCC','#CCCCCC','#CCCCCC','#CCCCCC','#CCCCCC','#CCCCCC']
//   },
//   type: 'bar',
//   tickangle:  -45
// };




class HighlighedBar extends React.Component {
  render() {
    return (
      <Plot
        data={[trace2]}
        layout={{width: "100%", height: 500, title: 'Survival comparison'}}
      />
    );
  }
}



export default HighlighedBar;