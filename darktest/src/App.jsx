import React, { useRef, useState, useEffect } from 'react'; // import logo from './logo.svg';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Button, Image, Layout, Menu, Popover, Space, Spin } from 'antd';
import './App.css';
import UserProfile from './userprofile';
import { Helmet } from 'react-helmet';
import Searchbar from './searchbar';

import {
  CodeOutlined,
  RadarChartOutlined,
  BulbOutlined,
  UnorderedListOutlined,
  BarChartOutlined,
  AreaChartOutlined,
  LineChartOutlined,
  // DotChartOutlined, TeamOutlined,
  GitlabOutlined,
  IssuesCloseOutlined,
  SlackOutlined,
  GithubOutlined,
  DownOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
  LoadingOutlined,
  WarningTwoTone,
} from '@ant-design/icons';
import RecruiterView from './recruiter/RecruiterView';

export const CURRENT_USER_QUERY = gql`
  query {
    currentLoggedInUser
  }
`;

export const SUPERAUTHORS_QUERY = gql`
  query {
    currentLoggedInUser {
      id
      googleId
      firstName
      lastName
      email
    }
    randomSuperAuthor {
      displayName
      displayEmail
      id
      authors {
        name
        email
        parentRepo {
          remoteUrl
        }
      }
    }
  }
`;

const { Header, Footer, Sider, Content } = Layout;
const DataContext = React.createContext(null);
const SearchContext = React.createContext(null);
const EmailMergeContext = React.createContext(null);
const PageSelectorContext = React.createContext(null);

const logout = () => {
  let path = `https://dev-d2vapi.dreamy-euclid.devsentient.com/auth/logout`;
  window.location = path;
};

function App() {
  const menuRef = useRef(null);
  const [dsData, setDsData] = useState(null);
  const [searchId, setSearchId] = useState(
    '7f00086d-545c-4839-b316-03ce4a402048',
  );
  const [emailMergeLoading, setEmailMergeLoading] = useState(false);
  const [pageSelector, setPageSelector] = useState('profile');

  const { loading, error, data } = useQuery(SUPERAUTHORS_QUERY);
  // const { loadingCurrentUser, errorCurrentUser, dataCurrentUser } = useQuery(CURRENT_USER_QUERY);
  useEffect(() => {
    console.log("menuRef", menuRef);
    if ( !!!menuRef || !!!menuRef.current ) {
      return;
    }
    console.log("menuRef.current", menuRef.current);
    menuRef.current.forceUpdate();    
  }, [pageSelector]);


  if (loading) {
    return (
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <h1>Inventing Artificial General Intelligence...</h1>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    console.log('error authenticating');
    return (
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <a
          href={`${
            import.meta.env.SNOWPACK_PUBLIC_REACT_APP_GQL_ENDPOINT
          }/auth/google`}
          className="btn btn-primary"
        >
          Sign in with Google
        </a>
      </div>
    );
  }

  if (dsData == null) {
    setDsData(data);
    setSearchId(data.randomSuperAuthor.id);
  }


  return (
    <EmailMergeContext.Provider
      value={[emailMergeLoading, setEmailMergeLoading]}
    >
      <PageSelectorContext.Provider value={[pageSelector, setPageSelector]}>
        <DataContext.Provider value={dsData}>
          <SearchContext.Provider value={[searchId, setSearchId]}>
            <div className="App">
              <Layout>
                <Helmet title="DevSentient" />
                <Header>
                  <div
                    style={{
                      float: 'left',
                      width: '5%',
                      paddingRight: '10px',
                      marginLeft: '-48px',
                    }}
                  >
                    <Image width={48} src="/dev-sentient-applogo-white.svg" />
                  </div>
                  <div
                    style={{
                      float: 'left',
                      width: '45%',
                      paddingRight: '10px',
                    }}
                  >
                    {pageSelector == 'profile' && 
                    <Menu
                      ref={menuRef}
                      theme="dark"
                      mode="horizontal"
                      defaultSelectedKeys={['profile']}
                      onSelect={(e) => {
                        setPageSelector(e.key);
                        console.log(`${e.key} selected`);
                      }}
                    >
                      <Menu.Item key="dashboard" disabled="true">
                        Dasboard
                      </Menu.Item>
                      <Menu.Item key="profile">Developers</Menu.Item>
                      <Menu.Item key="recruiter">Explore</Menu.Item>
                      <Menu.Item key="settings" disabled="true">
                        Profile
                      </Menu.Item>
                    </Menu>}

                    {pageSelector == 'recruiter' && 
                    <Menu
                      ref={menuRef}
                      theme="dark"
                      mode="horizontal"
                      defaultSelectedKeys={['recruiter']}
                      onSelect={(e) => {
                        setPageSelector(e.key);
                        console.log(`${e.key} selected`);
                      }}
                    >
                      <Menu.Item key="dashboard" disabled="true">
                        Dasboard
                      </Menu.Item>
                      <Menu.Item key="profile">Developers</Menu.Item>
                      <Menu.Item key="recruiter">Explore</Menu.Item>
                      <Menu.Item key="settings" disabled="true">
                        Profile
                      </Menu.Item>
                    </Menu>}
                  </div>
                  <div
                    style={{ float: 'right', width: '5%', alignItems: 'right' }}
                  >
                    <Space>
                      <Popover content={'Sign out'}>
                        <Button
                          onClick={logout}
                          icon={<LogoutOutlined />}
                          shape="circle"
                        />
                      </Popover>
                      {data.currentLoggedInUser.email.endsWith(
                        'dev2vec.com',
                      ) && (
                        <Popover content={'Admin Mode'}>
                          <WarningTwoTone />
                        </Popover>
                      )}
                    </Space>
                  </div>
                  <div style={{ float: 'right', width: '45%' }}>
                    <Searchbar />
                  </div>
                </Header>
                <Content>
                  {pageSelector == 'profile' && <UserProfile />}
                </Content>
                <Content>
                  {pageSelector == 'recruiter' && <RecruiterView />}
                </Content>
                <Footer>DevSentient 2020 ©</Footer>
              </Layout>
            </div>
          </SearchContext.Provider>
        </DataContext.Provider>
      </PageSelectorContext.Provider>
    </EmailMergeContext.Provider>
  );
}

export { DataContext, SearchContext, EmailMergeContext, PageSelectorContext };

export default App;
