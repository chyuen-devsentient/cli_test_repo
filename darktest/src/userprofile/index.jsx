import React, { useState, useEffect, useContext } from 'react';

import {
  Tabs,
  Row,
  Col,
  Alert,
  Space,
  Switch
} from 'antd';

import {
  CodeOutlined,
  RadarChartOutlined,
  UnorderedListOutlined,
  BarChartOutlined,
  LineChartOutlined,
  UserSwitchOutlined,
  CalendarOutlined
} from '@ant-design/icons';

import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

import GraphComponent from './graphComponent';
import AliasComponent from './aliasDisplay';
// import ThemeComponent from './themes';
// import HighlighedBar from './plotlyBar';
// import ClusterGraph from './clusterGraph'
// import SkillRelativity from './skillRelativity'
// import RadarChart from './radarChart'

// NIVO components
import SurvivalStatsChart from './survivalStatsChart';
import EssentialLinesCalendar from './essentialLinesCalendar';
import SkillRadarChart from './skillRadarChart';
import SkillRelativityChart from './skillRelativityChart';

import {
  GET_AUTHOR,
  GET_LINES_ADDED,
  GET_SURVIVAL_STAT,
  GET_GENERAL_STAT,
  GET_SKILL_RADAR,
  CODE_EXAMPLE,
} from './queries';

import {
  filteredWeekData_placeholder,
  BulletPlaceholder,
} from './data';

import './styles.css';
import '../App.css';
// import 'antd/dist/antd.dark.css';

import { SearchContext, EmailMergeContext, DataContext } from '../App';
import Feedback from '../components/Feedback';
import InsightList from '../components/InsightList';
import HorizontalBaseballCard from '../components/HorizontalBaseballCard';

// import { useThemeSwitcher } from 'react-css-theme-switcher';

SyntaxHighlighter.registerLanguage('jsx', jsx);

const { TabPane } = Tabs;


const today = new Date();
const yesterday = new Date(today);
const threeMonthAgo = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
threeMonthAgo.setDate(threeMonthAgo.getDate() - 180);
const threeMonthAgoISO = threeMonthAgo.toISOString();


function fillMissingDate(arrayOriginal, lineType) {
  const arrayWithMissingDates = arrayOriginal.filter(
    (item) => item.lineType === lineType,
  );
  const startDate = moment(threeMonthAgo.toDateString());
  const endDate = moment(today);
  const days = endDate.diff(startDate, 'd', false);
  var linesAddedFilled = [];
  var valY;
  for (var i = 0; i <= days; i++) {
    valY = 0;
    for (var j = 0; j < arrayWithMissingDates.length; j++) {
      if (
        arrayWithMissingDates[j].date === startDate.toISOString().split('T')[0]
      ) {
        valY = arrayWithMissingDates[j].essentialLinesInserted;
      }
    }
    linesAddedFilled[i] = {
      date: startDate.toISOString().split('T')[0],
      essentialLinesInserted: valY,
      lineType: lineType,
    };
    startDate.add(1, 'd');
  }
  return linesAddedFilled;
}

const mapName = {
  skill_perc_interactive: 'Interactive',
  skill_perc_UI: 'UI',
  skill_perc_auth: 'Auth',
  skill_perc_math: 'Math',
  skill_perc_server: 'Server',
  skill_perc_noSkill: 'General',
  skill_perc_event_handling: 'Event Handling',
  skill_perc_databases: 'Databases',
  skill_perc_state_management: 'State Management',
  skill_perc_api_calls: 'API Calls',
  skill_perc_map_reduce: 'Map Reduce',
};

const mapSurvivalStat = {
  // 'code contributed':'Code Contributed',
  'code not deleted': 'Surviving Code',
  'code deleted by self': 'Code Deleted by Self',
  'code deleted by others': 'Code Deleted by Others',
};

