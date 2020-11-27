import {
  Row,
  Col,
  Card,
  Dropdown,
  Button,
  Spin,
  Statistic,
  Progress,
  notification,
  Skeleton,
  Typography,
  Empty,
  Menu,
  Space,
  Alert,
  Tooltip,
} from 'antd';

import {
  // DotChartOutlined, TeamOutlined,
  GitlabOutlined,
  IssuesCloseOutlined,
  SlackOutlined,
  GithubOutlined,
  DownOutlined,
} from '@ant-design/icons';

import Gravatar from 'react-gravatar';
import { gql, useQuery } from '@apollo/react-hooks';

const { Title, Paragraph, Link } = Typography;

import React, { useEffect, useState, useContext } from 'react';

import originalFetch from 'isomorphic-fetch';
import fetchRetry from 'fetch-retry';
import { SearchContext, PageSelectorContext } from '../App';
import Text from 'antd/lib/typography/Text';

const fetch = fetchRetry(originalFetch, {
  retries: 5,
  retryDelay: 800,
});

const COMPONENT_QUERY = gql`
  query Query(
    $generalStatsWhere: GeneralStatWhereInput
    $generalStatsOrderBy: [GeneralStatOrderByInput!]
    $generalStatsFirst: Int
    $superAuthorWhere: SuperAuthorWhereUniqueInput!
  ) {
    generalStats(
      where: $generalStatsWhere
      orderBy: $generalStatsOrderBy
      first: $generalStatsFirst
    ) {
      statType
      value
    }
    superAuthor(where: $superAuthorWhere) {
      displayName
      displayEmail
      id
      authors {
        name
        email
        parentRepoId
        parentRepo {
          remoteUrl
        }
        essentialLinesCount {
          essentialLinesInserted
          date
        }
        skills {
          skill
          sentenceCount
        }
      }
    }
  }
`;

const openNotificationWithIcon = (type, title, message) => {
  notification[type]({
    message: title,
    description: message,
  });
};

function abbrNum(n) {
  if (!n || (n && typeof n !== 'number')) {
    return '';
  }

  const ranges = [
    { divider: 1e12, suffix: 't' },
    { divider: 1e9, suffix: 'b' },
    { divider: 1e6, suffix: 'm' },
    { divider: 1e3, suffix: 'k' },
  ];
  const range = ranges.find((r) => Math.abs(n) >= r.divider);

  if (range) {
    return (n / range.divider).toFixed(1) + range.suffix;
  }
  return n.toString();
}

