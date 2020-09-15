import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Line } from 'react-chartjs-2';
import ProbabilityDataTransform from './ProbabilityDataTransform';
import { TextField, Checkbox, FormControlLabel } from '@material-ui/core';

function chartDataTransform(probability, pityLimit) {
  return {
    data: {
      datasets: [{
        steppedLine: true,
        pointRadius: 0,
        pointHitRadius: 2,
        data: ProbabilityDataTransform({probability, pityLimit: pityLimit ? 300 : undefined})
      }]
    },
    options: {
      scales: {
        xAxes: [{
          type: 'linear',
          position: 'bottom'
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
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
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
