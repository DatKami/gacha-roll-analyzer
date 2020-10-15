import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Line } from 'react-chartjs-2';
import ProbabilityDataTransform from './ProbabilityDataTransform';
import GenshinDataTransform from './GenshinDataTransform';
import GenshinDataTransform2 from './GenshinDataTransform2';
import { TextField, Checkbox, FormControlLabel } from '@material-ui/core';

function chartDataTransform(probability, pityLimit) {
  return {
    data: {
      datasets: [{
        steppedLine: true,
        pointRadius: 0,
        pointHitRadius: 2,
        // data: ProbabilityDataTransform({probability, pityLimit: pityLimit ? 300 : undefined}),
        data: GenshinDataTransform(),
        backgroundColor: 'rgba(0, 127, 0, .5)',
        borderColor: 'rgba(0, 127, 0, .5)'
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Cumulative chance to pull any 5* character from limited wish',
        fontSize: 30
      },
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          type: 'linear',
          position: 'bottom',
          scaleLabel: {
            display: true,
            labelString: 'Number of pulls',
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Cumulative Probability (%)'
          }
        }]
      }
    }
  }
}

function App() {
  const [probability, setProbability] = useState(.7)
  const [pityLimit, setPityLimit] = useState(false)

  return (
    <div className="App">
      <header className="App-header">
        <TextField id="probability" label="Probability (%)" value={probability} onChange={e => setProbability(e.target.value)}/>
        <FormControlLabel
          control={
            <Checkbox id="pityLimit"  checked={pityLimit} onChange={e => setPityLimit(e.target.checked) } color="primary"/>
          }
          label="Granblue: Will spark target"
        />
        <Line 
          {...chartDataTransform(probability / 100, pityLimit)}
        />
      </header>
    </div>
  )
}

export default App;
