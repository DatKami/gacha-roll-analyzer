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
        GENSHIN: {
            true: GenshinDataTransform,
            false: GenshinDataTransform2
        }
      },
      useStyles = makeStyles((theme) => ({
        formControl: {
          margin: theme.spacing(1),
          minWidth: 120,
        },
        formControlPresetProbabilities: {
          margin: theme.spacing(1),
          minWidth: 240,
        },
        selectEmpty: {
          marginTop: theme.spacing(2),
        },
      })),
      DEFAULT_PROBABILITIES = {
          GRANBLUE: [
              {
                  name: '0.225% - 3 SSRs in rate up',
                  value: 0.225
              },
              {
                  name: '0.45% - 2 SSRs in rate up',
                  value: 0.45
              },
              {
                  name: '0.7% - 1 SSR in rate up',
                  value: 0.7
              },
              {
                  name: '3% - Any SSR',
                  value: 3
              },
              {
                  name: 'Custom',
                  value: undefined
              }
          ],
          FGO: [
              {
                  name: '0.7% - 5* Servant Rate Up',
                  value: 0.7
              },
              {
                  name: '1% - Any 5* Servant',
                  value: 1
              },
              {
                  name: 'Custom',
                  value: undefined
              }
          ],
          GENSHIN: [
              {
                  name: '0.6% - 5* Any',
                  value: 0.6
              },
              {
                  name: 'Custom',
                  value: undefined
              }
          ]
      }

function chartDataTransform(probability, pityLimit, isGenshinLimitedCharacter, mode) {
  let dataTransform = DATA_TRANSFORMS[mode],
      properties = {probability}
      
  if (mode === MODES.GENSHIN) {
      dataTransform = dataTransform[isGenshinLimitedCharacter]
  }
  if (mode === MODES.GRANBLUE) {
      properties.pityLimit = pityLimit ? 300 : undefined
  }

  return {
    data: {
      datasets: [{
        lineTension: 0,
        pointRadius: 0,
        pointHitRadius: 2,
        data: dataTransform(properties),
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

function App() {
  const classes = useStyles();
  const [mode, setMode] = useState(MODES.GRANBLUE)
  const [probability, setProbability] = useState(DEFAULT_PROBABILITIES[mode][0].value)
  const [presetProbabilityIndex, setPresetProbabilityIndex] = useState(0)
  const [probabilityInputEnabled, setProbabilityInputEnabled] = useState(false)
  const [pityLimit, setPityLimit] = useState(false)
  const [isGenshinLimitedCharacter, setIsGenshinLimitedCharacter] = useState(false)
  const setToDefaultProbability = (mode, index) => {
      const probability = DEFAULT_PROBABILITIES[mode][index].value
      if (probability === undefined) {
          setProbabilityInputEnabled(true)
      } else {
          setProbability(probability)
          setProbabilityInputEnabled(false)
      }
  }
  const preSetProbability = index => {
      setPresetProbabilityIndex(index)
      setToDefaultProbability(mode, index)
  }
  const preSetMode = mode => {
      setMode(mode)
      let index = 0
      if (mode !== MODES.GRANBLUE) {
          setPityLimit(false)
      }
      if (mode !== MODES.GENSHIN) {
          setIsGenshinLimitedCharacter(false)
      } 
      if (!probabilityInputEnabled) {
          preSetProbability(index)
          setToDefaultProbability(mode, index)
      } else {
          index = DEFAULT_PROBABILITIES[mode].length - 1
          setPresetProbabilityIndex(index)
          setToDefaultProbability(mode, index) // custom index
      }
  }

  return (
    <div className="App">
      <header className="App-header">
        <FormGroup row={true} className={classes.formControl}>
            <FormControl className={classes.formControl}>
                <InputLabel id="modesInputLabel">Game</InputLabel>
                <Select
                  labelId="modesLabel"
                  id="modes"
                  value={mode}
                  onChange={e => preSetMode(e.target.value)}
                >
                    <MenuItem value={MODES.GRANBLUE}>Granblue Fantasy</MenuItem>
                    <MenuItem value={MODES.FGO}>Fate Grand Order</MenuItem>
                    <MenuItem value={MODES.GENSHIN}>Genshin Impact</MenuItem>
                </Select>
            </FormControl>
            <FormControl className={classes.formControlPresetProbabilities}>
                <InputLabel id="presetProbabilitiesInputLabel">Preset Probabilities</InputLabel>
                <Select
                  labelId="presetProbabilitiesLabel"
                  id="presetProbabilities"
                  value={presetProbabilityIndex}
                  onChange={e => preSetProbability(e.target.value)}
                >
                    {DEFAULT_PROBABILITIES[mode].map((item, index) => 
                        <MenuItem value={index}>{item.name}</MenuItem>
                    )}
                </Select>
            </FormControl>
            <TextField disabled={!probabilityInputEnabled} className={classes.formControl} id="probability" label="Probability (%)" value={probability} onChange={e => setProbability(e.target.value)}/>
            {mode === MODES.GRANBLUE &&
                <FormControlLabel className={classes.formControl}
                    control={
                        <Checkbox id="pityLimit" checked={pityLimit} onChange={e => setPityLimit(e.target.checked) } color="primary"/>
                    }
                    label="Will spark target (Guaranteed after 300 rolls)"
                />
            }
            {mode === MODES.GENSHIN &&
                <FormControlLabel className={classes.formControl}
                    control={
                        <Checkbox id="isGenshinLimitedCharacter" checked={isGenshinLimitedCharacter} onChange={e => setIsGenshinLimitedCharacter(e.target.checked) } color="primary"/>
                    }
                    label="Aiming for Limited 5* Character"
                />
            }

        </FormGroup>
        <Line 
          {...chartDataTransform(probability / 100, pityLimit, isGenshinLimitedCharacter, mode)}
        />
      </header>
    </div>
  )
}

export default App;
