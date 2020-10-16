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
          graphBox: {
              width: '80vw',
          }
      })),
      DEFAULT_PROBABILITIES = {
          GRANBLUE: [
              {
                  name: '0.225% - 1 of 3 SSRs in rate up',
                  value: 0.225,
                  chartTitle: 'Cumulative chance to pull a focused SSR at 0.225% rate'
              },
              {
                  name: '0.45% - 2 SSRs in rate up',
                  value: 0.45,
                  chartTitle: 'Cumulative chance to pull a focused SSR at 0.45% rate'
              },
              {
                  name: '0.7% - 1 SSR in rate up',
                  value: 0.7,
                  chartTitle: 'Cumulative chance to pull a focused SSR at 0.7% rate'
              },
              {
                  name: '3% - Any SSR',
                  value: 3,
                  chartTitle: 'Cumulative chance to pull any SSR at 3% rate'
              },
              {
                  name: '6% - Any SSR (Flash Gala)',
                  value: 6,
                  chartTitle: 'Cumulative chance to pull any SSR at 6% rate'
              },
              {
                  name: 'Custom',
                  value: undefined,
                  chartTitle: 'Cumulative chance at a custom rate'
              }
          ],
          FGO: [
              {
                  name: '0.7% - 5* Servant Rate Up',
                  value: 0.7,
                  chartTitle: 'Cumulative chance to pull a focused 5* servant at 0.7% rate'
              },
              {
                  name: '1% - Any 5* Servant',
                  value: 1,
                  chartTitle: 'Cumulative chance to pull any 5* servant at 1% rate'
              },
              {
                  name: 'Custom',
                  value: undefined,
                  chartTitle: 'Cumulative chance at a custom rate'
              }
          ],
          GENSHIN: [
              {
                  name: '0.6% - 5* Any',
                  value: 0.6,
                  chartTitle: {
                      false: 'Cumulative chance to pull any 5* character from limited wish',
                      true: 'Cumulative chance to pull the rate up 5* character from limited wish'
                  }
              },
              {
                  name: 'Custom',
                  value: undefined,
                  chartTitle: {
                    false: 'Cumulative chance at a custom rate',
                    true: 'Cumulative chance to pull the rate up 5* character at a custom rate'
                }
              }
          ]
      }

function chartDataTransform(probability, pityLimit, isGenshinLimitedCharacter, mode, chartTitle, maxRolls) {
  let dataTransform = DATA_TRANSFORMS[mode],
      properties = {probability, limit: maxRolls}

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
        text: chartTitle,
        fontSize: 26
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
          },
          ticks: {
            beginAtZero: true,
            suggestedMax: maxRolls
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
  const [mode, setMode] = useState(MODES.GENSHIN)
  const [probability, setProbability] = useState(DEFAULT_PROBABILITIES[mode][0].value)
  const [maxRolls, setMaxRolls] = useState(300)
  const [presetProbabilityIndex, setPresetProbabilityIndex] = useState(0)
  const [probabilityInputEnabled, setProbabilityInputEnabled] = useState(false)
  const [pityLimit, setPityLimit] = useState(true)
  const [isGenshinLimitedCharacter, setIsGenshinLimitedCharacter] = useState(true)
  const getChartTitle = (mode, index, isGenshinLimitedCharacter) => {
      let chartTitle = DEFAULT_PROBABILITIES[mode][index].chartTitle

      if (mode === MODES.GENSHIN) {
          chartTitle = chartTitle[isGenshinLimitedCharacter]
      }
      
      return chartTitle
  }
  const [chartTitle, setChartTitle] = useState(getChartTitle(mode, presetProbabilityIndex, isGenshinLimitedCharacter))
  const setToDefaultProbability = (mode, index) => {
      const presetProbability = DEFAULT_PROBABILITIES[mode][index],
            probability = presetProbability.value

      if (probability === undefined) {
          setProbabilityInputEnabled(true)
      } else {
          setProbability(probability)
          setProbabilityInputEnabled(false)
      }

      setChartTitle(getChartTitle(mode, index, isGenshinLimitedCharacter))
  }
  const preSetProbability = index => {
      setPresetProbabilityIndex(index)
      setToDefaultProbability(mode, index)
  }
  const preSetMode = mode => {
      setMode(mode)
      let index = 0
      if (mode === MODES.FGO) {
          setPityLimit(false)
      }
      if (mode === MODES.GRANBLUE) {
          setPityLimit(true)
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
  const preSetIsGenshinLimitedCharacter = isGenshinLimitedCharacter => {
      setIsGenshinLimitedCharacter(isGenshinLimitedCharacter)
      let chartTitleObject = DEFAULT_PROBABILITIES[mode][presetProbabilityIndex].chartTitle,
          chartTitle = chartTitleObject[isGenshinLimitedCharacter]
      
      setChartTitle(chartTitle)
  }
  const preSetMaxRolls = maxRolls => {
      if (maxRolls > 1000) {
          maxRolls = 1000
      }

      setMaxRolls(maxRolls)
  }

  return (
    <div className="App">
      <header className="App-header">
        <FormGroup row={true}>
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
        </FormGroup>
        <FormGroup row={true}>
            <TextField className={classes.formControl} id="maxRolls" label="Max rolls (max 1000)" value={maxRolls} onChange={e => preSetMaxRolls(e.target.value)}/>
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
                        <Checkbox id="isGenshinLimitedCharacter" checked={isGenshinLimitedCharacter} onChange={e => preSetIsGenshinLimitedCharacter(e.target.checked) } color="primary"/>
                    }
                    label="Aiming for Limited 5* Character"
                />
            }

        </FormGroup>
        <div className={classes.graphBox}>
            <Line 
                {...chartDataTransform(probability / 100, pityLimit, isGenshinLimitedCharacter, mode, chartTitle, maxRolls)}
            />
        </div>

      </header>
    </div>
  )
}

export default App;