function FunctionalUserProfile() {
  const [searchId] = useContext(SearchContext);

  const currentUserData = useContext(DataContext);

  const [loadingState, setLoadingState] = useState(true);
  const [email, setEmail] = useState(' ');
  const [codeSurvivalStats, setCodeSurvivalStats] = useState([]);
  const [bulletText, setBulletText] = useState(null);
  const [filteredWeekData, setfilteredWeekData] = useState(
    filteredWeekData_placeholder,
  );
  const [skillStatsRadar3, setSkillStatsRadar3] = useState([]);
  const [skillStatsRadar12, setSkillStatsRadar12] = useState([]);
  const [skillStatsRadarAll, setSkillStatsRadarAll] = useState([]);
  const [skillPerc, setSkillPerc] = useState([]);
  const [codeExample, setCodeExample] = useState([]);
  // const [modalVisible, setModalVisible] = useState(false)
  const [aliasEmails, setAliasEmails] = useState([]);
  const [aliasNames, setAliasNames] = useState([]);
  // const [aliasId, setAliasId] = useState([])
  // const { switcher, themes, currentTheme, status } = useThemeSwitcher();
  // const [isDarkMode, setIsDarkMode] = React.useState(false);

  // const toggleDarkMode = () => {
  //   setIsDarkMode(previous => {
  //     switcher({ theme: previous ? themes.light : themes.dark });
  //     return !previous;
  //   });
  // };

  const { data: dataAuthor, loading: loadingAuthor } = useQuery(
    // const { data: dataAuthor, error: errorAuthor, loading: loadingAuthor } = useQuery(
    GET_AUTHOR,
    {
      skip: !searchId,
      variables: { id: searchId },
      // pollInterval: 1000,
    },
  );

  const { data: dataSkillRadar3mo, loading: loadingSkillRadar3mo } = useQuery(GET_SKILL_RADAR, {
    skip: !searchId,
    variables: { id: searchId, timeframe: '3 months' },
  });

  const { data: dataSkillRadar12mo, loading: loadingSkillRadar12mo } = useQuery(GET_SKILL_RADAR, {
    skip: !searchId,
    variables: { id: searchId, timeframe: '12 months' },
  });

  const { data: dataSkillRadarAll, loading: loadingSkillRadarAll } = useQuery(
    GET_SKILL_RADAR,
    {
      skip: !searchId,
      variables: { id: searchId, timeframe: 'alltime' },
    },
  );



  const { data: dataLines, loading: loadingLines } = useQuery(GET_LINES_ADDED, {
    skip: !searchId,
    variables: { id: searchId, startDate: threeMonthAgoISO },
  });

  const { data: dataSurvival, loading: loadingSurvival } = useQuery(
    GET_SURVIVAL_STAT,
    {
      skip: !searchId,
      variables: {
        codeSurvivalStatsFirst: 100,
        codeSurvivalStatsOrderBy: [
          {
            date: 'asc',
          },
        ],
        codeSurvivalStatsWhere: {
          superAuthorId: { equals: searchId },
          repoID: { equals: 'OVERALL' },
          survivalStat: {
            contains: 'deleted',
          },
        },
      },
    },
  );

  const { data: dataGeneral, loading: loadingGeneral } = useQuery(
    GET_GENERAL_STAT,
    {
      skip: !searchId,
      variables: { id: searchId },
    },
  );

  const { data: dataCodeExample } = useQuery(CODE_EXAMPLE, {
    variables: { id: searchId },
  });

  useEffect(() => {
    if (dataAuthor && dataAuthor.superAuthor) {
      setLoadingState(false);
      const userEmail = dataAuthor.superAuthor.displayEmail;
      setEmail(userEmail);
      const unique = (value, index, self) => {
        return self.indexOf(value) === index;
      };
      const authorsList = dataAuthor.superAuthor.authors;

      const nameList = authorsList
        .map((items) => {
          return items.name;
        })
        .filter(unique);
      setAliasNames(nameList);
      const emailList = authorsList
        .map((items) => {
          return items.email;
        })
        .filter(unique);
      setAliasEmails(emailList);
      // console.log("dataAuthor", dataAuthor);
      // setAliasId(dataAuthor.id)
    }
  }, [dataAuthor]);


  useEffect(() => {
    if (dataLines && dataLines.linesAddedStats) {
      setLoadingState(false);
      const strip_date = (a) => a.substring(0, 10);
      const tempLinesAdded = dataLines.linesAddedStats.map((item) => ({
        // ...item, date: strip_date(item.date)      }))
        essentialLinesInserted: item.numLines,
        date: strip_date(item.date),
        lineType: item.lineType,
      }));
      const tempLinesAddedUnique = Array.from(
        new Set(tempLinesAdded.map((x) => JSON.stringify(x))),
        (x) => JSON.parse(x),
      );

      const tempAllLinesDatesFilled = fillMissingDate(
        tempLinesAddedUnique,
        'all LOC',
      );
      const tempEssentialLinesDatesFilled = fillMissingDate(
        tempLinesAddedUnique,
        'essential',
      );
      const tempfiltedDatesAll = [
        ...tempAllLinesDatesFilled,
        ...tempEssentialLinesDatesFilled,
      ];
      const calendarData = tempfiltedDatesAll
        .filter((item) => item.lineType == 'all LOC')
        .map((item) => ({
          day: item.date,
          value: item.essentialLinesInserted,
        }));
      const calendarDataNoZero = calendarData.filter((e) => e.value !== 0);
      // console.log('calendarDataNoZero', calendarDataNoZero)
      setfilteredWeekData(calendarDataNoZero);
    }
  }, [dataLines]);

  useEffect(() => {
    if (dataSurvival && dataSurvival.codeSurvivalStats) {
      // console.log('dataSurvival', dataSurvival);
      let coveredDates = new Set();
      const tempDataSurvivalMap = dataSurvival.codeSurvivalStats.reduce(
        (res, item) => {
          // console.log("res", res);
          if (typeof res[mapSurvivalStat[item.survivalStat]] === 'undefined') {
            res[mapSurvivalStat[item.survivalStat]] = {
              data: [],
              id: mapSurvivalStat[item.survivalStat],
            };
            // console.log(`setting ${item.skill} to undefined`);
          }
          if (!coveredDates.has(item.survivalStat + item.date.slice(0, 10))) {
            res[mapSurvivalStat[item.survivalStat]]['data'].push({
              x: item.date.slice(0, 10),
              y: item.numLines,
            });
            coveredDates.add(item.survivalStat + item.date.slice(0, 10));
          }
          return res;
        },
        {},
      );
      const tempDataSurvival = Object.values(tempDataSurvivalMap);
      // const tempDataSurvival = [tempDataSurvivalMap['Code Deleted by Others']];
      // console.log('tempDataSurvivalMap', tempDataSurvivalMap);

      // const tempDataSurvival = dataSurvival.codeSurvivalStats.map(item=>({
      //    ...item,
      //   survivalStat:mapSurvivalStat[item.survivalStat],
      //   author: item.superAuthor.displayName
      // }))
      console.log('tempDataSurvival', tempDataSurvival);
      // setCodeSurvivalStatsDates(tempDataSurvivalDates);
      setCodeSurvivalStats(tempDataSurvival);
    }
  }, [dataSurvival]);

  useEffect(() => {
    if (dataSkillRadar3mo && dataSkillRadar3mo.skillStats) {
      var dataSkillRadar3moUnique = [];
      dataSkillRadar3mo.skillStats.filter(function (item) {
        var i = dataSkillRadar3moUnique.findIndex(
          (x) => x.skill === item.skill,
        );
        if (i <= -1) {
          dataSkillRadar3moUnique.push(item);
        }
        return null;
      });
      // console.log('dataSkillRadar3moUnique', dataSkillRadar3moUnique)
      const transposedData3mo = dataSkillRadar3moUnique.map((item) => ({
        skill: item.skill,
        '3 months': item.sentenceCount,
      }));
      // console.log('transposedData3mo', transposedData3mo)

      setSkillStatsRadar3(transposedData3mo);
    }
  }, [dataSkillRadar3mo]);

  useEffect(() => {
    if (dataSkillRadar12mo && dataSkillRadar12mo.skillStats) {
      var dataSkillRadar12moUnique = [];
      dataSkillRadar12mo.skillStats.filter(function (item) {
        var i = dataSkillRadar12moUnique.findIndex(
          (x) => x.skill === item.skill,
        );
        if (i <= -1) {
          dataSkillRadar12moUnique.push(item);
        }
        return null;
      });

      const transposedData12mo = dataSkillRadar12moUnique.map((item) => ({
        skill: item.skill,
        '12 months': item.sentenceCount,
      }));
      // console.log('transposedData12mo', transposedData12mo)
      setSkillStatsRadar12(transposedData12mo);
    }
  }, [dataSkillRadar12mo]);

  useEffect(() => {
    if (dataSkillRadarAll && dataSkillRadarAll.skillStats) {
      var tempdataSkillRadarAll = [];
      dataSkillRadarAll.skillStats.filter(function (item) {
        var i = tempdataSkillRadarAll.findIndex((x) => x.skill === item.skill);
        if (i <= -1) {
          tempdataSkillRadarAll.push(item);
        }
        return null;
      });

      const transposedDataAll = tempdataSkillRadarAll.map((item) => ({
        skill: item.skill,
        'all time': item.sentenceCount,
      }));
      // console.log("transposedDataAll", transposedDataAll);
      setSkillStatsRadarAll(transposedDataAll);
    }
  }, [dataSkillRadarAll]);

  useEffect(() => {
    if (dataGeneral && dataGeneral.generalStats) {
      console.log(dataGeneral.generalStats);
      // const uniqueGeneralStats = [...new Set(dataGeneral.generalStats)];
      const tempSkillPerc = dataGeneral.generalStats.filter((item) =>
        item.statType.includes('skill_per'),
      );
      // const tempSkillPercUnique = [...new Set(tempSkillPerc)];
      var tempSkillPercUnique = [];
      tempSkillPerc.filter(function (item) {
        var i = tempSkillPercUnique.findIndex(
          (x) => x.statType === item.statType,
        );
        if (i <= -1) {
          tempSkillPercUnique.push(item);
        }
        return null;
      });

      var tempSkillPercKeyPair = tempSkillPercUnique.reduce(function (r, e) {
        r[e.statType] = e.value;
        return r;
      }, {});

      var tempSkillPercOut = tempSkillPercUnique
        .filter(function (x) {
          if (x.statType === 'skill_perc_noSkill') {
            return false; // skip
          }
          return true;
        })
        .map((x) => ({
          skillName: mapName[x.statType],
          skillValue: x.value,
          skillPerc: parseFloat(x.value).toFixed(0),
        }));

      if (tempSkillPercKeyPair) {
        setSkillPerc(tempSkillPercOut);
      }
      // to be replaced later
      setBulletText(BulletPlaceholder);
    }
  }, [dataGeneral]);

  useEffect(() => {
    if (dataCodeExample && dataCodeExample.codeExamples) {
      var tempCodeExample = [];
      dataCodeExample.codeExamples.filter(function (item) {
        var i = tempCodeExample.findIndex((x) => x.skill === item.skill);
        if (i <= -1) {
          tempCodeExample.push(item);
        }
        return null;
      });
      // var tempCodeExampleKeyPair = tempCodeExample.reduce(function(r, e) {
      //   r[e.skill] = e.codeSentence;
      //   return r;
      // }, {});
      setCodeExample(tempCodeExample);
    }
  }, [dataCodeExample]);

  // const status = "Up";

  // survival stats bar
  let skillsRadarData = skillStatsRadarAll
    .concat(skillStatsRadar3)
    .concat(skillStatsRadar12)
    .reduce((res, item) => {
      if (typeof res[item.skill] === 'undefined') {
        res[item.skill] = {};
        // console.log(`setting ${item.skill} to undefined`);
      }
      const counts = Object.keys(item)
        .filter((key) => key != 'skill')
        .reduce((res, key) => {
          res[key] = item[key];
          return res;
        }, {});
      // console.log("pre-counts", item.skill, counts, res[item.skill]);
      res[item.skill] = Object.assign(res[item.skill], counts);
      // console.log("counts", item.skill, counts, res[item.skill]);
      return res;
    }, {});
  // console.log("skillsRadarData", skillsRadarData);

  skillsRadarData = Object.keys(skillsRadarData).reduce((res, key) => {
    const entry = skillsRadarData[key];
    entry['skill'] = mapName[`skill_perc_${key}`];
    res.push(entry);
    return res;
  }, []);

  skillsRadarData.sort(function (a, b) {
    if (a.skill < b.skill) {
      return -1;
    }
    if (a.skill > b.skill) {
      return 1;
    }
    return 0;
  });

  // console.log('skillsRadarData', skillsRadarData)

  const maxValue = skillsRadarData.reduce((res, item) => {
    if (item['3 months']) {
      res = Math.max(item['3 months'], res);
    }
    if (item['12 months']) {
      res = Math.max(item['12 months'], res);
    }
    if (item['all time']) {
      res = Math.max(item['all time'], res);
    }
    return res;
  }, 0);

  var skillStatsRadarAllWithExample = skillStatsRadarAll.reduce((arr, e) => {
    arr.push(
      Object.assign(
        {},
        e,
        codeExample.find((a) => a.skill === e.skill),
      ),
    );
    return arr;
  }, []);

  // if (skillStatsRadarAllWithExample && skillStatsRadarAllWithExample.length>0)

  // const partitionedSkills = new Array(Math.ceil(skillStatsRadarAllWithExample.length / skillsPerRow)).fill().map(
  //   (_,i) => skillStatsRadarAllWithExample.slice(i*skillsPerRow, i*skillsPerRow+skillsPerRow)
  // );

  // const partitionedSkillsPerc = new Array(Math.ceil(skillPerc.length / skillsPerRow)).fill().map(
  //   (_,i) => skillPerc.slice(i*skillsPerRow, i*skillsPerRow+skillsPerRow)
  // );
  const skillPercBullet = skillPerc
    .map((item) => {
      return {
        id: item.skillName,
        ranges: [0, 25, 50, 75, 100],
        measures: [item.skillValue],
        markers: [item.skillValue],
      };
    })
    .sort((a, b) => {
      if (a.measures[0] < b.measures[0]) {
        return 1;
      }
      if (a.measures[0] > b.measures[0]) {
        return -1;
      }
      return 0;
    });

  let survivalStatsBullet;
  const bulletTextDummyData = [
    <>
      Alice's Activity trend since last week is up <strong>26%</strong>
    </>,
    <>
      Ranked <strong>27</strong> in lines contributed
    </>,
    <>
      Ranked <strong>58</strong> in essential lines contributed
    </>,
    <>
      Total Essential lines higher than <strong>87%</strong> percent of
      developers
    </>,
  ];
  if (bulletText !== null) {
    survivalStatsBullet = (
      <>
        <InsightList data={bulletTextDummyData} />
      </>
    );
  }

  let eSsentialLinesBullet;
  if (bulletText !== null) {
    eSsentialLinesBullet = (
      <>
        <InsightList data={bulletTextDummyData} />
      </>
    );
  }

  let skillRadarBullet;
  if (bulletText !== null) {
    skillRadarBullet = (
      <>
        <InsightList data={bulletTextDummyData} />
      </>
    );
  }

  let skillRelativityBullet;
  if (bulletText !== null) {
    skillRelativityBullet = (
      <>
        <InsightList data={bulletTextDummyData} />
      </>
    );
  }

  return (
    <>
      <HorizontalBaseballCard searchId={searchId} showLink={false} compact={false} />
      <Tabs defaultActiveKey="1" style={styles.contentCard}>
        <TabPane
          tab={
            <span>
              <LineChartOutlined /> Stats
            </span>
          }
          key="1"
        >
          <Switch/>
          {/* <Switch onclick={toggleDarkMode}/> */}
          <Row gutter={[16, 16]}>
            <Col span="24" flex="true">
              {(loadingSurvival || codeSurvivalStats.length > 0) && (
                <GraphComponent
                  title="Code Longevity"
                  desc="Count of essential lines created and deleted"
                  icon={<BarChartOutlined />}
                  loadingState={loadingSurvival}
                  graphic={<SurvivalStatsChart data={codeSurvivalStats} />}
                  textData={survivalStatsBullet}
                />
              )}
              {!loadingSurvival && codeSurvivalStats.length == 0 && (
                <Space>
                  <Alert
                    message="We haven't found any code longevity data for this author in the past three months."
                    type="warning"
                    showIcon
                    closable
                  />
                </Space>
              )}
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span="24" flex="true">
              {(loadingLines || filteredWeekData.length > 0) && (
                <GraphComponent
                  title="Essential Lines Written"
                  desc="Essential lines are lines that are essential to a skill, excluding lines like exports, imports, readme ..."
                  icon={<CalendarOutlined />}
                  loadingState={loadingLines}
                  graphic={<EssentialLinesCalendar data={filteredWeekData} />}
                  textData={eSsentialLinesBullet}
                />
              )}
              {!loadingLines && filteredWeekData.length == 0 && (
                <Space>
                  <Alert
                    message="We haven't found any essential lines calendar data for this author in the past three months."
                    type="warning"
                    showIcon
                    closable
                  />
                </Space>
              )}
            </Col>
            {/* {filteredWeekData &&
              <h4>total {filteredWeekData.length} active days in the past 6 month </h4>
              } */}
          </Row>
          <Row gutter={[16, 16]}>
            <Col span="24" flex="true">
              {(loadingSkillRadarAll || skillsRadarData.length > 0) && (
                <GraphComponent
                  title="Skill Radar"
                  desc="progress of skill sover time"
                  icon={<RadarChartOutlined />}
                  loadingState={loadingSkillRadarAll}
                  graphic={
                    <SkillRadarChart
                      data={skillsRadarData}
                      maxValue={maxValue}
                    />
                  }
                  textData={skillRadarBullet}
                />
              )}

              {!loadingSkillRadarAll && skillsRadarData.length == 0 && (
                <Space>
                  <Alert
                    message="We haven't found any skills data for this author."
                    type="warning"
                    showIcon
                    closable
                  />
                </Space>
              )}
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span="24" flex="true">
              {(loadingGeneral || skillPercBullet.length > 0) && (
                <GraphComponent
                  title="Skill Relativity"
                  desc="skill level compared to all contributors"
                  icon={<UnorderedListOutlined />}
                  loadingState={loadingGeneral}
                  graphic={<SkillRelativityChart data={skillPercBullet} />}
                  textData={skillRelativityBullet}
                />
              )}

              {!loadingGeneral && skillPercBullet.length == 0 && (
                <Space>
                  <Alert
                    message="We haven't found any skill ranking data for this author."
                    type="warning"
                    showIcon
                    closable
                  />
                </Space>
              )}
            </Col>
          </Row>
        </TabPane>

        <TabPane
          tab={
            <span>
              <CodeOutlined /> Code Examples
            </span>
          }
          key="2"
        >
          {skillStatsRadarAllWithExample &&
          skillStatsRadarAllWithExample.length > 0 &&
          'codeSentence' in skillStatsRadarAllWithExample[0] ? (
            skillStatsRadarAllWithExample.map((item) => (
              <GraphComponent
                title={item.skill}
                icon={<CodeOutlined />}
                loadingState={loadingState}
                // graphic={<pre>{`Hello World`}</pre>}
                graphic={
                  item.codeSentence ? (
                    <div>
                      <Row gutter={[0, 0]}>
                        <Col span="22">
                          <SyntaxHighlighter
                            language="javascript"
                            style={coy}
                            wrapLines={true}
                            // showLineNumbers={true}
                            // codeTagProps={{ style: { fontFamiily: "times new roman" } }}
                          >
                            {item.codeSentence}
                          </SyntaxHighlighter>
                        </Col>
                        <Col span="2">
                          <Feedback />
                        </Col>
                      </Row>
                    </div>
                  ) : (
                    <div />
                  )
                }
              />
            ))
          ) : (
            <GraphComponent
              title="Code examples"
              icon={<CodeOutlined />}
              loadingState={loadingState}
              graphic={<div />}
            />
          )}
        </TabPane>
        {(email === currentUserData.currentLoggedInUser.email ||
          currentUserData.currentLoggedInUser.email.endsWith(
            'dev2vec.com',
          )) && (
          <TabPane
            tab={
              <span>
                <UserSwitchOutlined /> Aliases
              </span>
            }
            key="3"
          >
            <AliasComponent
              names={aliasNames}
              emails={aliasEmails}
              ids={searchId}
            />
          </TabPane>
        )}
      </Tabs>
    </>
  );
}

const styles = {
  siteCardBorderLessWrapper: {
    paddingLeft: '16px',
    paddingRight: '16px',
  },
  topMargin: { marginTop: '10px' },
  cardBackground: { background: '#cfcfcf' },
  cardTitleBackground: { background: '#ececec' },
  contentCard: { paddingLeft: '16px', paddingRight: '16px' },
};

export default FunctionalUserProfile;
