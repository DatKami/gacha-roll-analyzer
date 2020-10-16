import React, { useState } from 'react';
import './App.css';
import { Line } from 'react-chartjs-2';
import { makeStyles } from '@material-ui/core/styles';
import ProbabilityDataTransform from './ProbabilityDataTransform';
import GenshinDataTransform from './GenshinDataTransform';
import GenshinDataTransform2 from './GenshinDataTransform2';
// FormHelperText,
import { TextField, Checkbox, FormControlLabel, InputLabel, MenuItem, FormControl, Select, FormGroup } from '@material-ui/core';

const MODES = {
        GRANBLUE: 'GRANBLUE',
        FGO: 'FGO',
        GENSHIN: 'GENSHIN'
      },
      DATA_TRANSFORMS = {
        GRANBLUE: ProbabilityDataTransform,
        FGO: ProbabilityDataTransform,
        GENSHIN: GenshinDataTransform
      };

function chartDataTransform(probability, pityLimit, mode) {
  return {
    data: {
      datasets: [{
        lineTension: 0,
        pointRadius: 0,
        pointHitRadius: 2,
        data: DATA_TRANSFORMS[mode]({probability, pityLimit: pityLimit ? 300 : undefined}),
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
          },
          ticks: {
            beginAtZero: true,
            suggestedMax: 100
          }
        }]
      }
    }
  }
}

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function App() {
  const classes = useStyles();
  const [mode, setMode] = useState(MODES.GRANBLUE)
  const [probability, setProbability] = useState(.7)
  const [pityLimit, setPityLimit] = useState(false)

  return (
    <div className="App">
      <header className="App-header">
        <FormGroup row={true} className={classes.formControl}>
            <FormControl className={classes.formControl}>
                <InputLabel id="rollMode">Game</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={mode}
                  onChange={e => setMode(e.target.value)}
                >
                    <MenuItem value={MODES.GRANBLUE}>Granblue Fantasy</MenuItem>
                    <MenuItem value={MODES.FGO}>Fate Grand Order</MenuItem>
                    <MenuItem value={MODES.GENSHIN}>Genshin Impact</MenuItem>
                </Select>
            </FormControl>
            <TextField className={classes.formControl} id="probability" label="Probability (%)" value={probability} onChange={e => setProbability(e.target.value)}/>
            {mode === MODES.GRANBLUE &&
                <FormControlLabel className={classes.formControl}
                    control={
                        <Checkbox id="pityLimit" checked={pityLimit} onChange={e => setPityLimit(e.target.checked) } color="primary"/>
                    }
                    label="Granblue: Will spark target"
                />
            }

        </FormGroup>
        <Line 
          {...chartDataTransform(probability / 100, pityLimit, mode)}
        />
      </header>
    </div>
  )
}

export default App;
