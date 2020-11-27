export const filteredWeekData_placeholder = [
  {"lineType": 'all LOC', "essentialLinesInserted": 240, "date": '2019-01-01'}, 
  {"lineType": 'all LOC', "essentialLinesInserted": 10, "date": '2019-02-01'},
  {"lineType": 'all LOC', "essentialLinesInserted": 230, "date": '2019-03-01'},
  {"lineType": 'all LOC', "essentialLinesInserted": 600, "date": '2019-04-01'},
  {"lineType": 'all LOC', "essentialLinesInserted": 600, "date": '2019-05-01'},
  {"lineType": 'all LOC', "essentialLinesInserted": 300, "date": '2019-06-01'},
  {"lineType": 'all LOC', "essentialLinesInserted": 500, "date": '2019-07-01'},
  {"lineType": 'all LOC', "essentialLinesInserted": 700, "date": '2019-08-01'},
  {"lineType": 'all LOC', "essentialLinesInserted": 800, "date": '2019-09-01'},
  {"lineType": 'all LOC', "essentialLinesInserted": 600, "date": '2019-10-01'},
  {"lineType": 'all LOC', "essentialLinesInserted": 170, "date": '2019-11-01'},
  {"lineType": 'all LOC', "essentialLinesInserted": 126, "date": '2019-12-01'},
  {"lineType": 'essential', "essentialLinesInserted": 200, "date": '2019-01-01'}, 
  {"lineType": 'essential', "essentialLinesInserted": 10, "date": '2019-02-01'},
  {"lineType": 'essential', "essentialLinesInserted": 200, "date": '2019-03-01'},
  {"lineType": 'essential', "essentialLinesInserted": 500, "date": '2019-04-01'},
  {"lineType": 'essential', "essentialLinesInserted": 570, "date": '2019-05-01'},
  {"lineType": 'essential', "essentialLinesInserted": 280, "date": '2019-06-01'},
  {"lineType": 'essential', "essentialLinesInserted": 400, "date": '2019-07-01'},
  {"lineType": 'essential', "essentialLinesInserted": 200, "date": '2019-08-01'},
  {"lineType": 'essential', "essentialLinesInserted": 50, "date": '2019-09-01'},
  {"lineType": 'essential', "essentialLinesInserted": 300, "date": '2019-10-01'},
  {"lineType": 'essential', "essentialLinesInserted": 120, "date": '2019-11-01'},
  {"lineType": 'essential', "essentialLinesInserted": 100, "date": '2019-12-01'},
];

export const codeSurvivalStats_placeholder = [
  {'author': 'Jason Brodie', 'survivalStat': 'code contributed', 'numLines': 2728},
  {'author': 'Jason Brodie', 'survivalStat': 'code deleted by others', 'numLines': 350},
  {'author': 'Jason Brodie', 'survivalStat': 'code deleted by self', 'numLines': 407},
];

export const skillStatsAllTime = [
  {'timeframe': 'all time', 'skill': 'UI', 'sentenceCount': 2728},
  {'timeframe': 'all time', 'skill': 'API', 'sentenceCount': 350},
  {'timeframe': 'all time', 'skill': 'auth', 'sentenceCount': 407},
  {'timeframe': 'all time', 'skill': 'Network', 'sentenceCount': 700},
  {'timeframe': 'all time', 'skill': 'Serverless', 'sentenceCount': 1700},    
  {'timeframe': 'all time', 'skill': 'Kubernetes', 'sentenceCount': 300},
  {'timeframe': 'all time', 'skill': 'ETL', 'sentenceCount': 1500},
];

export const skillStats3Months = [
  {'timeframe': '3 months', 'skill': 'UI', 'sentenceCount': 2100},
  {'timeframe': '3 months', 'skill': 'API', 'sentenceCount': 350},
  {'timeframe': '3 months', 'skill': 'auth', 'sentenceCount': 407},
  {'timeframe': '3 months', 'skill': 'Network', 'sentenceCount': 700},
  {'timeframe': '3 months', 'skill': 'Serverless', 'sentenceCount': 1100},    
  {'timeframe': '3 months', 'skill': 'Kubernetes', 'sentenceCount': 300},
  {'timeframe': '3 months', 'skill': 'ETL', 'sentenceCount': 1500},
];

export const skillStats12Months = [
  {'timeframe': '12 months', 'skill': 'UI', 'sentenceCount': 600},
  {'timeframe': '12 months', 'skill': 'API', 'sentenceCount': 250},
  {'timeframe': '12 months', 'skill': 'auth', 'sentenceCount': 207},
  {'timeframe': '12 months', 'skill': 'Network', 'sentenceCount': 300},
  {'timeframe': '12 months', 'skill': 'Serverless', 'sentenceCount': 400},    
  {'timeframe': '12 months', 'skill': 'Kubernetes', 'sentenceCount': 300},
  {'timeframe': '12 months', 'skill': 'ETL', 'sentenceCount': 500},
];


export const compareSurvival = {
  x:[
    'Daniel Lamb', 
    'Adam Dille',
    'Jesse Einfalt', 
    'Mario Ciabarra',
    'Matt Greenberg', 
    'Eric Irwin', 
    'Nate Harris',
    'Jason Brodie',
    'Hunter Pickett',
    'Viktor Kelemen',
    'Andrew Meredith',
    'Kale Johnson',
    'Daniel Barnes',
    'Ryan Dabler',
    'Clara Richter',
  ],
  y: [
    0.91434118,
    0.90283587, 
    0.84657399, 
    0.77159988, 
    0.74213456,
    0.7284441 , 
    0.67391945, 
    0.49879879, 
    0.38502768, 
    0.2886785 ,
    0.24398668, 
    0.21083885, 
    0.16157961, 
    0.03372976, 
    0.02971732
  ]
};

export const generalStats_placeholder = [
  {'statType': 'totalCommits', 'value': 600},
  {'statType': 'totalLinesAdded', 'value': 250},
  {'statType': 'totalEssentialLinesAdded', 'value': 250},
  {'statType': 'percentEssentialCode', 'value': 250},
  {'statType': 'percentTopContribution', 'value': 250},
  {'statType': 'firstCommitDate', 'value': 207},
  {'statType': 'avgCodeSurvivalTime', 'value': 300},
  {'statType': 'numRepos', 'value': 300},
  {'statType': 'activityTrending', 'value': 300},
];

export const BulletPlaceholder = {
  'name':'Dan Abramov',
  'weeklyTrend':'down',
  'monthlyTrend':'up',
  'RankingEssential': 23,
  'RankingSurvival': 100,
  'percentileEssential':5,
  'PercentileSurvival':11,
  'repo':'react.js',
  'activeDayCount1Month': 20,
  'activeDayCount6Month': 100,
  'dateMostActive':'May 5th, 2020',
  'essentialLineOnMostActive': 890,
  'topSkills': 'UI, API calls and state management',
  'newSkills12month':'Auth and UI',
  'newSkills3month':'math',
  'firstSkillPercentile':80,
  'firstSkill':'state mangaement',
  'secondSkillPercentile': 60,
  'secondSkill':'UI',
  'thirdSkillPercentile':40,
  'thirdSkill':'API calls'
}
