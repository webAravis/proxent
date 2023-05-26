modsConfig.push({
  name: 'tesmod',
 leaders: [
  {
    "name":"expandorrrrr",
    "description":"Logistic specialist. Beat him to increase girl capacity",
    "bonus":[
      "small",
      "brunette"
    ],
    "malus":[
      "milf",
      "euro"
    ],
    "costItem": "gold",
    "costCurve": (level) => { return (level / 0.07) },
    "pointsCurve": (level) => { return (level / 0.01) ** 2 },
    "cumCurves": (level) => { return ((level / 0.08) ** 2) / 75 },
    "rewards": [
      {
         "type":"gold",
         "quantity":150000000
      },
      {
         "type":"extension",
         "quantity":150
      }
    ],
    "activityProb": (level) => { 0.13 + (level * 0.01) }
  }
 ]
});
