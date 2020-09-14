import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Line } from 'react-chartjs-2';
import ProbabilityDataTransform from './ProbabilityDataTransform';

function App() {
  const data = {
      datasets: [{
        data: ProbabilityDataTransform({probability: .03})
      }]
    },
    options = {
      scales: {
        xAxes: [{
          type: 'linear',
          position: 'bottom'
        }]
      }
    };

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
        <Line 
          data={data} 
          options={options}
        />
      </header>
    </div>
  );
}

export default App;
