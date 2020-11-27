import React, { useState, useEffect } from 'react';

import { Button, notification } from 'antd';

import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';

const openNotificationWithIcon = (type, title, message) => {
  notification[type]({
    message: title,
    description: message,
  });
};

const Feedback = (props) => {
  return (
    <div>
      <Button
        type="link"
        shape="circle"
        icon={<LikeOutlined />}
        onClick={() => {
          openNotificationWithIcon(
            'success',
            'Feedback',
            'We received your feedback and will incorporate it into the next AI model training run.',
          );
        }}
      />
      <Button
        type="link"
        shape="circle"
        icon={<DislikeOutlined />}
        onClick={() => {
          openNotificationWithIcon(
            'success',
            'Feedback',
            'We received your feedback and will incorporate it into the next AI model training run.',
          );
        }}
      />
    </div>
  );
};

export default Feedback;
