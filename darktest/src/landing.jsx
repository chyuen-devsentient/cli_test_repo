import 'antd/dist/antd.css';

import React, {useState, useEffect, useContext}  from 'react'
import { Helmet } from 'react-helmet';

import { Layout, Typography, Card, Button } from 'antd';

import './App.css';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

function LandingPage() {
    
    return (
      <Layout roles={['admin']} redirect to="/landing">
        <Helmet title="Welcome" />
        <Content>
          <Card color='purple'>
            <Button>Login</Button>
          </Card>
        </Content>

      </Layout>
    )
  }
  
  const styles = {
    siteCardBorderLessWrapper: {
      paddingLeft: '16px',
      paddingRight: '16px'
    },
    topMargin: { marginTop: '10px' },
    cardBackground: { background: '#cfcfcf' },
    cardTitleBackground: { background: '#ececec' },
    contentCard: {paddingLeft: '16px', paddingRight: '16px',}
  };
  
export default LandingPage;
