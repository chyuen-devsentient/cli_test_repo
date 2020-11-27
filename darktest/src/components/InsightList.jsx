import React from 'react'

import {
    List
} from 'antd';

import {
    BulbOutlined
} from '@ant-design/icons';

import Feedback from './Feedback';

function InsightList(props) {
    return (
        <div>
            <List
                footer={
                    <Feedback />
                }
                dataSource={props.data}
                style={{textAlign: 'left'}}
                renderItem={item => (
                <List.Item>
                    <BulbOutlined /> {item}
                </List.Item>
                )}
            />
        </div>
    )
}

export default InsightList;
