import 'antd/dist/antd.css';

import { Skeleton, Row, Col, Tooltip, Card } from 'antd';
import React from 'react';

class GraphComponent extends React.Component {
  render() {
    return (
      <Row gutter={16} style={styles.siteCardBorderLessWrapper}>
        <Col span={24}>
          <Card
            height={250}
            title={
              <div>
                {this.props.icon}
                <Tooltip title={this.props.desc}>
                  <span> {this.props.title}</span>
                </Tooltip>
              </div>
            }
            bordered={false}
            style={styles.topMargin}
          >
            <Row>
              <Skeleton loading={this.props.loadingState} active>
                <Col span="16" flex="true">
                  {this.props.graphic}
                </Col>
                <Col span="8" flex="true" style={{ paddingTop: '50px' }}>
                  <Row>{this.props.textData}</Row>
                </Col>
              </Skeleton>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  }
}

const styles = {
  siteCardBorderLessWrapper: {
    paddingLeft: '16px',
    paddingRight: '16px',
  },
  topMargin: { marginTop: 16 },
  cardBackground: { background: '#cfcfcf' },
  cardTitleBackground: { background: '#ececec' },
  contentCard: { paddingLeft: '16px', paddingRight: '16px' },
};

export default GraphComponent;