function unique(value, index, self) {
  return self.indexOf(value) === index;
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

function HorizontalBaseballCard({
  searchId,
  showLink,
  compact,
  sortTableData,
}) {
  const [, setSearchId] = useContext(SearchContext);
  const [, setPageSelector] = useContext(PageSelectorContext);
  // const [searchId] = useContext(SearchContext);
  const [email, setEmail] = useState(' ');
  const [name, setName] = useState(' ');
  const [location, setLocation] = useState(' ');
  const [githubResult, setGithubResult] = useState({ disabled: true });
  const [percentEssential, setPercentageEssential] = useState(0);
  const [totalEssentialLines, setTotalEssentialLines] = useState(0);
  const [totalAddedCommits, setTotalAddedCommits] = useState(0);
  const [totalAddedLines, setTotalAddedLines] = useState(0);
  const [numRepos, setNumRepos] = useState(1);
  const [avgCodeSurvivalTime, setAvgCodeSurvivalTime] = useState([]);
  const [repoOrigins, setRepoOrigins] = useState([]);
  const [skillPerc, setSkillPerc] = useState([]);

  if (!!!searchId) {
    console.log('searchId not set');
    return <Empty />;
  }
  const queryVars = {
    superAuthorWhere: {
      id: searchId,
    },
    generalStatsWhere: {
      superAuthorId: { equals: searchId },
    },
    generalStatsOrderBy: [
      {
        timestamp: 'desc',
      },
    ],
    generalStatsFirst: 30,
  };
  // console.log('queryVars', queryVars);
  const {
    data: queryData,
    loading: queryLoading,
    error: queryError,
  } = useQuery(COMPONENT_QUERY, {
    variables: queryVars,
  });

  useEffect(() => {
    // console.log('queryData', queryData);
    if (!!!queryData) {
      return;
    }
    setName(queryData.superAuthor.displayName);
    setEmail(queryData.superAuthor.displayEmail);

    fetch('https://api.github.com/search/users?q=' + email, {
      retryOn: function (attempt, error, response) {
        // retry on any network error, or 4xx or 5xx status codes
        if (error !== null || response.status >= 400) {
          // console.log(`retrying, attempt number ${attempt + 1}`);
          return true;
        }
      },
      retryDelay: function (attempt, _error, _response) {
        return Math.pow(2, attempt) * 1000; // 1000, 2000, 4000
      },
    })
      .then((resp) => {
        return resp.json();
      })
      .catch((_json) => {
        setGithubResult({ disabled: true });
        setLocation('');
      })
      .then((json) => {
        setGithubResult({ href: json.items[0].html_url });
        fetch(json.items[0].url)
          // console.log(json.items[0].html_url)
          .then((resp) => {
            return resp.json();
          })
          .then((apiJson) => {
            setLocation(apiJson.location);
          });
      })
      .catch((_json) => {
        setLocation('');
      });

    const tempEssentialPerc = queryData.generalStats.filter(
      (item) => item.statType === 'percentEssentialCode',
    );
    const tempEssentialLines = queryData.generalStats.filter(
      (item) => item.statType === 'totalEssentialLinesAdded',
    );
    const tempAddedCommits = queryData.generalStats.filter(
      (item) => item.statType === 'totalCommits',
    );
    const tempLinesAdded = queryData.generalStats.filter(
      (item) => item.statType === 'totalLinesAdded',
    );
    const tempSkillPerc = queryData.generalStats.filter((item) =>
      item.statType.includes('skill_per'),
    );

    const tempAvgCodeSurvivalTime = queryData.generalStats.filter((item) =>
      item.statType.includes('avgCodeSurvivalTime'),
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
      }))
      .sort((a, b) => {
        if (a.skillPerc < b.skillPerc) {
          return 1;
        }
        if (a.skillPerc > b.skillPerc) {
          return -1;
        }
        return 0;
      });

    if (tempEssentialPerc[0]) {
      setPercentageEssential(tempEssentialPerc[0].value);
    }
    if (tempEssentialLines[0]) {
      setTotalEssentialLines(abbrNum(tempEssentialLines[0].value));
    }
    if (tempAddedCommits[0]) {
      setTotalAddedCommits(abbrNum(tempAddedCommits[0].value));
    }
    if (tempLinesAdded[0]) {
      setTotalAddedLines(abbrNum(tempLinesAdded[0].value));
    }

    if (tempAvgCodeSurvivalTime[0]) {
      setAvgCodeSurvivalTime(
        abbrNum(Math.round(tempAvgCodeSurvivalTime[0].value / (60 * 60 * 24))),
      );
    }

    const authorsList = queryData.superAuthor.authors;
    const repoList = authorsList
      .map((items) => {
        return items.parentRepo.remoteUrl;
      })
      .filter(unique);
    setRepoOrigins(repoList);
    const tempTotalRepo = repoList.length;
    setNumRepos(tempTotalRepo);

    if (tempSkillPercOut) {
      setSkillPerc(tempSkillPercOut);
    }
    return () => {
      //cleanup
    };
  }, [queryData]);

  if (queryLoading) {
    return (
      <div>
        <Skeleton active />
      </div>
    );
  }

  if (queryError) {
    openNotificationWithIcon(
      'error',
      'Internal Error',
      'We encountered an internal error. Please contact support@devsentient.com',
    );
    console.log('Query error:', queryError);
    return (
      <div>
        <Skeleton />
      </div>
    );
  }
  if (!!!compact) {
    return (
      <div>
        <Card>
          <Row>
            <Col span="4" flex={false}>
              <Gravatar
                email={email}
                default="mp"
                style={{ borderRadius: '50%' }}
                size={120}
              />
            </Col>
            <Col span="4" flex="true">
              <Row>
                <Title level={4}>
                  {showLink && (
                    <Link
                      onClick={() => {
                        setSearchId(searchId);
                        setPageSelector('profile');
                      }}
                    >
                      {name}
                    </Link>
                  )}
                  {!!!showLink && <Text copyable>{name}</Text>}
                </Title>
              </Row>
              <Row>
                <Paragraph copyable style={{ color: 'grey', fontSize: 12 }}>
                  {email}
                </Paragraph>
              </Row>
              {location && location.length > 0 && location.trim() !== '' && (
                <Row>
                  <Paragraph copyable style={{ color: 'grey', fontSize: 12 }}>
                    {location}
                  </Paragraph>
                </Row>
              )}
              <Row>
                <strong>Integrations:&nbsp;</strong>
                <Paragraph>
                  {' '}
                  <a {...githubResult}>
                    <GithubOutlined />
                  </a>{' '}
                  <GitlabOutlined /> <IssuesCloseOutlined /> <SlackOutlined />
                </Paragraph>
              </Row>
              <Row>
                <Dropdown
                  overlay={
                    <Menu>
                      {repoOrigins.map(function (menuitem, index) {
                        return (
                          <Menu.Item key={index}>
                            <a href={menuitem}>{menuitem}</a>
                          </Menu.Item>
                        );
                      })}
                    </Menu>
                  }
                >
                  <Button>
                    Repositories <DownOutlined />
                  </Button>
                </Dropdown>
              </Row>
            </Col>

            <Col span="16" flex="true">
              <Row justify="start" gutter={[16, 16]}>
                <Col span="4">
                  <Statistic
                    title={'Essential Code'}
                    value={percentEssential}
                    suffix="%"
                  />
                </Col>
                <Col span="4">
                  <Statistic
                    title={'Contributed LoC'}
                    value={totalAddedLines}
                  />
                </Col>
                <Col span="4">
                  <Statistic
                    title={'Code Longevity'}
                    value={avgCodeSurvivalTime}
                    suffix="days"
                  />
                </Col>
                <Col span="4">
                  <Statistic
                    title={'Total commits'}
                    value={totalAddedCommits}
                  />
                </Col>
                <Col span="4">
                  <Statistic title={'Repos'} value={numRepos} />
                </Col>
                <Col span="4">
                  <Statistic
                    title={'Essential Lines'}
                    value={totalEssentialLines}
                  />
                </Col>
              </Row>
              <Row justify="start" gutter={[16, 0]}>
                {skillPerc.length > 0 &&
                  skillPerc.slice(0, 6).map((item) => {
                    return (
                      <Col span="4">
                        <Card
                          type="inner"
                          title={item.skillName}
                          size="small"
                          bordered={false}
                        >
                          <Progress percent={item.skillPerc} size="small" />
                        </Card>
                      </Col>
                    );
                  })}

                {skillPerc.length == 0 && (
                  <Space>
                    <Alert
                      message="We haven't found any code examples that our AI can analyze for this author."
                      type="warning"
                      showIcon
                      closable
                    />
                  </Space>
                )}
              </Row>
            </Col>

            <Col span="3"></Col>
          </Row>
        </Card>
      </div>
    );
  }

  if (compact) {
    return (
      <div>
        <Card>
          <Row>
            <Col flex="140px">
              <Row>
                <Title ellipsis level={4}>
                  {showLink && (
                    <Tooltip title={name}>
                      <Link
                        onClick={() => {
                          setSearchId(searchId);
                          setPageSelector('profile');
                        }}
                      >
                        {name}
                      </Link>
                    </Tooltip>
                  )}
                  {!!!showLink && name}
                </Title>
              </Row>

              <Row>
                <Gravatar
                  email={email}
                  default="mp"
                  style={{ borderRadius: '50%' }}
                  size={120}
                />
              </Row>
              <Row>
                <Paragraph style={{ color: 'grey', fontSize: 12 }}>
                  {location}
                </Paragraph>
              </Row>
            </Col>

            <Col flex="auto">
              <Row justify="start" gutter={[16, 16]}>
                <Col span="4">
                  <Statistic
                    title={'Essential Code'}
                    value={percentEssential}
                    suffix="%"
                  />
                </Col>
                <Col span="4">
                  <Statistic
                    title={'Contributed LoC'}
                    value={totalAddedLines}
                  />
                </Col>
                <Col span="4">
                  <Statistic
                    title={'Code Longevity'}
                    value={avgCodeSurvivalTime}
                    suffix="days"
                  />
                </Col>
                <Col span="4">
                  <Statistic
                    title={'Total commits'}
                    value={totalAddedCommits}
                  />
                </Col>
                <Col span="4">
                  <Statistic title={'Repos'} value={numRepos} />
                </Col>
                <Col span="4">
                  <Statistic
                    title={'Essential Lines'}
                    value={totalEssentialLines}
                  />
                </Col>
              </Row>
              {sortTableData.filter((item) => item.stat.enabled).length !=
                0 && (
                <Row justify="start" gutter={[16, 0]}>
                  {skillPerc.length > 0 &&
                    sortTableData
                      .filter((item) => item.stat.enabled)
                      .filter((item) => {
                        return skillPerc.find(
                          (skillItem) => item.stat.name === skillItem.skillName,
                        );
                      })
                      .map((item) => {
                        const first = skillPerc.find(
                          (skillItem) => item.stat.name === skillItem.skillName,
                        );
                        return (
                          <Col span="4">
                            <Card
                              type="inner"
                              title={first.skillName}
                              size="small"
                              bordered={false}
                            >
                              <Progress
                                percent={first.skillPerc}
                                size="small"
                              />
                            </Card>
                          </Col>
                        );
                      })}
                  {skillPerc.length == 0 && (
                    <Space>
                      <Alert
                        message="We haven't found any code examples that our AI can analyze for this author."
                        type="warning"
                        showIcon
                        closable
                      />
                    </Space>
                  )}
                </Row>
              )}
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

export default HorizontalBaseballCard;
