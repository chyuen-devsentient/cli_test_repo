/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useState, useEffect } from 'react';
import './themes.css';


const Themes = () => {
  let customCss = null;
  if (!customCss) {
    customCss = 'antd/dist/antd.dark.css';
  }
  return (
    <link rel="stylesheet" type="text/css" href={customCss} />
  );
};



export default Themes;